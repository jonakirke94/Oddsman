using System;
using System.Linq;
using Scraper.Core.Data;
using Scraper.Core.Model;
using Scraper.Core.Scraper.DanskeSpil;

namespace Scraper.Core.Controller
{
    public class MatchController //TODO: rename to something that's better
    {
        private readonly DanskeSpilScraper _scraper = new DanskeSpilScraper();

        



        public Match GetUpcomingMatch(int matchId)
        {
            Match match;
            try
            {
                using (var db = new DanskeSpilContext())
                {
                    match = db.Matches.FirstOrDefault(m => m.MatchId == matchId);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

            return match;
        }



        //public IList<Match> GetUpcomingMatches()
        //{
        //    return _scraper.GetUpcomingMatches();
        //}

        //public IList<SubMatch> GetSubMatches(string eventUrl)
        //{
        //    return _scraper.GetSubMatches(eventUrl);
        //}



        //public IList<Result> GetResults()
        //{
        //    throw new NotImplementedException();
        //}
    }
}