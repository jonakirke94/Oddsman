using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Scraper.Core.Data;
using Scraper.Core.Model;
using Scraper.Core.Scraper;
using Scraper.Core.Scraper.DanskeSpil;

namespace Scraper.Core.Controller
{
    public class TaskController
    {
        private readonly DanskeSpilScraper _scraper = new DanskeSpilScraper();

        /// <summary>
        /// Scrapes the Match Rounds and their values, then adds them to the database.
        /// </summary>
        public async Task ScrapeMatchRounds()
        {
            try
            {
                var rounds = _scraper.GetMatchRounds();

                using (var ctx = new DanskeSpilContext())
                {
                    ctx.MatchRounds.AddRange(rounds);
                    await ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }


        public async Task ScrapeUpcomingMatches()
        {
            var matches = new List<Match>(_scraper.GetUpcomingMatches());

            var validMatches = matches
                .Select(m => m)
                .Where(m => WithinValidDate(m.MatchDate))
                .ToList();

            Parallel.ForEach(validMatches, (match) =>
            {
                match.SubMatches = new List<SubMatch>(_scraper.GetSubMatches(match.SubMatchLink));
            });


            try
            {
                using (var db = new DanskeSpilContext())
                {
                    db.Matches.AddRange(validMatches);
                    await db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        
        /// <summary>
        /// Valid matches is found between Saturday 12.00 and Monday 23.59
        /// </summary>
        /// <param name="date"></param>
        /// <returns></returns>
        private static bool WithinValidDate(DateTime date)
        {

            var nextSaturday = GetNextWeekday(DateTime.Now.Date, DayOfWeek.Saturday).AddHours(12);
            var nextMonday = GetNextWeekday(DateTime.Now.Date, DayOfWeek.Monday).AddHours(23).AddMinutes(59);

            return date >= nextSaturday && date <= nextMonday;
        }

        private static DateTime GetNextWeekday(DateTime start, DayOfWeek day)
        {
            // The (... + 7) % 7 ensures we end up with a value in the range [0, 6]
            var daysToAdd = ((int)day - (int)start.DayOfWeek + 7) % 7;
            return start.AddDays(daysToAdd);
        }

        private static void SetRoundNumber()
        {
            throw new NotImplementedException(); //TODO: Implement
        }
    }
}
