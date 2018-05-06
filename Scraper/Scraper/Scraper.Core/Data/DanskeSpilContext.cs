using Microsoft.EntityFrameworkCore;
using Scraper.Core.Model;

namespace Scraper.Core.Data
{
    public class DanskeSpilContext : DbContext
    {
        public DbSet<Match> Matches { get; set; }
        public DbSet<Result> Results { get; set; }
        private static string _con;


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySql(_con);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }


        public static void SetConnectionString(string con)
        {
            _con = con;
        }
    }
}