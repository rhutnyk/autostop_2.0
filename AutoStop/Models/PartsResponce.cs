using System.Collections.Generic;


namespace AutoStop.Models
{
    public class PartsResponce
    {
        public int Count { get; set; }
        public IEnumerable<PartIsAnalog> Items { get; set; }
    }
}