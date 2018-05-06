using System.Linq;
using Scraper.Core.Model;
using Scraper.Core.Scraper.DanskeSpil;
using Xunit;

namespace Scraper.Test
{
    public class UnitTests : BaseTest
    {
        

        [Fact]
        public void GetMatches()
        {
            var matches = Scraper.GetUpcomingMatches();
            Assert.NotEmpty(matches);
        }

        [Fact]
        public void GetSubMatches()
        {
            Assert.NotNull(UpcomingMatch);
            var submatches = Scraper.GetSubMatches(UpcomingMatch.EventId);
            Assert.NotEmpty(submatches);
        }


        [Fact]
        public void GetMatchRounds()
        {
            var rounds = Scraper.GetMatchRounds();
            Assert.NotEmpty(rounds);
        }

        [Fact]
        public void GetMatch()
        {
            Assert.NotNull(UpcomingMatch);
            var match = Scraper.GetUpcomingMatch(UpcomingMatch.MatchId);
            Assert.NotNull(match);
            Assert.StrictEqual(UpcomingMatch.MatchId, match.MatchId);
        }


        [Fact]
        public void GetSubMatch()
        {
            Assert.NotNull(UpcomingMatch);
            var subMatch = Scraper.GetUpcomingMatch(SubMatch.MatchId, UpcomingMatch.EventId);
            Assert.NotNull(subMatch);
        }


        [Fact]
        public void GetResult()
        {
            var result = Scraper.GetMatchResult(453, 235);
            Assert.NotNull(result);
        }
        
    }
}
