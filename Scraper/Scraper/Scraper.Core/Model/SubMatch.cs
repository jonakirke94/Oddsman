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
    }
}