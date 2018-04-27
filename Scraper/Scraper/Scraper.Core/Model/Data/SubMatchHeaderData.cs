using Newtonsoft.Json;

namespace Scraper.Core.Model.Data
{
    public class SubMatchHeaderData
    {
        /// <summary>
        /// Danish & English representation of the Header
        /// </summary>
        [JsonProperty("names")]
        public Names Names { get; set; }

        /// <summary>
        /// The Id of the Match that this SubMatch belongs to.
        /// </summary>
        [JsonProperty("ev_id")]
        public int MatchNumber { get; set; }

        /// <summary>
        /// Used to identify which SubMatchOddsData betting options that belongs to this Header.
        /// </summary>
        [JsonProperty("ev_mkt_id")]
        public int HeaderId { get; set; }


        //[JsonProperty("mkt_type")]
        //public string MktType { get; set; }

        //[JsonProperty("mkt_sort")]
        //public string MktSort { get; set; }

        //[JsonProperty("status")]
        //public string Status { get; set; }

        //[JsonProperty("displayed")]
        //public string Displayed { get; set; }

        //[JsonProperty("disporder")]
        //public int Disporder { get; set; }

        //[JsonProperty("bir_index")]
        //public string BirIndex { get; set; }

        //[JsonProperty("raw_hcap")]
        //public string RawHcap { get; set; }

        //[JsonProperty("hcap_values")]
        //public HcapValues HcapValues { get; set; }

        //[JsonProperty("ew_places")]
        //public string EwPlaces { get; set; }

        //[JsonProperty("ew_fac_num")]
        //public string EwFacNum { get; set; }

        //[JsonProperty("ew_fac_den")]
        //public string EwFacDen { get; set; }

        //[JsonProperty("bet_in_run")]
        //public string BetInRun { get; set; }

        //[JsonProperty("collection_id")]
        //public string CollectionId { get; set; }

        //[JsonProperty("lp_avail")]
        //public string LpAvail { get; set; }

        //[JsonProperty("sp_avail")]
        //public string SpAvail { get; set; }

        //[JsonProperty("hcap_goal")]
        //public string HcapGoal { get; set; }

        //[JsonProperty("result_conf")]
        //public string ResultConf { get; set; }

        //[JsonProperty("cashout_avail")]
        //public string CashoutAvail { get; set; }

        //[JsonProperty("hcap_makeup")]
        //public string HcapMakeup { get; set; }

        //[JsonProperty("hier_cashout_avail")]
        //public string HierCashoutAvail { get; set; }

        //[JsonProperty("number")]
        //public string Number { get; set; }

        //[JsonProperty("num_mkt_selns")]
        //public string NumMktSelns { get; set; }

        //[JsonProperty("blurb")]
        //public string Blurb { get; set; }
    }
}