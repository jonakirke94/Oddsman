using System;

namespace Scraper.Core.Scraper.DanskeSpil.Model
{
    public class MatchRound
    {
        public int Id { get; set; }
        public int Number { get; set; }
        public int MatchRoundId { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
    }
}