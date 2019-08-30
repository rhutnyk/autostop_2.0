using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AutoStop.Models
{
    public class PartOrder
    {
        public int Id { get; set; }
        public string Number { get; set; }
        public string Description { get; set; }
        public int Qty { get; set; }
        public int QtyOrder { get; set; }
        public decimal? Price { get; set; }
        public string Brand { get; set; }
    }

    public class ShoppingCart
    {
        public int id { get; set; }
        public ICollection<PartOrder> Parts { get; set; }
        public string NameCustomer { get; set; }
        public string EmailCustomer { get; set; }
        public string PhoneCustomer { get; set; }
        public double TotalSum { get; set; }
        public string DeliveryType { get; set; }
        public string PaymentType { get; set; }
    }
}