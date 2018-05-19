using System;

namespace Scraper.Core.Model
{
    public class DateRange
    {
        public DateRange() { }
        public DateRange(DateTime start, DateTime end)
        {
            Start = start;
            End = end;
        }

        public DateTime Start { get; set; }
        public DateTime End { get; set; }


        public bool WithinRange(DateTime datetime, bool inclusive = true)
        {
            return inclusive ? Start <= datetime && datetime <= End : Start < datetime && datetime < End;
        }
    }
}
