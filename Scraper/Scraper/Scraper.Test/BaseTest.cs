using System;
using System.Collections.Generic;
using System.Linq;
using Scraper.Core.Controller;
using Scraper.Core.Model;
using Scraper.Core.Scraper.DanskeSpil;
using Scraper.Core.Scraper.DanskeSpil.Model;
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
        protected readonly MatchController Mctr;

        public BaseTest()
        {
            Scraper = new DanskeSpilScraper();
            Mctr = new MatchController();

            UpcomingMatches = Scraper.GetUpcomingMatches(new DateRange{Start = DateTime.Now, End = DateTime.Now.AddDays(1)});
            UpcomingMatch = UpcomingMatches[UpcomingMatches.Count / 2];
            SubMatch = Scraper.GetSubMatches(UpcomingMatch.EventId).First();
        }
    }
}