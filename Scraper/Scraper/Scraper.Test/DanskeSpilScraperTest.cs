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

        //[Fact]
        //public void Get()
        //{
        //    Assert.True(true);
        //}
    }
}
