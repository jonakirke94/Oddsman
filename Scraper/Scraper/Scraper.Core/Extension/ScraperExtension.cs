using System.Web;
using HtmlAgilityPack;

namespace Scraper.Core.Extension
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