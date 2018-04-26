using Newtonsoft.Json;

namespace Scraper.Core.Model.Data
{
    public class HcapValues
    {

        [JsonProperty("H")]
        public string H { get; set; }

        [JsonProperty("A")]
        public string A { get; set; }

        [JsonProperty("L")]
        public string L { get; set; }

        [JsonProperty("B")]
        public string B { get; set; }

        [JsonProperty("E")]
        public string E { get; set; }
    }
}