using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hangfire;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Scraper.API.Services;
using Scraper.Core.Data;
using Scraper.Core.Model;
using Scraper.Core.Scraper.DanskeSpil;

namespace Scraper.API.Controllers
{
    [Route("api/v1/[controller]")]
    public class MatchController : Controller
    {
        private static readonly DanskeSpilScraper Scraper = new DanskeSpilScraper();
        private readonly DanskeSpilContext _db;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly AutomationService _automate;

        public MatchController(DanskeSpilContext db, IServiceScopeFactory scopeFactory)
        {
            _db = db;
            _scopeFactory = scopeFactory;
            _automate = new AutomationService(_scopeFactory);
        }


        [HttpGet("{matchId}/{eventId?}")]
        [ProducesResponseType(200, Type = typeof(Match))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetMatch(int matchId, int? eventId = null)
        {
            Match match = null;
            try
            {
                match = _db.Matches.FirstOrDefault(m => m.MatchId == matchId);
                if (match == null)
                {
                    match = Scraper.GetUpcomingMatch(matchId, eventId);
                    if (match != null)
                    {
                        _db.Matches.Add(match);
                        await _db.SaveChangesAsync();
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }

            if (match == null) return NotFound();

            return Ok(match);
        }


        [HttpGet("Result/{matchRoundId}/{matchId}/{parentMatchId?}")]
        [ProducesResponseType(200, Type = typeof(Result))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetResult(int matchRoundId, int matchId, int? parentMatchId = null)
        {
            Result res = null;
            try
            {
                var match = _db.Matches.Include(m => m.Result).FirstOrDefault(m => m.MatchId == matchId && m.RoundId == matchRoundId);

                if (match != null)
                {
                    if (match.Result == null)
                    {
                        res = Scraper.GetMatchResult(match.RoundId, matchId, parentMatchId);
                        _db.Results.Add(res);
                        await _db.SaveChangesAsync();
                    }
                    else
                    {
                        res = match.Result;
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }

            if (res == null) return NotFound();

            return Ok(res);
        }


        [HttpGet("Results")]
        [ProducesResponseType(200, Type = typeof(Result))]
        public async Task<IActionResult> GetResults([FromBody] IEnumerable<int> ids)
        {
            var results = new List<Result>();
            try
            {
                using (var scope = _scopeFactory.CreateScope())
                {
                    using (var db = scope.ServiceProvider.GetRequiredService<DanskeSpilContext>())
                    {
                        foreach (var id in ids)
                        {
                            try
                            {
                                var res = db.Results.FirstOrDefault(r => r.MatchId == id);
                                if (res != null)
                                {
                                    // Add the result if it's in the database
                                    results.Add(res);
                                }
                                else
                                {
                                    // Find the corresponding match
                                    var match = db.Matches.FirstOrDefault(m => m.MatchId == id);
                                    if (match == null)
                                    {
                                        Console.WriteLine($"missing match: {id}");
                                        continue;
                                    }
                                    // If the match haven't been played yet continue
                                    if (match.MatchDate > DateTime.Now.AddHours(2)) continue;

                                    // Try scraping the match and add it.
                                    var sRes = Scraper.GetMatchResult(match.RoundId, id, match.ParentId);
                                    if (sRes != null)
                                    {
                                        results.Add(sRes);
                                    }
                                    else
                                    {
                                        // Schedule a later scrape since we can't find it.
                                        BackgroundJob.Schedule(() => _automate.ScrapeMatchResult(id), TimeSpan.FromHours(1));
                                    }
                                }

                            }
                            catch (Exception e)
                            {
                                Console.WriteLine(e.InnerException?.Message ?? e.Message);
                            }
                        }
                    }
                }

            }
            catch (Exception e)
            {
                Console.WriteLine(e.InnerException?.Message ?? e.Message);
            }
            

            return Ok(results);
        }


    }
}