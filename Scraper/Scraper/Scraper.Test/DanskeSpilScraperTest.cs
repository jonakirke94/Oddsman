using System;
using Scraper.Core.Scraper;
using Xunit;

namespace Scraper.Test
{
    public class DanskeSpilScraperTest : BaseTest
    {
        [Fact]
        public void ParseMatches_Test()
        {
            var x = new DanskeSpil();

            var q = x.GetSubMatches("https://oddset.danskespil.dk/allekampe/den-lange/event-815386.html");
            Assert.NotEmpty(q);
        }
    }
}
