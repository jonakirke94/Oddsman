using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using HtmlAgilityPack;
using Newtonsoft.Json;
using Scraper.Core.Extension;
using Scraper.Core.Model;
using Scraper.Core.Scraper.DanskeSpil.Model;
using Match = Scraper.Core.Model.Match;

namespace Scraper.Core.Scraper.DanskeSpil
{
    public static class DanskeSpilParser
    {
        private const string SubMatchJsonExpression = "({\\\"names\\\":.*\\})";
        private const string MatchRoundNumberExpression = "([0-9]*)(?= )";
        private const string MatchRoundDateExpression = "(?<=\\()(.*)(?=\\))";
        private const string MatchEventIdExpression = "(?<=\\-)([0-9]*)(?=\\.)";
        private const string DsCultureInfo = "da-DK";
        private const string MatchDateFormat = "dddd,d.MMMMyyyy";
        private const string MatchRoundDateFormat = "dd.MM.yy";
        private const string ResultDateFormat = "dddd, dd. MMMM yyyy";



        public static IList<Match> ParseMatches(HtmlDocument doc, DateRange dateRange = null)
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

                if(dateRange != null && !dateRange.WithinRange(date)) continue;

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

        public static Match ParseMatch(HtmlNode n, DateTime date)
        {
            var m = new Match
            {
                LastUpdated = DateTime.Now
            };
            // Find the specific match link for submatches
            var eventLink = n.Attributes["onclick"].Value.HtmlDecodedValue().Split('\'', '\'')[1];
            var eventIdMatcher = new Regex(MatchEventIdExpression);
            var eventId = eventIdMatcher.Match(eventLink).Value;
            m.EventId = int.Parse(eventId);

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

            m.MatchId = matchNum;

            // Find the match name (team names)
            var name = col[2].Descendants("span").First(span => span.Attributes["class"].Value == "eventName").HtmlDecodedValue();
            var names = name.Split('-'); // Format: TeamName1 - TeamName2
            m.MatchName = name;
            
            m.Option1 = names[0];
            m.Option2 = "Uafgjort";
            m.Option3 = names[1]; //TODO: Replace whitespaces
            

            // Find odds
            var odds = col[3].Descendants("div").Select(d => d).Where(d => d.Attributes["class"].Value.Contains("listPrice")).ToList();
            m.Option1Odds = ParseCommaDouble(odds[0].Descendants("span").FirstOrDefault()?.InnerText);
            m.Option2Odds = ParseCommaDouble(odds[1].Descendants("span").FirstOrDefault()?.InnerText);
            m.Option3Odds = ParseCommaDouble(odds[2].Descendants("span").FirstOrDefault()?.InnerText);

            return m;
        }

        public static IList<Match> ParseSubMatches(SubMatchData data)
        {
            if (data == null) return null;
            var subMatches = new List<Match>();
            foreach (var header in data.Headers)
            {
                var smOdds = data.Odds.Select(o => o).Where(o => o.HeaderId == header.HeaderId).ToList();
                subMatches.Add(ParseSubMatch(header, smOdds, data.Info));
            }


            return subMatches;
        }

        public static Match ParseSubMatch(SubMatchHeaderData header, IList<SubMatchOddsData> odds, SubMatchDataInfo info)
        {
            var o1 = odds.FirstOrDefault(o => o.BetOption == "1");
            var o2 = odds.FirstOrDefault(o => o.BetOption == "X");
            var o3 = odds.FirstOrDefault(o => o.BetOption == "2");

            return new Match
            {
                MatchName = header.Names.Da,
                ParentId = info.ParentId != int.Parse(header.MatchId) ? info.ParentId : null,
                EventId = header.EventId,
                MatchId = int.Parse(header.MatchId),
                MatchDate = DateTime.Parse(info.MatchDate),
                Option1 = o1?.Names.Da,
                Option2 = o2?.Names.Da,
                Option3 = o3?.Names.Da,
                Option1Odds = o1?.GetCalculatedOdds ?? 0.0d,
                Option2Odds = o2?.GetCalculatedOdds ?? 0.0d,
                Option3Odds = o3?.GetCalculatedOdds ?? 0.0d
            };
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

                var numCheck = new Regex(MatchRoundNumberExpression);
                var match = numCheck.Match(data);


                matchWeeks.Add(new MatchRound
                {
                    Number = int.Parse(match.Value),
                    MatchRoundId = int.Parse(option.Attributes["value"].Value),
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

        public static SubMatchData ParseSubMatchData(HtmlDocument doc)
        {
            var regex = new Regex(SubMatchJsonExpression);

            var matches = regex.Matches(doc.ParsedText);

            if (matches.Count < 3) return null;

            var info = JsonConvert.DeserializeObject<SubMatchDataInfo>(matches[0].Value);
            var headers = JsonConvert.DeserializeObject<List<SubMatchHeaderData>>($"[{matches[1].Value}]");
            var odds = JsonConvert.DeserializeObject<List<SubMatchOddsData>>($"[{matches[2].Value}]");

            info.ParentId = int.Parse(headers.First().MatchId);
            headers.RemoveAt(0); // remove ParentMatch

            return new SubMatchData{ Headers = headers, Odds = odds, Info = info};
        }



        public static Result ParseResult(HtmlDocument doc, int matchId)
        {
            Result res = null;

            var rows = doc.GetElementbyId("resultTable")
                .Descendants("tbody")
                .FirstOrDefault()
                ?.Descendants("tr")
                .Where(r => r.HasClass("eventDetailsRow"))
                .ToList();

            if (rows == null) return null;

            foreach (var row in rows)
            {
                var cols = row.Descendants("td").ToList();
                var idCol = cols[0];
                int.TryParse(idCol.InnerHtml, out var id);

                if(id != matchId) continue;;

                var correctBet = cols.First(c => c.HasClass("boldText"))?.InnerHtml;
                var score = cols.First(c => c.HasClass("centeredText"))?.InnerHtml;
                res = new Result
                {
                    CorrectBet = correctBet,
                    Score = score,
                    MatchId = id
                };
                
                break;
            }

            return res;
        }

        #region Helper Methods

        private static double ParseCommaDouble(string str)
        {
            double.TryParse(str, NumberStyles.Any, CultureInfo.GetCultureInfo(DsCultureInfo), out var res);
            return res;
        }

        private static DateTime ParseMatchDate(string date)
        {
            return DateTime.ParseExact(date.Replace(" ", ""), MatchDateFormat, CultureInfo.GetCultureInfo(DsCultureInfo));
        }

        private static (DateTime, DateTime) ParseMatchRoundDate(string date)
        {
            var regex = new Regex(MatchRoundDateExpression);
            var dates = regex.Match(date);
            var dateArr = dates.Value.Split('-');

            var start = DateTime.ParseExact(dateArr[0], MatchRoundDateFormat, CultureInfo.GetCultureInfo(DsCultureInfo));
            var end = DateTime.ParseExact(dateArr[1], MatchRoundDateFormat, CultureInfo.GetCultureInfo(DsCultureInfo));

            return (start, end);
        }

        private static DateTime ParseResultDate(string date) // TODO: Find out if needed
        {
            return DateTime.ParseExact(date, ResultDateFormat, CultureInfo.GetCultureInfo(DsCultureInfo)); // Søndag, 29. april 2018
        }

        #endregion

    }
}