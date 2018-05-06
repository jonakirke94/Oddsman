using System;
using System.Collections.Generic;
using System.Text;

namespace Scraper.Core.Scraper.DanskeSpil.Model
{
    public class DateRange
    {
        public DateTime Start { get; set; }
        public DateTime End { get; set; }


        public bool WithinRange(DateTime datetime, bool inclusive = true)
        {
            return inclusive ? Start <= datetime && datetime <= End : Start < datetime && datetime < End;
        }
    }
}
