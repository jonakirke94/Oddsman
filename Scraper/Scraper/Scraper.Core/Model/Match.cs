using System;
using System.Collections.Generic;

namespace Scraper.Core.Model
{
    public class Match
    {
        public int Id { get; set; }
        public int MatchNo { get; set; }
        public DateTime MatchDate { get; set; }
        public DateTime Scraped { get; set; }
        public string MatchName { get; set; }
        public string HomeTeam { get; set; }
        public string AwayTeam { get; set; }
        public string MatchType { get; set; }
        public double HomeOdds { get; set; }
        public double AwayOdds { get; set; }
        public double DrawOdds { get; set; }
        public int RoundId { get; set; }
        public Result Result { get; set; }
        public string SubMatchLink { get; set; }
        public List<SubMatch> SubMatches { get; set; }



        public override string ToString()
        {
            return $"MatchDate: {MatchDate} MatchNo: {MatchNo} HomeOdds: {HomeOdds} DrawOdds: {DrawOdds} AwayOdds {AwayOdds}";
        }
        
    }
}