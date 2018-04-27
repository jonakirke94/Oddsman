using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using HtmlAgilityPack;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using Scraper.Core.Model;

namespace Scraper.Core.Scraper
{
    public class DanskeSpil : IScraper
    {

        private const string DenLange = "https://oddset.danskespil.dk/allekampe/den-lange";
        private const string Results = "https://oddset.danskespil.dk/allekampe/resultater";
        private const string ResultSearch = "https://oddset.danskespil.dk//results/list_retail/1/{0}/FOOTBALL/{1}"; // 0 = daterange | 1 = kampnummer


        public HtmlDocument LoadHtmlPage(string url, bool requireBrowser = false)
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


        public IList<Match> GetMatches()
        {
            var doc = LoadHtmlPage(DenLange);

            return DanskeSpilParser.ParseMatches(doc);
        }

        public IList<SubMatch> GetSubMatches(string eventUrl)
        {
            var doc = LoadHtmlPage(eventUrl);

            return DanskeSpilParser.ParseSubMatches(doc);
        }

        public IList<MatchRound> GetMatchRounds()
        {
            var doc = LoadHtmlPage(Results);
            
            return DanskeSpilParser.ParseMatchRounds(doc);
        }

    }
}