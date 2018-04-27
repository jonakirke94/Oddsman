using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
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
                var date = ParseMatchDate(dateTxt);

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
                    //add match to total list
                    var m = ParseMatch(e, date);
                    if (m != null) matches.Add(m);
                }
            }

            return matches;
        }


        public static IList<SubMatch> ParseSubMatches(HtmlDocument doc)
        {
            #region Old Html Parse

            //var subMatches = new List<SubMatch>();

            //var sublist = doc.DocumentNode
            //    .Descendants("div")
            //    .Where(e => e.Attributes["class"].Value == "retailEventContainer")
            //    .ToList();

            //sublist.RemoveAt(0); // Skip main match

            //foreach (var submatch in sublist)
            //{
            //    var head = submatch.Descendants("p").First(e => e.Attributes["class"].Value == "truncated");
            //    var t = head.InnerText.Split('-');  //Format : MatchNo - MatchType

            //    int.TryParse(t[0], out var no);

            //    var sm = new SubMatch
            //    {
            //        MatchName = matchName,
            //        MatchNo = no,
            //        MatchType = t[1]
            //    };

            //    var odds = submatch
            //        .Descendants("span")
            //        .Where(e => e.Attributes["class"].Value == "odds-decimal")
            //        .ToList();

            //    var options = submatch
            //        .Descendants("div")
            //        .Where(e => e.Attributes["class"].Value == "oneXTwoName")
            //        .ToList();

            //    if (odds.Count == 3)
            //    {
            //        sm.Option1Odds = ParseCommaDouble(odds[0]?.InnerText);
            //        sm.Option2Odds = ParseCommaDouble(odds[1]?.InnerText);
            //        sm.Option3Odds = ParseCommaDouble(odds[2]?.InnerText);
            //    }
            //    else
            //    {
            //        sm.Option1Odds = ParseCommaDouble(odds[0]?.InnerText);
            //        sm.Option3Odds = ParseCommaDouble(odds[1]?.InnerText);
            //    }

            //    sm.Option1 = options[0]?.InnerText;
            //    sm.Option2 = options[1]?.InnerText;
            //    sm.Option3 = options[2]?.InnerText;

            //    subMatches.Add(sm);
            //}

            //return subMatches;

            #endregion


            var subMatches = new List<SubMatch>();
            var regex = new Regex("(\\[{\"names\":.*\\}\\])");

            var matches = regex.Matches(doc.ParsedText);

            if (matches.Count < 2) return subMatches;

            var headers = JsonConvert.DeserializeObject<List<SubMatchHeaderData>>(matches[0].Value);
            var odds = JsonConvert.DeserializeObject<List<SubMatchOddsData>>(matches[1].Value);

            foreach (var header in headers)
            {
                var sm = new SubMatch
                {
                    MatchName = header.Names.Da,
                    MatchNo = header.MatchNumber
                };

                var id = header.HeaderId;

                var smOdds = odds.Select(o => o).Where(o => o.HeaderId == id).ToList();

                var o1 = smOdds.FirstOrDefault(o => o.BetOption == "1");
                var o2 = smOdds.FirstOrDefault(o => o.BetOption == "X");
                var o3 = smOdds.FirstOrDefault(o => o.BetOption == "2");


                sm.Option1 = o1?.Names.Da;
                sm.Option2 = o2?.Names.Da;
                sm.Option3 = o3?.Names.Da;

                sm.Option1Odds = o1?.GetCalculatedOdds ?? 0.0d;
                sm.Option2Odds = o2?.GetCalculatedOdds ?? 0.0d;
                sm.Option3Odds = o3?.GetCalculatedOdds ?? 0.0d;

                sm.MatchNo = header.MatchNumber;

                subMatches.Add(sm);
            }


            return subMatches;
        }

        public static SubMatch ParseSubMatch(HtmlDocument doc)
        {
            

            return new SubMatch();
        }

        public static Match ParseMatch(HtmlNode n, DateTime date)
        {
            var m = new Match
            {
                Scraped = DateTime.Now,
                SubMatches = new List<SubMatch>()
            };

            // Find the specific match link for submatches
            m.SubMatchLink = n.Attributes["onclick"].Value.HtmlDecodedValue().Split('\'', '\'')[1];

            // Find all the columns
            var col = n.Descendants("td").ToList();

            // Find the time column
            var time = col[0].HtmlDecodedValue();
            // Parse the time column
            var hhmm = time.Split(':'); // Format: 13:00
            var dt = date.AddHours(int.Parse(hhmm[0])).AddMinutes(int.Parse(hhmm[1]));
            m.MatchDate = dt;

            // Find the match id/#
            var num = col[1].HtmlDecodedValue();
            int.TryParse(num, out var matchNum);

            if (matchNum == 0) return null;

            m.MatchNo = matchNum;

            // Find the match name (team names)
            var name = col[2].Descendants("span").First(span => span.Attributes["class"].Value == "eventName").HtmlDecodedValue();
            var names = name.Split('-'); // Format: TeamName1 - TeamName2
            m.MatchName = name;
            m.HomeTeam = names[0]; 
            m.AwayTeam = names[1]; //TODO: Replace whitespaces

            // Find the league / country
            var league = col[2].Descendants("span").First(span => span.Attributes["class"].Value == "typeclassName").HtmlDecodedValue();
            var leagueCountry = league.Split('-'); // Format: League - Country
            m.MatchType = league;

            // Find odds
            var odds = col[3].Descendants("div").Select(d => d).Where(d => d.Attributes["class"].Value.Contains("listPrice")).ToList();
            m.HomeOdds = ParseCommaDouble(odds[0].Descendants("span").FirstOrDefault()?.InnerText);
            m.DrawOdds = ParseCommaDouble(odds[1].Descendants("span").FirstOrDefault()?.InnerText);
            m.AwayOdds = ParseCommaDouble(odds[2].Descendants("span").FirstOrDefault()?.InnerText);

            return m;
        }

        public static IList<MatchRound> ParseMatchRounds(HtmlDocument doc)
        {
            var matchWeeks = new List<MatchRound>();

            var selector = doc.GetElementbyId("kuponspil-round");

            var options = selector.Descendants("option");

            foreach (var option in options)
            {
                var data = option.HtmlDecodedValue();
                var dates = ParseMatchRoundDate(data);

                var numCheck = new Regex("([0-9]*)(?= )");
                var match = numCheck.Match(data);


                matchWeeks.Add(new MatchRound
                {
                    Number = int.Parse(match.Value),
                    Start = dates.Item1,
                    End = dates.Item2
                });
            }

            return matchWeeks;
        }

        public static Match ParseMatchSearch(HtmlDocument doc)
        {
            var list = doc.GetElementbyId("ob-retail-event-list");
            // Get the event container (containing date + the tables with all the matches)
            var container = list
                .Descendants("div")
                .Select(e => e)
                .First(e => e.Attributes["class"].Value == "retailEventContainer");

            // Get the date
            var dateTxt = container.Descendants("p").First().HtmlDecodedValue().Replace(" ", "");
            // Parse the date
            var date = ParseMatchDate(dateTxt);

            // Find the table body
            var eventBody = container.Descendants("tbody").First();
            // Find all the rows
            var @event = eventBody
                .Descendants("tr")
                .Select(x => x)
                .First();

            return ParseMatch(@event, date);
        }


        private static double ParseCommaDouble(string str)
        {
            double.TryParse(str, NumberStyles.Any, CultureInfo.GetCultureInfo("da-DK"), out var res);
            return res;
        }

        private static DateTime ParseMatchDate(string date)
        {
            return DateTime.ParseExact(date.Replace(" ", ""), "dddd,d.MMMMyyyy", CultureInfo.GetCultureInfo("da-DK"));
        }

        private static (DateTime, DateTime) ParseMatchRoundDate(string date)
        {
            var regex = new Regex("(?<=\\()(.*)(?=\\))");
            var dates = regex.Match(date);
            var dateArr = dates.Value.Split('-');

            var start = DateTime.ParseExact(dateArr[0], "dd.MM.yy", CultureInfo.GetCultureInfo("da-DK"));
            var end = DateTime.ParseExact(dateArr[1], "dd.MM.yy", CultureInfo.GetCultureInfo("da-DK"));

            return (start, end);
        }
        
    }
}