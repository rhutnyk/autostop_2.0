using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AutoStop.Models
{
    public class WorkWithData
    {
        Model1 db = new Model1();
        static List<LocalPartData> allParts = null;
        static bool isLoad = false;

        public PartsResponse GetParts(int skip, int take)
        {
            var response = db.Parts.OrderByDescending(a => a.Qty).ThenBy(a => a.Number).Skip(skip).Take(take);
            var res = CreatePartsResponse(response, db.Parts.Count());
            new Task(() => GetLocalAllData()).Start();
            return res;
        }

        
        public PartsResponse GetAnalog(int id, int skip, int take)
        {
            var res = from p in db.Parts
                       join a in db.Analogs on p.id equals a.analogId
                       where a.partId == id
                       orderby p.Qty descending
                       select p;


            var result = CreatePartsResponse(res, res.Count());

            return result;
        }


        public PartsResponse GetByDescription(string str, int skip, int take)
        {
            var desc = str.Replace(".", "").Replace("-", "").Replace(",", "").Replace(" ", "").ToLower();
            var filtered = db.Parts.Where(a => a.Description.IndexOf(desc) > -1).OrderByDescending(a => a.Qty).ThenBy(a => a.Number);
            var response = CreatePartsResponse(filtered.Skip(skip).Take(take), filtered.Count());

            return response;
        }
        

        public PartsResponse GetByNumber(string number, int skip, int take)
        {
            var num = (number.Replace(".", "").Replace("-", "").Replace(",", "").Replace(" ", "").Replace("/","")).ToLower();
            if(allParts == null)
            {
                GetLocalAllData();
            }
            var filtered = allParts.Where(a => a.SearchNumber.Contains(num)).Select(a => a.Item).ToList();
            var skipData = filtered.Skip(skip).Take(take);
            var result = LeftJoinTable(skipData);
            var response = new PartsResponse { Count = filtered.Count(), Items = result };

            return response;
        }



        public List<Log> GetLogs()
        {
            return db.Logs.OrderByDescending(a=>a.id).ToList();
        }
               


        public void AddLog(Log log)
        {
            if(log != null)
            {
                db.Logs.Add(log);
                db.SaveChanges();
            }
        }


        public IEnumerable<Analog> GetAllAnalogs()
        {
            return db.Analogs;
        }


        public IEnumerable<PartIsAnalog> LeftJoinTable (IEnumerable<Part> leftTable)
        {
            //db.Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
            List<PartIsAnalog> list = new List<PartIsAnalog>();

            var query = (from r in db.Analogs
                         select r.partId).Distinct().ToList();
            
            var parts = leftTable.ToList();

            foreach (var i in parts)
            {
                list.Add(new PartIsAnalog()
                {
                    Part = i,
                    IsAnalog = query.IndexOf(i.id)>-1
                });
            }

            return list;
        }


        //create parts with count and isAnalog
        private PartsResponse CreatePartsResponse(IQueryable<Part> parts, int count)
        {
            var result = LeftJoinTable(parts);
            
            return new PartsResponse { Count = count, Items = result };
        }



        public void AddContactMessage (ContactUs contact)
        {
            if (contact != null)
            {
                EmailNotification email = new EmailNotification();
                email._name_user = contact.Name;
                email._email_user = contact.Email;
                email._body = contact.Message;
                email._subject = "Автостоп";
                email._to = "ihor.moskvita@bitsorchestra.com";
                new Task(()=>email.SendEmail()).Start();

                contact.Date = DateTime.Now;
                db.Contact.Add(contact);
                db.SaveChanges();
            }
        }


        public IEnumerable<ContactUs> GetContactsMessages (int skip, int take)
        {
            var contacts = db.Contact.OrderByDescending(a=>a.Date).Skip(skip).Take(take);

            return contacts;
        }


        public ContactUs GetContactsMessagesById (int id)
        {
            var contact = db.Contact.Where(a => a.Id == id).SingleOrDefault();

            return contact;
        }


        private void GetLocalAllData()
        {
            if (!isLoad)
            {
                allParts = db.Parts.OrderByDescending(a=>a.Qty).ThenBy(a=>a.Number).Select(a=> new LocalPartData {Item =  a, SearchNumber = a.Number
                    .Replace("-", string.Empty).Replace(".", string.Empty).Replace("/", string.Empty).Replace(" ", string.Empty).Replace(",", string.Empty)
                    .ToLower()})
                    .ToList();

                isLoad = true;
            }
           
        }
    }
}