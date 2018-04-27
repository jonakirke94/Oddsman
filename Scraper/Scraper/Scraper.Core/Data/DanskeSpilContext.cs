using Microsoft.EntityFrameworkCore;
using Scraper.Core.Model;

namespace Scraper.Core.Data
{
    public class DanskeSpilContext : DbContext
    {
        public DbSet<Match> Matches { get; set; }
        public DbSet<SubMatch> SubMatches { get; set; }
        public DbSet<Result> Results { get; set; }
        public DbSet<MatchRound> MatchRounds { get; set; }
        

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }



    }
}