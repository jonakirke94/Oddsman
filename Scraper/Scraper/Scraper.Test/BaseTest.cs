using System.Collections.Generic;
using System.Linq;
using Scraper.Core.Model;
using Scraper.Core.Scraper.DanskeSpil;
using Xunit;

namespace Scraper.Test
{
    [Collection("Sequential")]
    public class BaseTest
    {

        protected readonly IList<Match> UpcomingMatches;
        protected readonly Match UpcomingMatch;
        protected readonly Match SubMatch;
        protected readonly DanskeSpilScraper Scraper;

        public BaseTest()
        {
            Scraper = new DanskeSpilScraper();

            UpcomingMatches = Scraper.GetUpcomingMatches();
            UpcomingMatch = UpcomingMatches.Last();
            SubMatch = Scraper.GetSubMatches(UpcomingMatch.EventId).Last();
        }
    }
}