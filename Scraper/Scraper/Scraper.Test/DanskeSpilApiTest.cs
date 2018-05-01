using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Newtonsoft.Json;
using Scraper.API;
using Scraper.Core.Model;
using Scraper.Core.Scraper.DanskeSpil;
using Xunit;

namespace Scraper.Test
{
    [Collection("Sequential")]
    public class DanskeSpilApiTest : BaseTest
    {
        private readonly TestServer _server;
        private readonly HttpClient _client;
        private readonly IList<Match> _upcomingMatches;
        private readonly Match _upcomingMatch;
        private readonly SubMatch _subMatch;

        public DanskeSpilApiTest()
        {
            _server = new TestServer(new WebHostBuilder()
                .UseStartup<Startup>());
            _client = _server.CreateClient();

            var scraper = new DanskeSpilScraper();

            _upcomingMatches = scraper.GetUpcomingMatches();
            _upcomingMatch = _upcomingMatches.Last();
            _upcomingMatch.SubMatches = new List<SubMatch>(scraper.GetSubMatches(_upcomingMatch.SubMatchLink));
            _subMatch = _upcomingMatch.SubMatches.Last();
        }


        [Fact]
        public async void GetUpcomingMatch_Test()
        {
            var resp = await _client.GetAsync($"api/v1/Match/GetUpcomingMatch/{_upcomingMatch.MatchNo}");

            var match = JsonConvert.DeserializeObject<Match>(await resp.Content.ReadAsStringAsync());
            Assert.NotNull(match);
            Assert.True(match.ToString() == _upcomingMatch.ToString());
        }

        [Fact]
        public async void GetSubMatch_Test()
        {
            var resp = await _client.GetAsync($"api/v1/Match/GetSubMatch/{_subMatch.MatchNo}/{_subMatch.SubMatchNo}");

            var submatch = JsonConvert.DeserializeObject<SubMatch>(await resp.Content.ReadAsStringAsync());
            Assert.NotNull(submatch);
            Assert.True(submatch.ToString() == _subMatch.ToString());
        }


        //[Fact]
        //public async void GetResult_Test()
        //{
        //    var resp = await _client.GetAsync($"api/v1/Match/GetResult/{_upcomingMatch.RoundId}/{_upcomingMatch.MatchNo}");
        //}
    }
}