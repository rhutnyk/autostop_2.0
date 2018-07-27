using System;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.OData;
using AutoStop.Models;

namespace AutoStop.Controllers
{
    [EnableQuery(PageSize = 10)]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class PartsController : ODataController
    {
        WorkWithData data = new WorkWithData();
        

        public IHttpActionResult Get()
        {
            try
            {
                return Ok(data.GetParts());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        
        public IHttpActionResult Get(int analog)
        {
            try
            {
                return Ok(data.GetAnalog(analog));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        
        public IHttpActionResult Get(string desc)
        {
            try
            {
                return Ok(data.GetByString(desc));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        
        public IHttpActionResult Get(string number, string str = null)
        {
            try
            {
                return Ok(data.GetByNumber(number));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
