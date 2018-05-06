using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        public MatchController(DanskeSpilContext db)
        {
            _db = db;
        }


        [HttpGet("{matchId}/{eventId?}")]
        [ProducesResponseType(200, Type = typeof(Match))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetMatch(int matchId, int? eventId = null)
        {
            Match match;
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
                throw;
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
            Result res;
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
                else
                {
                    res = null;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

            if (res == null) return NotFound();

            return Ok(res);
        }

        
    }
}