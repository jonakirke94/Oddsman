using System;
using System.Collections.Generic;
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

        [HttpGet("GetSubMatch/{eventUrl}/{matchId}")]
        [ProducesResponseType(200, Type = typeof(SubMatch))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetSubMatch(string eventUrl, int matchId)
        {
            Uri uri;
            try
            {
                uri = new Uri(eventUrl);
            }
            catch (ArgumentNullException e)
            {
                Console.WriteLine(e);
                return BadRequest();
            }
            catch (UriFormatException e)
            {
                Console.WriteLine(e);
                return BadRequest();
            }

            var submatch = Scraper.GetSubMatch(uri.ToString(), matchId);

            if (submatch == null) return NotFound();

            return Ok(submatch);
        }
    }
}