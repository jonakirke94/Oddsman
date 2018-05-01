using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Scraper.Core.Model;
using Scraper.Core.Scraper;
using Scraper.Core.Scraper.DanskeSpil;

namespace Scraper.API.Controllers
{
    [Route("api/v1/[controller]")]
    public class MatchController : Controller
    {

        private static readonly DanskeSpilScraper Scraper = new DanskeSpilScraper();

        

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(List<Match>))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetUpcomingMatches()
        {
            var matches = new List<Match>(Scraper.GetUpcomingMatches());

            if (matches.Count == 0) return NotFound();

            return Ok(matches);
        }


        [HttpGet("GetUpcomingMatch/{matchId}")]
        [ProducesResponseType(200, Type = typeof(Match))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetUpcomingMatch(int matchId)
        {
            if (matchId <= 0) return BadRequest();

            var match = Scraper.GetUpcomingMatch(matchId);

            if (match == null) return NotFound();

            return Ok(match);
        }
        
        [HttpGet("GetResult/{matchRound}/{matchId}")]
        [ProducesResponseType(200, Type = typeof(Result))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetResult(int matchRound, int matchId)
        {
            if (matchId < 0) return BadRequest();

            var result = Scraper.GetResult(matchRound, matchId);

            if (result == null) return NotFound();

            return Ok(result);
        }
        
        [HttpGet("GetSubMatch/{matchId}/{subMatchId}")]
        [ProducesResponseType(200, Type = typeof(SubMatch))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetSubMatch(int matchId, int subMatchId)
        {
            if (matchId <= 0 || subMatchId <= 0) return BadRequest();

            var submatch = Scraper.GetSubMatch(matchId, subMatchId);

            if (submatch == null) return NotFound();

            return Ok(submatch);
        }
    }
}