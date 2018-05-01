namespace Scraper.Core.Model
{
    public class SubMatch
    {
        public int Id { get; set; }
        public int MatchNo { get; set; }
        public int SubMatchNo { get; set; }
        public string MatchName { get; set; }
        public string MatchType { get; set; }
        public string Option1 { get; set; }
        public string Option2 { get; set; }
        public string Option3 { get; set; }
        public double Option1Odds { get; set; }
        public double Option2Odds { get; set; }
        public double Option3Odds { get; set; }
        public Result Result { get; set; }


        public override string ToString()
        {
            return $"MatchId: {MatchNo} - MatchName: {MatchName} - Options: {Option1} {Option2} {Option3} - Odds: {Option1Odds} {Option2Odds} {Option3Odds}";
        }
    }
}