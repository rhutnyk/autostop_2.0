using System;
using System.Web.Http;
using System.Web.Http.Cors;
using AutoStop.Models;

namespace AutoStop.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class PartsController : ApiController
    {
        const int TakeDefault = 20;
        WorkWithData data = new WorkWithData();

        
        public IHttpActionResult Get(int skip = 0, int take = 20)
        {
            try
            {
                var result = data.GetParts(skip, take);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        
        public IHttpActionResult Get(int analog, int skip = 0, int take = TakeDefault)
        {
            try
            {
                var result = data.GetAnalog(analog, skip, take);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        public IHttpActionResult Get(string desc, int skip = 0, int take = TakeDefault)
        {
            try
            {
                var result = data.GetByDescription(desc, skip, take);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        public IHttpActionResult GetNum(string number, int skip = 0, int take = TakeDefault)
        {
            try
            {
                var result = data.GetByNumber(number, skip, take);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        
        public IHttpActionResult GetCurrency(string rate)
        {
            try
            {
                return Ok(new { currency = "euro", rate = ParseXml.GetCurrencyRate() });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
