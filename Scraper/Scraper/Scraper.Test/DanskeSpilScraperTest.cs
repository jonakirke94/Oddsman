using System;
using System.Linq;
using Scraper.Core.Scraper;
using Xunit;

namespace Scraper.Test
{
    public class DanskeSpilScraperTest : BaseTest
    {
        [Fact]
        public void GetMatches_Test()
        {
            var scraper = new DanskeSpil();

            var matches = scraper.GetMatches();
            Assert.NotEmpty(matches);
        }

        [Fact]
        public void GetSubMatches_Test()
        {
            var scraper = new DanskeSpil();

            var match = scraper.GetMatches().First();
            var submatches = scraper.GetSubMatches(match.SubMatchLink);

            Assert.NotEmpty(submatches);
        }


        [Fact]
        public void GetMatchRounds_Test()
        {
            var scraper = new DanskeSpil();

            var rounds = scraper.GetMatchRounds();
            Assert.NotEmpty(rounds);
        }

        [Fact]
        public void GetMatch_Test()
        {
            var scraper = new DanskeSpil();
            var matches = scraper.GetMatches();
            // Gets all matches from "Den Lange" picks the last match's number
            // The GetMatch method only searches Live Matches (which means finished/ongoing matches are not searchable)
            var matchNo = matches.Last().MatchNo; 

            var match = scraper.GetMatch(matchNo);

            Assert.NotNull(match);
            Assert.StrictEqual(matchNo, match.MatchNo);
        }
    }
}
