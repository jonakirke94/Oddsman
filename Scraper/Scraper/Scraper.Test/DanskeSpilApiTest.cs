using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
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

        public DanskeSpilApiTest()
        {
            _server = new TestServer(new WebHostBuilder()
                .UseStartup<Startup>());
            _client = _server.CreateClient();
        }


        [Fact]
        public async void GetUpcomingMatch_Test()
        {
            var resp = await _client.GetAsync($"api/v1/Match/{UpcomingMatch.MatchId}");

            var match = JsonConvert.DeserializeObject<Match>(await resp.Content.ReadAsStringAsync());
            Assert.NotNull(match);
            Assert.True(match.ToString() == UpcomingMatch.ToString());
        }

        [Fact]
        public async void GetSubMatch_Test()
        {
            var resp = await _client.GetAsync($"api/v1/Match/{SubMatch.MatchId}/{UpcomingMatch.EventId}");

            var submatch = JsonConvert.DeserializeObject<Match>(await resp.Content.ReadAsStringAsync());
            Assert.NotNull(submatch);
            Assert.True(submatch.ToString() == SubMatch.ToString());
        }


        //[Fact]
        //public async void GetResult_Test()
        //{
        //    var resp = await _client.GetAsync($"api/v1/Match/Result/{_upcomingMatch.RoundId}/{_upcomingMatch.MatchId}");
        //}
    }
}