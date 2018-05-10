using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hangfire;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Scraper.API.Services;
using Scraper.Core.Data;
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
        [ProducesResponseType(200, Type = typeof(Match))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> ScheduleMatchResultScrape(int matchId)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                using (var db = scope.ServiceProvider.GetRequiredService<DanskeSpilContext>())
                {
                    var match = db.Matches.FirstOrDefault(m => m.MatchId == matchId);
                    if(match == null) return NotFound();

                    try
                    {
                        var offset = new DateTimeOffset(match.MatchDate.AddHours(3));
                        BackgroundJob.Schedule(() => _automate.ScrapeMatchResult(matchId), offset);
                    }
                    catch (Exception)
                    {
                        return StatusCode(500);
                    }
                }
            }

            return Ok("Job Added Succesfully");
        }



    }
}
