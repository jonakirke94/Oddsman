using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Scraper.Core.Model;

namespace Scraper.API.Controllers
{
    [Route("api/v1/[controller]")]
    public class MatchController : Controller
    {
        private static readonly Core.Controller.MatchController Mctr = new Core.Controller.MatchController();
        
        //[HttpGet("{matchId}")]
        //[ProducesResponseType(200, Type = typeof(Match))]
        //[ProducesResponseType(400)]
        //[ProducesResponseType(404)]
        //public async Task<IActionResult> GetMatch(int matchId)
        //{
        //    if (matchId <= 0) return BadRequest();

        //    var match = Mctr.GetMatch(matchId);

        //    if (match == null) return NotFound();

        //    return Ok(match);
        //}

        [HttpGet("{matchId}/{eventId?}")]
        [ProducesResponseType(200, Type = typeof(Match))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetMatch(int matchId, int? eventId = null)
        {
            if (eventId <= 0 || matchId <= 0) return BadRequest();

            var match = Mctr.GetMatch(matchId, eventId);

            if (match == null) return NotFound();

            return Ok(match);
        }

        //[HttpGet("Result/{matchRound}/{matchId}")]
        //[ProducesResponseType(200, Type = typeof(Result))]
        //[ProducesResponseType(400)]
        //[ProducesResponseType(404)]
        //public async Task<IActionResult> GetResult(int matchRound, int matchId)
        //{
        //    if (matchId < 0) return BadRequest();

        //    var result = Mctr.GetResult(matchRound, null, matchId);

        //    if (result == null) return NotFound();

        //    return Ok(result);
        //}

        [HttpGet("Result/{matchRound}/{matchId}/{parentMatchId?}")]
        [ProducesResponseType(200, Type = typeof(Result))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetResult(int matchRound, int matchId, int? parentMatchId = null)
        {
            if (matchId < 0) return BadRequest();

            var result = Mctr.GetResult(matchRound, matchId, parentMatchId);

            if (result == null) return NotFound();

            return Ok(result);
        }

        
    }
}