using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using HtmlAgilityPack;
using OpenQA.Selenium.Chrome;
using Scraper.Core.Model;
using Scraper.Core.Scraper.DanskeSpil.Model;

namespace Scraper.Core.Scraper.DanskeSpil
{
    public class DanskeSpilScraper
    {

        private const string DenLange = "https://oddset.danskespil.dk/allekampe/den-lange";
        private const string Results = "https://oddset.danskespil.dk/allekampe/resultater";
        private const string ResultSearch = "https://oddset.danskespil.dk//results/list_retail/1/{0}/FOOTBALL/{1}"; // 0 = MatchRoundId | 1 = ParentId
        private const string MatchSearch = "https://oddset.danskespil.dk/allekampe/den-lange?search=1&criteria={0}"; // Can only be found if it exists on Den Lange
        private const string SubMatchUrl = "https://oddset.danskespil.dk/allekampe/den-lange/event-{0}.html";

        public DanskeSpilScraper()
        {
            if (MatchRoundIds.IsEmptyOrOutdated)
            {
                MatchRoundIds.SetValues(GetMatchRounds());
            }
        }

        private static HtmlDocument LoadHtmlPage(string url, bool requireBrowser = false)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12; // For https calls
            ServicePointManager.ServerCertificateValidationCallback = delegate { return true; }; // Blindly accept certificates (DANGER AHEAD)

            HtmlDocument result;

            if (!requireBrowser)
            {
                var web = new HtmlWeb();
                
                result = web.Load(url);
            }
            else
            {
                var options = new ChromeOptions();
                options.AddArgument("--headless");
                var driver = new ChromeDriver(
                    Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Driver", "V2.33", "chromedriver_win32.exe"),
                    options)
                {
                    Url = url
                };

                driver.Manage().Timeouts().PageLoad = TimeSpan.FromSeconds(2);

                //driver.Navigate().GoToUrl(url);
                var container = driver.FindElementById("bip-ev-primary-market");
                var html = container.GetAttribute("innerHTML");
                var doc = new HtmlDocument();
                doc.LoadHtml(html);

                result = doc;
            }

            return result;
        }

        public IList<Match> GetUpcomingMatches(DateRange dateRange = null)
        {
            var matches = new List<Match>();
            var doc = LoadHtmlPage(DenLange);

            try
            {
                matches = new List<Match>(DanskeSpilParser.ParseMatches(doc, dateRange));
                Parallel.ForEach(matches, m => m.RoundId = MatchRoundIds.GetMatchRoundId(m.MatchDate));
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }

            return matches;
        }

        public IList<Match> GetSubMatches(int? eventId)
        {
            if (eventId == null) return null;
            var subMatches = new List<Match>(); 
            var doc = LoadHtmlPage(string.Format(SubMatchUrl, eventId));
            var data = DanskeSpilParser.ParseSubMatchData(doc);

            try
            {
                subMatches = new List<Match>(DanskeSpilParser.ParseSubMatches(data));
                Parallel.ForEach(subMatches, m => m.RoundId = MatchRoundIds.GetMatchRoundId(m.MatchDate));
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }

            return subMatches;
        }

        public IList<MatchRound> GetMatchRounds()
        {
            var rounds = new List<MatchRound>();
            var doc = LoadHtmlPage(Results);

            try
            {
                rounds = new List<MatchRound>(DanskeSpilParser.ParseMatchRounds(doc));
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }

            return rounds;
        }



        public Match GetUpcomingMatch(int matchId, int? eventId = null)
        {
            Match m = null;
            var doc = LoadHtmlPage(eventId == null 
                ? string.Format(MatchSearch, matchId) 
                : string.Format(SubMatchUrl, eventId));

            try
            {
                if (eventId == null)
                {
                    m = DanskeSpilParser.ParseMatchSearch(doc);
                    m.RoundId = MatchRoundIds.GetMatchRoundId(m.MatchDate);
                }
                else
                {
                    var data = DanskeSpilParser.ParseSubMatchData(doc);
                    var header = data.Headers.First(h => int.Parse(h.MatchId) == matchId);
                    var odds = data.Odds.Select(o => o).Where(o => o.HeaderId == header.HeaderId).ToList();
                    m = DanskeSpilParser.ParseSubMatch(header, odds, data.Info);
                    m.RoundId = MatchRoundIds.GetMatchRoundId(m.MatchDate);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }

            return m;
        }



        public Result GetMatchResult(int matchRound, int matchId, int? parentMatchId = null)
        {
            Result res = null;
            var doc = LoadHtmlPage(parentMatchId == null 
                ? string.Format(ResultSearch, matchRound, matchId) 
                : string.Format(ResultSearch, matchRound, parentMatchId));

            try
            {
                res = DanskeSpilParser.ParseResult(doc, matchId);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }

            return res;
        }

    }
}