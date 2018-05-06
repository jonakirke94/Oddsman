using Xunit;

namespace Scraper.Test
{
    public class MatchControllerTest : BaseTest
    {
        [Fact]
        public void GetMatch_Test()
        {
            Assert.NotNull(UpcomingMatch);
            var match = Mctr.GetMatch(UpcomingMatch.MatchId);
            Assert.NotNull(match);
            Assert.StrictEqual(UpcomingMatch.MatchId, match.MatchId);
        }


        [Fact]
        public void GetSubMatch_Test()
        {
            Assert.NotNull(UpcomingMatch);
            var subMatch = Mctr.GetMatch(SubMatch.MatchId, UpcomingMatch.EventId);
            Assert.NotNull(subMatch);
        }


        [Fact]
        public void GetResult_Test()
        {
            var result = Mctr.GetResult(453, 235);
            Assert.NotNull(result);
        }
    }
}