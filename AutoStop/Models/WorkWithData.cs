using System;
using System.Collections.Generic;
using System.Linq;


namespace AutoStop.Models
{
    public class WorkWithData
    {
        Model1 db = new Model1();
        

        public IEnumerable<Part> GetParts()
        {
            try
            {
                var parts = db.Parts;
                return parts;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


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


        public IEnumerable<Part> GetByString(string str)
        {
            try
            {
                var filtered = db.Parts.Where(a => a.Description.IndexOf(str) > -1);
                
                return filtered;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        

        public IEnumerable<Part> GetByNumber(string number)
        {
            try
            {
                var filtered = db.Parts.Where(a => a.Number.Replace("-", "").Replace(".", "").Replace(" ","").IndexOf(number) > -1);

                return filtered;
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
            var c = leftTable.Count();
            var result = leftTable.GroupJoin(GetAllAnalogs(), lang => lang.id, pers => pers.partId,
               (lang, ps) => new PartIsAnalog { parts = lang, IsAnalog = ps.FirstOrDefault(), Count = c });

            return result;
        }

    }
}