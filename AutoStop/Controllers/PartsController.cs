using System;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.OData;
using AutoStop.Models;

namespace AutoStop.Controllers
{
    [EnableQuery(PageSize = 20)]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class PartsController : ApiController
    {
        WorkWithData data = new WorkWithData();
        

        public IHttpActionResult Get()
        {
            try
            {
                var result = data.LeftJoinTable(data.GetParts());
                return Ok(result);
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
                var result = data.LeftJoinTable(data.GetByString(desc));
                return Ok(result);
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
                var result = data.LeftJoinTable(data.GetByNumber(number));
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
