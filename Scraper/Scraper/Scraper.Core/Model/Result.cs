namespace Scraper.Core.Model
{
    public class Result
    {
        public int Id { get; set; }
        public string Score { get; set; }
        public string CorrectBet { get; set; }
        public Match Match { get; set; }
        public SubMatch SubMatch { get; set; }
        public int? MatchId { get; set; }
        public int? SubMatchId { get; set; }
    }
}