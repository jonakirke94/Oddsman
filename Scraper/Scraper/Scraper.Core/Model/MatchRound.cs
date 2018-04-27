using System;

namespace Scraper.Core.Model
{
    public class MatchRound
    {
        public int Id { get; set; }
        public int Number { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
    }
}