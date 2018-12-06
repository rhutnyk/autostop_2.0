using AutoStop.Models;
using System;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;

namespace AutoStop.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ContactController : ApiController
    {
        readonly WorkWithData data = new WorkWithData();
        const int TakeDefault = 20;


        public IHttpActionResult Get(int skip = 0, int take = TakeDefault)
        {
            try
            {
                var contacts = data.GetContactsMessages(skip, take);

                return Ok(new { count = contacts.Count(), contacts });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        
        public IHttpActionResult Get(int id)
        {
            try
            {
                var contact = data.GetContactsMessagesById(id);

                return Ok(contact);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        
        }

        
        public IHttpActionResult Post([FromBody] ContactUs cont)
        {
            try
            {
                data.AddContactMessage(cont);

                return Ok();
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }

        }

       
    }
}
