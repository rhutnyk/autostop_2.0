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
                nameValid: this.state.name.trim() != "",
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
        contact.Name = this.state.name.trim();
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

}