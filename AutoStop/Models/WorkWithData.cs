using System;
using System.Collections.Generic;
using System.Linq;


namespace AutoStop.Models
{
    public class WorkWithData
    {
        Model1 db = new Model1();



        public PartsResponse GetParts(int skip, int take)
        {
            var response = CreatePartsResponse(db.Parts, skip, take);

            return response;
        }

        
        public PartsResponse GetAnalog(int id, int skip, int take)
        {
            try
            {
                var res = from p in db.Parts
                          join a in db.Analogs on p.id equals a.analogId
                          where a.partId == id
                          select p;

                var result = CreatePartsResponse(res, skip, take);

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public PartsResponse GetByDescription(string str, int skip, int take)
        {
            try
            {
                var desc = str.Replace(".", "").Replace("-", "").Replace(",", "").Replace(" ", "");
                var filtered = db.Parts.Where(a => a.Description.IndexOf(desc) > -1);
                var response = CreatePartsResponse(filtered, skip, take);

                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        

        public PartsResponse GetByNumber(string number, int skip, int take)
        {
            try
            {
                var num = number.Replace(".", "").Replace("-", "").Replace(",", "").Replace(" ", "");
                var filtered = db.Parts.Where(a => a.Number.Replace("-", "").Replace(".", "").Replace(" ","").IndexOf(num) > -1);
                var response = CreatePartsResponse(filtered, skip, take);

                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



        public List<Log> GetLogs()
        {
            try
            {
                return db.Logs.ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
               


        public void AddLog(Log log)
        {
            if(log != null)
            {
                try
                {
                    db.Logs.Add(log);
                    db.SaveChanges();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }


        public IEnumerable<Analog> GetAllAnalogs()
        {
            try
            {
                return db.Analogs;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public IEnumerable<PartIsAnalog> LeftJoinTable (IEnumerable<Part> leftTable)
        {
            try
            {
                var result = leftTable.GroupJoin(db.Analogs, lang => lang.id, pers => pers.partId,
                   (lang, ps) => new PartIsAnalog { Part = lang, IsAnalog = ps.FirstOrDefault() == null ? false : true });

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        //create parts with count and isAnalog
        private PartsResponse CreatePartsResponse(IQueryable<Part> parts, int skip, int take)
        {
            try
            {
                var count = parts.Count();
                var tRes = parts.OrderBy(a => a.id).Skip(skip).Take(take);
                var result = LeftJoinTable(tRes);
                return new PartsResponse { Count = count, Items = result };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}