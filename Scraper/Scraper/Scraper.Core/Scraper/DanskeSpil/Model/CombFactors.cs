using Newtonsoft.Json;

namespace Scraper.Core.Scraper.DanskeSpil.Model
{
    public class CombFactors
    {
        [JsonProperty("PRICE_CASHIN")]
        public double Odds { get; set; }
    }
}