using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Scraper.Core.Data;
using Scraper.Core.Scraper;
using Scraper.Core.Scraper.DanskeSpil;

namespace Scraper.Core.Controller
{
    public class TaskController
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
    }
}
