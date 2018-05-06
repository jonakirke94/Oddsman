using Newtonsoft.Json;

namespace Scraper.Core.Scraper.DanskeSpil.Model
{
    public class SubMatchDataInfo
    {
        [JsonProperty("start_time")]
        public string MatchDate { get; set; }

        public int? ParentId { get; set; }
    }
}