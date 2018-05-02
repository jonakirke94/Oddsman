using System.Linq;
using Scraper.Core.Model;
using Scraper.Core.Scraper.DanskeSpil;
using Xunit;

namespace Scraper.Test
{
    public class DanskeSpilScraperTest : BaseTest
    {
        

        [Fact]
        public void GetMatches_Test()
        {
            var matches = Scraper.GetUpcomingMatches();
            Assert.NotEmpty(matches);
        }

        [Fact]
        public void GetSubMatches_Test()
        {
            Assert.NotNull(UpcomingMatch);
            var submatches = Scraper.GetSubMatches(UpcomingMatch.EventId);
            Assert.NotEmpty(submatches);
        }


        [Fact]
        public void GetMatchRounds_Test()
        {
            var rounds = Scraper.GetMatchRounds();
            Assert.NotEmpty(rounds);
        }

        [Fact]
        public void GetMatch_Test()
        {
            Assert.NotNull(UpcomingMatch);
            var match = Scraper.GetUpcomingMatch(UpcomingMatch.MatchId);
            Assert.NotNull(match);
            Assert.StrictEqual(UpcomingMatch.MatchId, match.MatchId);
        }


        [Fact]
        public void GetSubMatch_Test()
        {
            Assert.NotNull(UpcomingMatch);
            var subMatch = Scraper.GetSubMatch(UpcomingMatch.EventId, SubMatch.MatchId);
            Assert.NotNull(subMatch);
        }


        [Fact]
        public void GetResult_Test()
        {
            var result = Scraper.GetResult(452, 235);
            Assert.NotNull(result);
        }
        
    }
}
