using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Scraper.Core.Model;
using Scraper.Core.Scraper.DanskeSpil;

namespace Scraper.API.Controllers
{
    [Route("api/v1/[controller]")]
    public class MatchController : Controller
    {

        private static readonly DanskeSpilScraper Scraper = new DanskeSpilScraper();
        
        [HttpGet("{matchId}")]
        [ProducesResponseType(200, Type = typeof(Match))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetMatch(int matchId)
        {
            if (matchId <= 0) return BadRequest();

            var match = Scraper.GetUpcomingMatch(matchId);

            if (match == null) return NotFound();

            return Ok(match);
        }
        
        [HttpGet("Result/{matchRound}/{matchId}")]
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
        
        [HttpGet("{eventId}/{matchId}")]
        [ProducesResponseType(200, Type = typeof(Match))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetSubMatch(int eventId, int matchId)
        {
            if (eventId <= 0 || matchId <= 0) return BadRequest();

            var submatch = Scraper.GetSubMatch(eventId, matchId);

            if (submatch == null) return NotFound();

            return Ok(submatch);
        }
    }
}