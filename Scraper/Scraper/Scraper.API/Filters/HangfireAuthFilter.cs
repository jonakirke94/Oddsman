using Hangfire.Dashboard;

namespace Scraper.API.Filters
{
    public class HangfireAuthFilter : IDashboardAuthorizationFilter
    {
        public bool Authorize(DashboardContext context)
        {
            //var httpContext = context.GetHttpContext();
            //httpContext.User.Identity.IsAuthenticated
            return true; //hack
        }
    }
}