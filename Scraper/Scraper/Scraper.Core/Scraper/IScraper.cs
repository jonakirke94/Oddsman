using HtmlAgilityPack;
using OpenQA.Selenium.Chrome;

namespace Scraper.Core.Scraper
{
    public interface IScraper
    {
        HtmlDocument LoadHtmlPage(string url);
        ChromeDriver LoadDriver(string url);
    }
}