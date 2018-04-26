using System;
using Newtonsoft.Json;

namespace Scraper.Core.Model.Data
{
    public class SubMatchOddsData
    {
        //[JsonProperty("comb_factors/PRICE_CASHIN")]
        [JsonProperty("odds")]
        public double Odds {
            get => CombFactors.Odds;
            set => CombFactors.Odds = value;
        }

        public double GetCalculatedOdds => Math.Round(Odds / 100 * 92, 2);

        [JsonProperty("names")]
        public Names Names { get; set; }

        [JsonProperty("ev_mkt_id")]
        public int EvMktId { get; set; }

        [JsonProperty("ev_oc_id")]
        public int EvOcId { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("displayed")]
        public string Displayed { get; set; }

        [JsonProperty("disporder")]
        public int Disporder { get; set; }

        [JsonProperty("runner_num")]
        public string RunnerNum { get; set; }

        [JsonProperty("fb_result")]
        public string FbResult { get; set; }

        [JsonProperty("lp_num")]
        public string LpNum { get; set; }

        [JsonProperty("lp_den")]
        public string LpDen { get; set; }

        [JsonProperty("cs_home")]
        public string CsHome { get; set; }

        [JsonProperty("cs_away")]
        public string CsAway { get; set; }

        [JsonProperty("result")]
        public string Result { get; set; }

        [JsonProperty("result_conf")]
        public string ResultConf { get; set; }

        [JsonProperty("push_msg")]
        public string PushMsg { get; set; }

        [JsonProperty("comb_factors")]
        public CombFactors CombFactors { get; set; }

        [JsonProperty("cp_num")]
        public int CpNum { get; set; }

        [JsonProperty("cp_den")]
        public int CpDen { get; set; }

        [JsonProperty("place")]
        public int Place { get; set; }

        [JsonProperty("unique_id")]
        public string UniqueId { get; set; }

        [JsonProperty("oc_number")]
        public string BetOption { get; set; }

    }
}