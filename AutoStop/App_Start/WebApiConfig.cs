using AutoStop.Models;
using System.Net.Http.Formatting;
using System.Web.Http;
using System.Web.Http.OData.Builder;
using System.Web.Http.OData.Extensions;

namespace AutoStop
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.Formatters.Clear();
            config.Formatters.Add(new JsonMediaTypeFormatter());
            // Web API configuration and services
            config.EnableCors();

            ODataModelBuilder builder = new ODataConventionModelBuilder();
            builder.EntitySet<Part>("parts");
            builder.EntitySet<Log>("parser");
            config.Routes.MapODataServiceRoute("api", "api", builder.GetEdmModel());
            
            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { controller = "Parts", id = RouteParameter.Optional }
            );


        }
    }
}
