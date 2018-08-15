using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Hosting;
using System.Xml.Linq;

namespace AutoStop.Models
{
    public static class ParseXml
    {
        static bool isStart = false;
        static string ExchangeRate;
        static WorkWithData db;
        static readonly string file = HostingEnvironment.MapPath(@"~/Parts.xml");
        static readonly string fileExchange = HostingEnvironment.MapPath(@"~/Misc_Data.xml");
        static XElement xEmp;
        static XNamespace ns;


        public static string Start()
        {
            if (!isStart)
            {
                var task = Task.Run(()=>ParserCore());
                isStart = true;

                return "Starting success";
            }
            else
            {
                return "Parser already is started";
            }
        }


        private static void ParserCore()
        {
            Log log = new Log();
            try
            {
                
                log.LogDate = DateTime.Now;
                log.FileName = Path.GetFileName(file);

                xEmp = XElement.Load(file);
                ns = xEmp.GetDefaultNamespace();

                log.FileName += " (Size:" + new FileInfo(file).Length / 1024 + "KB)";

                var parts = ANet.InsertPartToDb(GetPartsFromXml());
                log.Message = parts;
                var analogs = ANet.InsertAnalogToDb(GetAnalogFromXml());
                log.Message += analogs;

                GetExchangeRateFromXml();
            }
            catch (Exception ex)
            {
                log.Message += ex.Message;
            }

            finally
            {
                isStart = false;
                try
                {
                    db = new WorkWithData();
                    db.AddLog(log);
                    
                }catch(Exception ex) { log.Message = ex.Message; }
            }
        }



        private static List<Part> GetPartsFromXml()
        {
            try
            {
                var listParts = new List<Part>();
                
                var parts = from emps in xEmp.Elements(ns + "Part")
                            select emps;

                foreach (XElement xe in parts)
                {
                    listParts.Add(new Part()
                    {
                        Number = xe.Element(ns + "Number").Value,
                        Price = Decimal.Parse(xe.Element(ns + "Price").Value),
                        Description = xe.Element(ns + "Description").Value,
                        Brand = xe.Element(ns + "Brand").Value,
                        Qty1 = int.Parse(xe.Element(ns + "Qty1").Value),
                        Qty2 = int.Parse(xe.Element(ns + "Qty2").Value),
                        Qty = int.Parse(xe.Element(ns + "Qty").Value),
                        id = int.Parse(xe.Element(ns + "id").Value)
                    });
                }

                return listParts;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        private static List<Analog> GetAnalogFromXml()
        {
            try
            {
                List<Analog> listAnalog = new List<Analog>();

                var analogs = from emps in xEmp.Elements(ns + "Analog")
                            select emps;

                foreach (XElement xe in analogs)
                {
                    listAnalog.Add(new Analog()
                    {
                        partId = int.Parse(xe.Element(ns + "partId").Value),
                        analogId = int.Parse(xe.Element(ns + "analogId").Value)
                    });
                }

                return listAnalog;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        private static void GetExchangeRateFromXml()
        {
            xEmp = XElement.Load(fileExchange);
            ExchangeRate = xEmp.Element("Euro_rate").Value;
        }


        //public method get currency
        public static string GetCurrencyRate()
        {
            if(ExchangeRate == null)
            {
                GetExchangeRateFromXml();
            }
            return ExchangeRate;
        }

    }
}