using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hangfire;
using Microsoft.Extensions.DependencyInjection;
using Scraper.Core.Data;
using Scraper.Core.Extensions;
using Scraper.Core.Model;
using Scraper.Core.Scraper.DanskeSpil;

namespace Scraper.API.Services
{
    public class AutomationService
    {
        private readonly DanskeSpilScraper _scraper = new DanskeSpilScraper();
        private readonly IServiceScopeFactory _scopeFactory;

        public AutomationService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public async Task ScrapeUpcomingMatches(DateRange range = null)
        {
            if (range == null)
            {
                range = new DateRange
                {
                    Start = DateTime.Today,
                    End =  DateTime.Today.AddDays(2).AddHours(23).AddMinutes(59)
                };
            }

            var matches = new List<Match>(_scraper.GetUpcomingMatches(range));

            var validMatches = matches
                .Select(m => m)
                .Where(m => m.MatchDate.InRangeOf(range))
                .ToList();

            var subMatches = new List<Match>();

            Parallel.ForEach(validMatches, new ParallelOptions { MaxDegreeOfParallelism = 4 }, (match) =>
            {
                var sms = _scraper.GetSubMatches(match.EventId);
                foreach (var sm in sms)
                {
                    sm.ParentId = match.MatchId;
                    sm.EventId = match.EventId;
                }
                subMatches.AddRange(sms);
            });

            var allValidMatches = validMatches.Concat(subMatches).ToList();

            try
            {
                using (var scope = _scopeFactory.CreateScope())
                {
                    using (var db = scope.ServiceProvider.GetRequiredService<DanskeSpilContext>())
                    {
                        db.Matches.AddRange(allValidMatches);
                        await db.SaveChangesAsync();
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public async Task ScrapeMatchResult(int matchId)
        {
            try
            {
                using (var scope = _scopeFactory.CreateScope())
                {
                    using (var db = scope.ServiceProvider.GetRequiredService<DanskeSpilContext>())
                    {
                        var match = db.Matches.Find(matchId);
                        if (match != null)
                        {
                            var result = _scraper.GetMatchResult(match.RoundId, matchId, match.ParentId);
                            if (result != null)
                            {
                                db.Results.Add(result);
                                await db.SaveChangesAsync();
                            }
                            // TODO: Add complete failure notifications
                        }
                        // TODO: Add complete failure notifications
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }


        ///// <summary>
        ///// Valid matches is found between Saturday 12.00 and Monday 23.59
        ///// </summary>
        ///// <param name="date"></param>
        ///// <returns></returns>
        //private static bool WithinValidDate(DateTime date)
        //{
        //    var today = DateTime.Today;
        //    switch (today.DayOfWeek) // Making sure that the next occuring weekday is Monday or Saturday (not counting the current day).
        //    {
        //        case DayOfWeek.Monday:
        //            today = today.AddDays(1);
        //            break;
        //        case DayOfWeek.Saturday:
        //            today = today.AddDays(1);
        //            break;
        //    }

        //    var nextSaturday = GetNextWeekday(today, DayOfWeek.Saturday).AddHours(12);
        //    var nextMonday = GetNextWeekday(today, DayOfWeek.Monday).AddHours(23).AddMinutes(59);
           
        //    return date.InRangeOf(nextSaturday, nextMonday);
        //}

        //private static DateTime GetNextWeekday(DateTime start, DayOfWeek day)
        //{
        //    // The (... + 7) % 7 ensures we end up with a value in the range [0, 6]
        //    var daysToAdd = ((int)day - (int)start.DayOfWeek + 7) % 7;
        //    return start.AddDays(daysToAdd);
        //}

        
    }
}