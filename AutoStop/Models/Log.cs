namespace AutoStop.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Log")]
    public partial class Log
    {
        public int id { get; set; }

        public DateTime LogDate { get; set; }

        [StringLength(1000)]
        public string Message { get; set; }

        [StringLength(250)]
        public string FileName { get; set; }
    }
}
