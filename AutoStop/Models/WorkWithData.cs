using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AutoStop.Models
{
    public class WorkWithData
    {
        Model1 db = new Model1();



        public PartsResponse GetParts(int skip, int take)
        {
            var response = db.Parts.OrderByDescending(a => a.Qty).ThenBy(a => a.Number).Skip(skip).Take(take);
            var res = CreatePartsResponse(response, db.Parts.Count());

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
            var desc = str.Replace(".", "").Replace("-", "").Replace(",", "").Replace(" ", "");
            var count = db.Parts.Where(a => a.Description.IndexOf(desc) > -1).Count();
            var filtered = db.Parts.Where(a => a.Description.IndexOf(desc) > -1).OrderByDescending(a => a.Qty).ThenBy(a => a.Number).Skip(skip).Take(take);
            var response = CreatePartsResponse(filtered, count);

            return response;
        }
        

        public PartsResponse GetByNumber(string number, int skip, int take)
        {
            var num = number.Replace(".", "").Replace("-", "").Replace(",", "").Replace(" ", "").Replace("/","");
            var count = db.Parts.Where(a => a.Number.Replace("-", "").Replace(".", "").Replace(" ", "").Replace("/", "").IndexOf(num) > -1).Count();
            var filtered = db.Parts.Where(a => a.Number.Replace("-", "").Replace(".", "").Replace(" ", "").Replace("/", "").IndexOf(num) > -1).OrderByDescending(a => a.Qty).ThenBy(a=>a.Number).Skip(skip).Take(take);
            var response = CreatePartsResponse(filtered, count);

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
            List<PartIsAnalog> list = new List<PartIsAnalog>();
            
            var analogs = db.Analogs;
            var parts = leftTable.ToList();

            foreach (var i in parts)
            {
                list.Add(new PartIsAnalog()
                {
                    Part = i,
                    IsAnalog = analogs.Where(a => a.partId == i.id).FirstOrDefault() != null
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
    }
}