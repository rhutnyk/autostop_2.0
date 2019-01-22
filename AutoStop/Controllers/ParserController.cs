using AutoStop.Models;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.OData;

namespace AutoStop.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ParserController : ODataController
    {
       WorkWithData data;
       private static string KEY = "12345";
       
        
        public IHttpActionResult Get(string key)
        {
            if (key.ToUpper() == KEY.ToUpper())
            {
                try
                {
                    return Ok(ParseXml.Start());
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
            else
            {
                return BadRequest("Key is invalid");
            }
        }


        public IHttpActionResult Get()
        {
            try
            {   data = new WorkWithData();
                return Ok(data.GetLogs());
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
    }
}
