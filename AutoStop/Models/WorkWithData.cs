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
            var response = CreatePartsResponse(db.Parts, skip, take);

            return response;
        }

        
        public PartsResponse GetAnalog(int id, int skip, int take)
        {
            var res = from p in db.Parts
                      join a in db.Analogs on p.id equals a.analogId
                      where a.partId == id
                      select p;

            var result = CreatePartsResponse(res, skip, take);

            return result;
        }


        public PartsResponse GetByDescription(string str, int skip, int take)
        {
            var desc = str.Replace(".", "").Replace("-", "").Replace(",", "").Replace(" ", "");
            var filtered = db.Parts.Where(a => a.Description.IndexOf(desc) > -1);
            var response = CreatePartsResponse(filtered, skip, take);

            return response;
        }
        

        public PartsResponse GetByNumber(string number, int skip, int take)
        {
            var num = number.Replace(".", "").Replace("-", "").Replace(",", "").Replace(" ", "");
            var filtered = db.Parts.Where(a => a.Number.Replace("-", "").Replace(".", "").Replace(" ", "").IndexOf(num) > -1);
            var response = CreatePartsResponse(filtered, skip, take);

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
            var result = leftTable.GroupJoin(db.Analogs, lang => lang.id, pers => pers.partId,
               (lang, ps) => new PartIsAnalog { Part = lang, IsAnalog = ps.FirstOrDefault() == null ? false : true });

            return result;
        }


        //create parts with count and isAnalog
        private PartsResponse CreatePartsResponse(IQueryable<Part> parts, int skip, int take)
        {
            var count = parts.Count();
            var tRes = parts.OrderByDescending(a => a.Qty).ThenBy(a=>a.Number).Skip(skip).Take(take);
            var result = LeftJoinTable(tRes);

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