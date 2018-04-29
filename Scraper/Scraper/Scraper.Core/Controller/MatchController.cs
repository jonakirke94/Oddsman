using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Scraper.Core.Data;
using Scraper.Core.Model;
using Scraper.Core.Scraper;

namespace Scraper.Core.Controller
{
    public class MatchController //TODO: rename to something that's better
    {
        private readonly DanskeSpilScraper _scraper = new DanskeSpilScraper();

        /// <summary>
        /// Scrapes the Match Rounds and their values, then adds them to the database.
        /// </summary>
        public async Task ScrapeMatchRounds()
        {
            try
            {
                var rounds = _scraper.GetMatchRounds();

                using (var ctx = new DanskeSpilContext())
                {
                    ctx.MatchRounds.AddRange(rounds);
                    await ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        /// <summary>
        /// Finds a match's round number based on the match's date
        /// </summary>
        /// <param name="date"></param>
        /// <returns>The match round number for the given matches date or a default "not found" value of -1</returns>
        public int GetMatchRoundNum(DateTime date)
        {
            int num;

            try
            {
                using (var ctx = new DanskeSpilContext())
                {
                    num = ctx.MatchRounds.FirstOrDefault(r => r.Start >= date && date <= r.End)?.MatchRoundId ?? -1;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

            return num;
        }


        //public IList<Match> GetUpcomingMatches()
        //{
        //    return _scraper.GetUpcomingMatches();
        //}

        //public IList<SubMatch> GetSubMatches(string eventUrl)
        //{
        //    return _scraper.GetSubMatches(eventUrl);
        //}

        //public Match GetUpcomingMatch(int matchNumber)
        //{
        //    return _scraper.GetUpcomingMatch(matchNumber);
        //}

        //public IList<Result> GetResults()
        //{
        //    throw new NotImplementedException();
        //}
    }
}