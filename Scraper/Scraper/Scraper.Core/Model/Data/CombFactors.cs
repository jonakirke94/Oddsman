using Newtonsoft.Json;

namespace Scraper.Core.Model.Data
{
    public class CombFactors
    {
        [JsonProperty("PRICE_CASHIN")]
        public double Odds { get; set; }
    }
}