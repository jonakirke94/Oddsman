using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Scraper.Core.Data;
using Scraper.Core.Model;
using Scraper.Core.Scraper.DanskeSpil;
using Scraper.Core.Scraper.DanskeSpil.Model;

namespace Scraper.Core.Controller
{
    public class MatchController //TODO: rename to something that's better
    {
        private readonly DanskeSpilScraper _scraper = new DanskeSpilScraper();


        public Match GetMatch(int matchId, int? eventId = null)
        {
            Match match;
            try
            {
                using (var db = new DanskeSpilContext())
                {
                    match = db.Matches.FirstOrDefault(m => m.MatchId == matchId);
                    if (match == null)
                    {
                        match = _scraper.GetUpcomingMatch(matchId, eventId);
                        db.Matches.Add(match);
                        db.SaveChanges();
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

            return match;
        }


        public Result GetResult(int matchRound, int matchId, int? parentMatchId = null)
        {
            Result res;

            try
            {
                using (var db = new DanskeSpilContext())
                {
                    var match = db.Matches.Include(m => m.Result).FirstOrDefault(m => m.MatchId == matchId);

                    if (match != null)
                    {
                        if (match.Result == null)
                        {
                            res = _scraper.GetMatchResult(match.RoundId, matchId, parentMatchId);
                            db.Results.Add(res);
                            db.SaveChanges();
                        }
                        else
                        {
                            res = match.Result;
                        }
                    }
                    else
                    {
                        res = null;
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

            return res;
        }

        
    }
}