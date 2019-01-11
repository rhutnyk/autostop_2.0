import * as React from 'react';
import { Promise } from 'es6-promise';
import dataService from '../services/data.service';
import ContactForm from '../services/contact_model';
import URL_Service from '../services/url_service';



export default class Contact extends React.Component<any, any>{


    constructor(props: any) {
        super(props);
        this.state = {
            name: "",
            email: "",
            text: "",
            emailValid: true,
            nameValid: true,
            textValid: true,
            isEmailSend: false
        };
    }


    validation = (): Promise<boolean> => {
        return new Promise(resolve => {
            this.setState({
                emailValid: this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i),
                nameValid: this.state.name != "",
                textValid: this.state.text != "",
            }, () => {
                resolve(this.state.emailValid && this.state.nameValid && this.state.textValid);
            });
        });
    }



    onSend = () => {
        this.validation()
            .then((result) => {
                if (result) {
                    this.sendData();
                }
            })
    }


    onChangeValue = (e: any, property: { item: string }) => {
        e.persist();
        this.setState({ [property.item]: e.target.value, emailValid: true, nameValid: true, textValid: true })
    }


    sendData = () => {
        var contact = new ContactForm();
        contact.Name = this.state.name;
        contact.Email = this.state.email;
        contact.Message = this.state.text;

        new dataService().post_query(URL_Service.contact_url, contact)
        .then(res=>{
            if(res.ok){
                this.setState({ isEmailSend: true })
            }
            else console.error(res);
        })
        .catch(err=>{
            console.error(err);
        })
    }



    // render() {

    //     return (
    //         <span>
    //             <div className="text-after-send" hidden={!this.state.isEmailSend}>Дякуємо! Ваш запит відправлено.</div>
    //             <div hidden={this.state.isEmailSend}>

    //                 <div className="row">
    //                     <div className="col"></div>

    //                     <div className="col-4">
    //                         <input className={this.state.nameValid ? "" : "error"} id="youname" type="text" placeholder="Ваше ім'я" value={this.state.name} onChange={(e) => { this.onChangeValue(e, { item: "name" }) }} /><br />
    //                         <small hidden={this.state.nameValid} className="errorLabel">введіть ваше ім'я</small>
    //                     </div>

    //                     <div className="col-4"><input className={this.state.emailValid ? "" : "error"} id="mail" type="email" placeholder="Ваш E-mail" value={this.state.email} onChange={(e) => { this.onChangeValue(e, { item: "email" }) }} /><br />
    //                         <small hidden={this.state.emailValid} className="errorLabel">введіть коректну пошту</small>
    //                     </div>
    //                     <div className="col"></div>
    //                 </div>

    //                 <div className="row">
    //                     <div className="col"></div>
    //                     <div className="col-8">
    //                         <textarea className={this.state.textValid ? "" : "error"} id="writetous" itemType="text" placeholder="Напишіть нам" value={this.state.text} onChange={(e) => { this.onChangeValue(e, { item: "text" }) }}></textarea>
    //                         <small hidden={this.state.textValid} className="errorLabel">напишіть нам</small>
    //                         <input id="send-mob" type="submit" value="відправити" onClick={this.onSend} />
    //                     </div>
    //                     <div className="col"></div>
    //                 </div>
    //             </div>
    //         </span>
    //     )
    // }

}