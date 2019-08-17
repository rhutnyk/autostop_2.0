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
            var count = db.Parts.Count();
            var response = db.Parts.OrderByDescending(a => a.Qty).ThenBy(a => a.Number).Skip(skip).Take(take);

            var resWithAnalog = hasAnalog(response.ToList());
            
            return new PartsResponse { Count = count, Items = resWithAnalog };
        }

        
        public PartsResponse GetAnalog(int id, int skip, int take)
        {
            var res = from p in db.Parts
                       join a in db.Analogs on p.id equals a.analogId
                       where a.partId == id
                       orderby p.Qty descending
                       select p;

            return new PartsResponse { Count = res.Count(), Items = res.Skip(skip).Take(take) };
        }


        public PartsResponse GetByDescription(string str, int skip, int take)
        {
            var desc = str.Replace(".", "").Replace("-", "").Replace(",", "").Replace(" ", "").ToLower();
            var filtered = db.Parts.Where(a => a.Description.IndexOf(desc) > -1).OrderByDescending(a => a.Qty).ThenBy(a => a.Number);
            var skipData = filtered.Skip(skip).Take(take);


            return new PartsResponse { Count = filtered.Count(), Items = hasAnalog(skipData.ToList()) };
        }
        

        public PartsResponse GetByNumber(string number, int skip, int take)
        {
            var num = (number.Replace(".", "").Replace("-", "").Replace(",", "").Replace(" ", "").Replace("/","")).ToLower();
            var filtered = db.Parts.Where(a => a.NumberSearch.Contains(num)).OrderByDescending(a => a.Qty).ThenBy(a => a.NumberSearch);
            var skipData = filtered.Skip(skip).Take(take);
            var response = new PartsResponse { Count = filtered.Count(), Items = hasAnalog(skipData.ToList()) };

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



        public void AddContactMessage (ContactUs contact)
        {
            if (contact != null)
            {
                EmailNotification email = new EmailNotification();
                email._name_user = contact.Name;
                email._email_user = contact.Email;
                email._body = contact.Message;
                email._subject = "Автостоп";
                
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


        private IEnumerable<Part> hasAnalog (IEnumerable<Part> list)
        {
            var analogs = db.Analogs;

            foreach (var i in list)
            {
                i.hasAnalog = analogs.Where(a=>a.partId == i.id).FirstOrDefault() != null;
            }

            return list;
        }

    }
}