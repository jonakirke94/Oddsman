using System;
using Scraper.Core.Model;

namespace Scraper.Core.Extensions
{
    public static class DateTimeExtension
    {
        /// <summary>
        /// Subtracts the current datetime object from the specified date and returns the difference in days.
        /// Setting real as true returns a fractional representation e.g. 1.34 days.
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="date"></param>
        /// <param name="real">Default: false</param>
        /// <returns></returns>
        public static double DifferenceDays(this DateTime obj, DateTime date, bool real = false)
        {
            return real ? (date - obj).TotalDays : (date - obj).Days;
        }

        /// <summary>
        /// Checks whether or not the current object is within the "Inclusive" range of start and end
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <returns></returns>
        public static bool InRangeOf(this DateTime obj, DateTime start, DateTime end)
        {
            return start <= obj && obj <= end;
        }

        /// <summary>
        /// Checks whether or not the current object is within the "Inclusive" range of start and end
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="range"></param>
        /// <returns></returns>
        public static bool InRangeOf(this DateTime obj, DateRange range)
        {
            return range.Start <= obj && obj <= range.End;
        }

        public static DateTime NextWeekdayDate(this DateTime start, DayOfWeek day)
        {
            // The (... + 7) % 7 ensures we end up with a value in the range [0, 6]
            var daysToAdd = ((int)day - (int)start.DayOfWeek + 7) % 7;
            return start.AddDays(daysToAdd).Date;
        }
    }
}
