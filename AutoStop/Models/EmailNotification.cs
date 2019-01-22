using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Web;

namespace AutoStop.Models
{

    public class EmailNotification
    {
        public string _name_user { get; set; }
        public string _email_user { get; set; }
        public string _to { get; set; }
        public string _subject { get; set; }
        public string _body { get; set; }


        public void SendEmail()
        {
            if (_name_user != String.Empty && _email_user != String.Empty && _body != String.Empty && _to != String.Empty)
            {
                try
                {

                    MailMessage mail = new MailMessage();
                    mail.To.Add(_to);
                    mail.From = new MailAddress("valentyn@gmail.com");
                    mail.Subject = _subject;
                    mail.Body = "<h3>Повідомлення надіслано сайтом <a href='http://autostop.bitsorchestra.com'>&laquo;autostop.bitsorchestra.com&raquo;</a></h3>" +
                                "</hr>" +
                                "<p>Імя: " + _name_user + "</p>" +
                                "<p>Ел.пошта: " + _email_user + "</p>" +
                                "<p>Повідомлення: <i>" + _body + "</i></p>";

                    mail.IsBodyHtml = true;

                    SmtpClient smpt = new SmtpClient();
                    smpt.Host = "smtp.gmail.com";
                    smpt.Credentials = new System.Net.NetworkCredential("valentynv22@gmail.com", "Tremolo2211");
                    smpt.Port = 587;
                    smpt.EnableSsl = true;


                    smpt.Send(mail);
                }
                catch (Exception ex)
                {
                    Log log = new Log()
                    {
                        LogDate = DateTime.Now,
                        Message = ex.Message,
                        FileName = "Email notification"
                    };
                    new WorkWithData().AddLog(log);
                }
            }
        }



    }
}