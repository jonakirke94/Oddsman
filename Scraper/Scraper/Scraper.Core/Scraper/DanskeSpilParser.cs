using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using HtmlAgilityPack;
using Newtonsoft.Json;
using Scraper.Core.Extension;
using Scraper.Core.Model;
using Scraper.Core.Model.Data;
using Match = Scraper.Core.Model.Match;

namespace Scraper.Core.Scraper
{
    public static class DanskeSpilParser
    {
        public static IList<Match> ParseMatches(HtmlDocument doc)
        {
            var matches = new List<Match>();

            var list = doc.GetElementbyId("ob-retail-event-list");
            // Get the event container (containing date + the tables with all the matches)
            var containers = list.Descendants("div")
                .Select(x => x)
                .Where(y => y.Attributes["class"].Value == "retailEventContainer")
                .ToList();


            // Foreach event container
            foreach (var c in containers)
            {
                // Get the date
                var dateTxt = c.Descendants("p").First().HtmlDecodedValue().Replace(" ", "");
                // Parse the date
                var date = ParseDateTime(dateTxt);

                // Find the table body
                var eventBody = c.Descendants("tbody").First();
                // Find all the rows
                var events = eventBody
                    .Descendants("tr")
                    .Select(x => x)
                    .ToList();

                // Foreach row in the table body
                foreach (var e in events)
                {
                    var m = new Match
                    {
                        Scraped = DateTime.Now,
                        SubMatches = new List<SubMatch>()
                    };

                    // Find the specific match link for submatches
                    m.SubMatchLink = e.Attributes["onclick"].Value.HtmlDecodedValue().Split('\'', '\'')[1];

                    // Find all the columns
                    var col = e.Descendants("td").ToList();

                    // Find the time column
                    var time = col[0].HtmlDecodedValue();
                    // Parse the time column
                    var hhmm = time.Split(':'); // Format: 13:00
                    var dt = date.AddHours(int.Parse(hhmm[0])).AddMinutes(int.Parse(hhmm[1]));
                    m.MatchDate = dt;

                    // Find the match id/#
                    var num = col[1].HtmlDecodedValue();
                    int.TryParse(num, out var matchNum);
                    m.MatchNo = matchNum;

                    // Find the match name (team names)
                    var name = col[2].Descendants("span").First(span => span.Attributes["class"].Value == "eventName").HtmlDecodedValue();
                    var names = name.Split('-'); // Format: TeamName1 - TeamName2
                    m.MatchName = name;
                    m.HomeTeam = names[0];
                    m.AwayTeam = names[1];

                    // Find the league / country
                    var league = col[2].Descendants("span").First(span => span.Attributes["class"].Value == "typeclassName").HtmlDecodedValue();
                    var leagueCountry = league.Split('-'); // Format: League - Country
                    m.MatchType = league;

                    // Find odds
                    var odds = col[3].Descendants("div").Select(d => d).Where(d => d.Attributes["class"].Value.Contains("listPrice")).ToList();
                    m.HomeOdds = ParseCommaDouble(odds[0].Descendants("span").FirstOrDefault()?.InnerText);
                    m.DrawOdds = ParseCommaDouble(odds[1].Descendants("span").FirstOrDefault()?.InnerText);
                    m.AwayOdds = ParseCommaDouble(odds[2].Descendants("span").FirstOrDefault()?.InnerText);
                    
                    //add match to total list
                    matches.Add(m);
                }
            }

            return new List<Match>();
        }


        public static IList<SubMatch> ParseSubMatches(HtmlDocument doc, string matchName)
        {
            var subMatches = new List<SubMatch>();

            var sublist = doc.DocumentNode
                .Descendants("div")
                .Where(e => e.Attributes["class"].Value == "retailEventContainer")
                .ToList();

            sublist.RemoveAt(0); // Skip main match

            foreach (var submatch in sublist)
            {
                var head = submatch.Descendants("p").First(e => e.Attributes["class"].Value == "truncated");
                var t = head.InnerText.Split('-');  //Format : MatchNo - MatchType

                int.TryParse(t[0], out var no);

                var sm = new SubMatch
                {
                    MatchName = matchName,
                    MatchNo = no,
                    MatchType = t[1]
                };

                var odds = submatch
                    .Descendants("span")
                    .Where(e => e.Attributes["class"].Value == "odds-decimal")
                    .ToList();

                var options = submatch
                    .Descendants("div")
                    .Where(e => e.Attributes["class"].Value == "oneXTwoName")
                    .ToList();

                if (odds.Count == 3)
                {
                    sm.Option1Odds = ParseCommaDouble(odds[0]?.InnerText);
                    sm.Option2Odds = ParseCommaDouble(odds[1]?.InnerText);
                    sm.Option3Odds = ParseCommaDouble(odds[2]?.InnerText);
                }
                else
                {
                    sm.Option1Odds = ParseCommaDouble(odds[0]?.InnerText);
                    sm.Option3Odds = ParseCommaDouble(odds[1]?.InnerText);
                }

                sm.Option1 = options[0]?.InnerText;
                sm.Option2 = options[1]?.InnerText;
                sm.Option3 = options[2]?.InnerText;

                subMatches.Add(sm);
            }

            return subMatches;
        }


        public static IList<SubMatch> ParseSubmatchTest(HtmlDocument doc)
        {
            var subMatches = new List<SubMatch>();
            var regex = new Regex("(\\[{\"names\":.*\\}\\])");
            
            var matches = regex.Matches(doc.ParsedText);

            var names = JsonConvert.DeserializeObject<List<SubMatchHeaderData>>(matches[0].Value);
            var odds = JsonConvert.DeserializeObject<List<SubMatchOddsData>>(matches[1].Value);
            



            return subMatches;
        }


        private static double ParseCommaDouble(string str)
        {
            double.TryParse(str, NumberStyles.Any, CultureInfo.GetCultureInfo("da-DK"), out var res);
            return res;
        }

        private static DateTime ParseDateTime(string date)
        {
            return DateTime.ParseExact(date.Replace(" ", ""), "dddd,d.MMMMyyyy", CultureInfo.GetCultureInfo("da-DK"));
        }
    }
}