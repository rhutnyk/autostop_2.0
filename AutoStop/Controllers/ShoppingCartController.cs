using AutoStop.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace AutoStop.Controllers
{
    public class ShoppingCartController : ApiController
    {
        EmailNotification email = new EmailNotification();
        readonly WorkWithData data = new WorkWithData();

        public IHttpActionResult Get()
        {
            return Ok("Shopping card");
        }
       
        public IHttpActionResult Post (ShoppingCart card)
        {
            if (card != null && card.Parts != null)
            {
                
                try
                {
                    email._to = "ihor.moskvita@bitsorchestra.com";
                    email._name_user = card.NameCustomer;
                    email._email_user = card.EmailCustomer;
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
                            "<td>" + p.Qty + "<td>" +
                            "<td>" + p.Price + "<td>" +
                            "</tr>";
                            
                    }
                    email._body += "</tbody></table>";
                    email._body += "<p><b>Сума: </b>"+card.TotalSum+"</p>";
                    //email._body = "<p>" + card.Parts.First().Description + "</p>";

                    new Task(() => email.SendEmailShoppingCard()).Start();
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
