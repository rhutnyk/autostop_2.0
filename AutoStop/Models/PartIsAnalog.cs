using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace AutoStop.Models
{
    
    public class PartIsAnalog
    {
       public int Count { get; set; } 
       public Part parts { get; set; }
       public Analog IsAnalog { get; set; } 

    }
}