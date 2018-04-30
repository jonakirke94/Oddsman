using Newtonsoft.Json;

namespace Scraper.Core.Scraper.DanskeSpil.Model
{
    public class Names
    {

        [JsonProperty("en")]
        public string En { get; set; }

        [JsonProperty("da")]
        public string Da { get; set; }
    }
}