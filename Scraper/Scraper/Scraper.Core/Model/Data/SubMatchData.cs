using System.Collections.Generic;

namespace Scraper.Core.Model.Data
{
    public class SubMatchData
    {
        public IList<SubMatchHeaderData> Headers { get; set; }
        public IList<SubMatchOddsData> Odds { get; set; }
    }
}