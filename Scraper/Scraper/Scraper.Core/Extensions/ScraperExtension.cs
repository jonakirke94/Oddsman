using System.Web;
using HtmlAgilityPack;

namespace Scraper.Core.Extensions
{
    public static class ScraperExtension
    {
        public static string HtmlDecodedValue(this HtmlNode node)
        {
            return HttpUtility.HtmlDecode(node.InnerHtml);
        }

        public static string HtmlDecodedValue(this string str)
        {
            return HttpUtility.HtmlDecode(str);
        }
    }
}