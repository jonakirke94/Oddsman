namespace Scraper.Core.Model
{
    public class Result
    {
        public int Id { get; set; }
        public string EndResult { get; set; }
        public string CorrectBet { get; set; }
        public Match Match { get; set; }
        public int? MatchId { get; set; }
    }
}