using System;
using System.Collections.Generic;
using System.Linq;
using Scraper.Core.Model;
using Scraper.Core.Scraper;
using Xunit;

namespace Scraper.Test
{
    public class DanskeSpilScraperTest : BaseTest
    {
        private readonly DanskeSpilScraper _scraper;
        private readonly Match _upcomingMatch;

        public DanskeSpilScraperTest()
        {
            _scraper = new DanskeSpilScraper();
            _upcomingMatch = _scraper.GetUpcomingMatches().Last();
            _upcomingMatch.SubMatches.AddRange(_scraper.GetSubMatches(_upcomingMatch.SubMatchLink));
        }

        [Fact]
        public void GetMatches_Test()
        {
            var matches = _scraper.GetUpcomingMatches();
            Assert.NotEmpty(matches);
        }

        [Fact]
        public void GetSubMatches_Test()
        {
            Assert.NotNull(_upcomingMatch);
            var submatches = _scraper.GetSubMatches(_upcomingMatch.SubMatchLink);
            Assert.NotEmpty(submatches);
        }


        [Fact]
        public void GetMatchRounds_Test()
        {
            var rounds = _scraper.GetMatchRounds();
            Assert.NotEmpty(rounds);
        }

        [Fact]
        public void GetMatch_Test()
        {
            Assert.NotNull(_upcomingMatch);
            var match = _scraper.GetUpcomingMatch(_upcomingMatch.MatchNo);
            Assert.NotNull(match);
            Assert.StrictEqual(_upcomingMatch.MatchNo, match.MatchNo);
        }


        [Fact]
        public void GetSubMatch_Test()
        {
            Assert.NotNull(_upcomingMatch);
            Assert.NotEmpty(_upcomingMatch.SubMatches);
            var subMatch = _scraper.GetSubMatch(_upcomingMatch.SubMatchLink, _upcomingMatch.SubMatches.First().SubMatchNo);
            Assert.NotNull(subMatch);
        }
    }
}
