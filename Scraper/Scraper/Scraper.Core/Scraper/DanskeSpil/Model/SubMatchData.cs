using System.Collections.Generic;

namespace Scraper.Core.Scraper.DanskeSpil.Model
{
    public class SubMatchData
    {
        public IList<SubMatchHeaderData> Headers { get; set; }
        public IList<SubMatchOddsData> Odds { get; set; }
    }
}