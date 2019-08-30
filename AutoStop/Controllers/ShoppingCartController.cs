using AutoStop.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;

namespace AutoStop.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ShoppingCartController : ApiController
    {
        EmailNotification email = new EmailNotification();
        readonly WorkWithData data = new WorkWithData();
        string PartNumbers;

        public IHttpActionResult Get()
        {
            return Ok("Shopping card");
        }
       
        [HttpPost]
        public IHttpActionResult Post (ShoppingCart card)
        {
            if (card != null && card.Parts != null)
            {
                Double uan;
                try
                {
                    uan = Double.Parse(ParseXml.GetCurrencyRate()) * card.TotalSum;
                }catch(Exception ex)
                {
                    uan = 0;
                }
                try
                {
                    email._to = "autostop04@gmail.com";
                    email._name_user = card.NameCustomer;
                    email._email_user = card.EmailCustomer;
                    email._phone_user = card.PhoneCustomer;
                    email._subject = "Shopping";

                    email._body = "<p>Спосіб доставки: <b>"+card.DeliveryType+"</b></p>" +
                        "<p>Спосіб оплати: <b>" + card.PaymentType + "</b></p>" + "<table>" +
                        "<thead>" +
                        "<tr>" +
                        "<td><b>Номер</b><td>" +
                        "<td><b>Опис</b><td>" +
                        "<td><b>К-сть</b><td>" +
                        "<td><b>Ціна</b><td>" +
                        "</tr>" +
                        "</thead>" +
                        "<tbody>";
                    foreach (var p in card.Parts)
                    {
                        if(p.QtyOrder > p.Qty)
                        {
                            throw new Exception( p.Number+" order overcount");
                        }
                        email._body += "<tr>" +
                            "<td>" + p.Number + "<td>" +
                            "<td>" + p.Description + "<td>" +
                            "<td>" + p.QtyOrder + "<td>" +
                            "<td>" + p.Price + "<td>" +
                            "</tr>";
                        PartNumbers += p.Number + "; ";
                    }
                    email._body += "</tbody></table>";
                    email._body += "<p><b>Сума: </b>"+card.TotalSum+" Є ("+uan+" грн.)</p>";
                    

                    new Task(() => email.SendEmailShoppingCard()).Start();

                    var log = new Log()
                    {
                        FileName = "Shopping cart",
                        Message = card.NameCustomer + "/" + card.EmailCustomer + "/" + card.PaymentType + "/" + card.DeliveryType + "/" + PartNumbers,
                        LogDate = DateTime.Now
                    };
                    data.AddLog(log);

                    return Ok();
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
            else
            {
                return BadRequest("Object empty");
            }
            
        }
    }
}
