using System;
using System.Collections.Generic;
using System.Linq;
using Scraper.Core.Model;

namespace Scraper.Core.Scraper.DanskeSpil.Model
{
    public sealed class MatchRoundIds
    {
        private static IList<MatchRound> _rounds;
        private static MatchRoundIds _instance;
        private static readonly object InstanceLock = new object();
        private static readonly object CollectionLock = new object();


        public static void SetValues(IList<MatchRound> rounds)
        {
            _rounds = new List<MatchRound>(rounds);
        }

        public static MatchRoundIds Instance
        {
            get
            {
                lock (InstanceLock)
                {
                    return _instance ?? (_instance = new MatchRoundIds());
                }
            }
        }

        public static bool IsEmptyOrOutdated
        {
            get
            {
                lock (CollectionLock)
                {

                    return (_rounds == null || _rounds.Count == 0) || _rounds.OrderByDescending(r => r.End).First().End < DateTime.Now;
                }
            }
        }

        public static int GetMatchRoundId(DateTime date)
        {
            if (date == DateTime.MinValue)
            {
                Console.WriteLine($"IS Min VAL: {date}");
            }
            var id = _rounds.Select(r => r)
                .FirstOrDefault(r => r.Start.Date <= date.Date && date.Date <= r.End.Date)
                ?.MatchRoundId ?? -1;

            if (id != -1) return id;

            var latest = _rounds.OrderByDescending(r => r.MatchRoundId).ToList().First();
            Console.WriteLine($"GETMATCHID: {latest.Start} < {date} > {latest.End}");

            var difference = (date - latest.End).Days;

            if (difference > 3 || difference < 0) return id;

            Console.WriteLine($"Difference: {difference}");
            id = latest.MatchRoundId + 1;

            return id;
        }
    }
}