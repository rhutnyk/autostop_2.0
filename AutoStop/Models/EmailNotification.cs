using System;
using System.Net.Mail;


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
                    //mail.To.Add("petro.dutko@gmail.com");
                    mail.To.Add("ihor.moskvita@bitsorchestra.com");
                    mail.From = new MailAddress("contact-us@autostop.lviv.ua");
                    mail.Subject = _subject;
                    mail.Body = "<h3>Повідомлення надіслано сайтом <a href='http://autostop.lviv.ua'>&laquo;autostop.lviv.ua&raquo;</a></h3>" +
                                "</hr>" +
                                "<p>Імя: " + _name_user + "</p>" +
                                "<p>Ел.пошта: " + _email_user + "</p>" +
                                "<p>Повідомлення: <i>" + _body + "</i></p>";

                    mail.IsBodyHtml = true;

                    SmtpClient smpt = new SmtpClient();
                    smpt.Host = "webmail.autostop.lviv.ua";
                    smpt.Credentials = new System.Net.NetworkCredential("contact-us@autostop.lviv.ua", "s3jMq01?");
                    smpt.Port = 25;
                    smpt.EnableSsl = false;


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


        public void SendEmailShoppingCard()
        {
            if (_name_user != String.Empty && _email_user != String.Empty && _body != String.Empty && _to != String.Empty)
            {
                try
                {

                    MailMessage mail = new MailMessage();
                    //mail.To.Add(_to);
                    mail.To.Add("vitaliy.moskvita@bitsorchestra.com");
                    mail.From = new MailAddress("shopping@autostop.lviv.ua");
                    mail.Subject = _subject;
                    mail.Body = "<h3>Замовлення</h3>" +
                                "</hr>" +
                                "<p>Імя: <b>" + _name_user + "</b></p>" +
                                "<p>Ел.пошта: " + _email_user + "</p>" +
                                "<p><i>" + _body + "</i></p>";

                    mail.IsBodyHtml = true;

                    SmtpClient smpt = new SmtpClient();
                    smpt.Host = "mail.autostop.lviv.ua";
                    smpt.Credentials = new System.Net.NetworkCredential("shopping@autostop.lviv.ua", "0Q6sxl8*");
                    smpt.Port = 25;
                    smpt.EnableSsl = false;


                    smpt.Send(mail);
                }
                catch (Exception ex)
                {
                    Log log = new Log()
                    {
                        LogDate = DateTime.Now,
                        Message = ex.Message,
                        FileName = "Email notification shopping"
                    };
                    new WorkWithData().AddLog(log);
                }
            }
        }



    }
}