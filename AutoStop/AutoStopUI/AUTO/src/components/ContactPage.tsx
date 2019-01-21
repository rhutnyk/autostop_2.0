import * as React from 'react';
import Contact from './Contact';



export default class ContactPage extends Contact {


    private textInput:HTMLTextAreaElement;

    public componentDidMount() {
        this.textInput.focus();
        window.scrollTo(0, (this.textInput.offsetTop+290))
    }

    public focusItem(){
        this.textInput.focus();
        window.scrollTo(0, (this.textInput.offsetTop+290))
    }

    render() {

        return (
            <span>
                <div className="text-after-send" hidden={!this.state.isEmailSend}>Дякуємо! Ваш запит відправлено.</div>
                <div hidden={this.state.isEmailSend}>
                    <button onClick={()=>{this.focusItem()}}>Ghfff</button>
                    <div className="row justify-content-center">
                        <div className="col-11 col-md-4 col-lg-3">
                            <input className={this.state.nameValid ? "" : "error"} id="youname" type="text" placeholder="Ваше ім'я" value={this.state.name} onChange={(e) => { this.onChangeValue(e, { item: "name" }) }} /><br />
                            <small hidden={this.state.nameValid} className="errorLabel">введіть ваше ім'я</small>
                        </div>

                        <div className="col-11 col-md-4 col-lg-3">
                            <input className={this.state.emailValid ? "" : "error"} id="mail" type="email" placeholder="Ваш E-mail" value={this.state.email} onChange={(e) => { this.onChangeValue(e, { item: "email" }) }} /><br />
                            <small hidden={this.state.emailValid} className="errorLabel">введіть коректну пошту</small>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-11 col-md-8 col-lg-6 text-center">
                            <textarea ref={a=>{this.textInput = a}} className={this.state.textValid ? "" : "error"} id="writetous" itemType="text" placeholder="Напишіть нам" value={this.state.text} onChange={(e) => { this.onChangeValue(e, { item: "text" }) }}></textarea>
                            <small hidden={this.state.textValid} className="errorLabel">напишіть нам</small>
                            <input id="send-mob" type="submit" value="відправити" onClick={this.onSend} />
                        </div>
                    </div>
                </div>
            </span>
        )
    }

}