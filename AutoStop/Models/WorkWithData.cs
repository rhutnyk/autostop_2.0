using System;
using System.Collections.Generic;
using System.Linq;


namespace AutoStop.Models
{
    public class WorkWithData
    {
        Model1 db = new Model1();


        //public IEnumerable<Part> GetParts()
        //{
        //    try
        //    {
        //        var parts = db.Parts;
        //        return parts;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}


        public PartsResponce GetParts(int skip, int take)
        {
            var response = CreatePartsResponse(db.Parts, skip, take);

            return response;
        }

        //???? need to count
        public IEnumerable<Part> GetAnalog(int id)
        {
            try
            {
                var res = from p in db.Parts
                          join a in db.Analogs on p.id equals a.analogId
                          where a.partId == id
                          select p;


                return res;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public PartsResponce GetByDescription(string str, int skip, int take)
        {
            try
            {
                var filtered = db.Parts.Where(a => a.Description.IndexOf(str) > -1);
                var responce = CreatePartsResponse(filtered, skip, take);

                return responce;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        

        public PartsResponce GetByNumber(string number, int skip, int take)
        {
            try
            {
                var filtered = db.Parts.Where(a => a.Number.Replace("-", "").Replace(".", "").Replace(" ","").IndexOf(number) > -1);
                var responce = CreatePartsResponse(filtered, skip, take);

                return responce;
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
            return db.Analogs;
        }


        public IEnumerable<PartIsAnalog> LeftJoinTable (IEnumerable<Part> leftTable)
        {

            var result = leftTable.GroupJoin(db.Analogs, lang => lang.id, pers => pers.partId,
               (lang, ps) => new PartIsAnalog { Part = lang, IsAnalog = ps.FirstOrDefault() == null ? false : true });

            return result;
        }


        //create parts with count and isAnalog
        private PartsResponce CreatePartsResponse(IQueryable<Part> parts, int skip, int take)
        {
            var count = parts.Count();
            var tRes = parts.OrderBy(a => a.id).Skip(skip).Take(take);
            var result = LeftJoinTable(tRes);
            return new PartsResponce { Count = count, Items = result };
        }


    }
}