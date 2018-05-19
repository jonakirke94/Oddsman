using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hangfire;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Scraper.API.Services;
using Scraper.Core.Data;
using Scraper.Core.Extensions;
using Scraper.Core.Model;
using Scraper.Core.Scraper.DanskeSpil;

namespace Scraper.API.Controllers
{

    [Route("api/v1/[controller]")]
    public class TaskController : Controller
    {
        private readonly AutomationService _automate;
        private readonly IServiceScopeFactory _scopeFactory;

        public TaskController(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
            _automate = new AutomationService(_scopeFactory);
        }


        [HttpPost("{matchId}")]
        [ProducesResponseType(200, Type = typeof(string))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> ScheduleMatchResultScrape(int matchId)
        {

            using (var scope = _scopeFactory.CreateScope())
            {
                using (var db = scope.ServiceProvider.GetRequiredService<DanskeSpilContext>())
                {
                    try
                    {
                        var match = db.Matches.FirstOrDefault(m => m.MatchId == matchId);
                        if (match == null) return NotFound();
                        
                        var difference = (match.MatchDate.AddHours(3) - DateTime.Now).Ticks;
                        var timespan = TimeSpan.FromTicks(difference);

                        if (difference < 0)
                        {
                            timespan = TimeSpan.FromHours(1);
                        }

                        BackgroundJob.Schedule(() => _automate.ScrapeMatchResult(matchId), timespan);

                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.InnerException?.Message ?? ex.Message);
                    }
                }
            }
            

            return Ok("Job Added Succesfully");
        }

        [HttpPost]
        public async Task<IActionResult> StartWeeklyScrape()
        {
            var range = GetNextRoundDates();

            RecurringJob.AddOrUpdate("scrape-matches", () => _automate.ScrapeUpcomingMatches(range), Cron.Weekly(DayOfWeek.Thursday, 6));
            return Ok("Queued Weekly Scrape Job");
        }

        //[HttpGet("date")]
        //public async Task<IActionResult> GetNextDates()
        //{
        //    return Ok(JsonConvert.SerializeObject(GetNextRoundDates()));
        //}

        private static DateRange GetNextRoundDates()
        {
            var today = DateTime.Today;

            var range = new DateRange
            {
                Start = today.NextWeekdayDate(DayOfWeek.Friday).AddHours(12),
                End = today.NextWeekdayDate(DayOfWeek.Monday).AddHours(23).AddMinutes(59)
            };

            while (range.Start > range.End)
            {
                today = today.AddDays(1);
                range.End = today.NextWeekdayDate(DayOfWeek.Monday).AddHours(23).AddMinutes(59);
;           }


            return range;
        }
    }
}
