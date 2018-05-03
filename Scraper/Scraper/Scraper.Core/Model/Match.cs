using System;
using System.ComponentModel.DataAnnotations;

namespace Scraper.Core.Model
{
    public class Match
    {
        [Key]
        public int Id { get; set; }
        public int MatchId { get; set; }
        public int? ParentId { get; set; }
        public int? EventId { get; set; }
        public int RoundId { get; set; }
        public string MatchName { get; set; }
        public DateTime MatchDate { get; set; }
        public DateTime LastUpdated { get; set; }
        public string Option1 { get; set; }
        public string Option2 { get; set; }
        public string Option3 { get; set; }
        public double Option1Odds { get; set; }
        public double Option2Odds { get; set; }
        public double Option3Odds { get; set; }
        public Result Result { get; set; }


        public bool HasParent => ParentId != null && EventId != null;

        public override string ToString()
        {
            return $"MatchDate: {MatchDate} - MatchId: {MatchId} - Options: {Option1} {Option2} {Option3} - Odds: {Option1Odds} {Option2Odds} {Option3Odds}";
        }
    }
}