import * as React from 'react';
import Contact from './Contact';





export default class ContactFooter extends Contact {

    render() {
        return (
            <span>
                <div className="text-after-send" hidden={!this.state.isEmailSend}>Дякуємо! Ваш запит відправлено.</div>
                <div hidden={this.state.isEmailSend}>

                    <div className="row">
                        <div className="col-12 col-md-6">
                            <textarea className={this.state.textValid ? "" : "error"} id="writetous" itemType="text" placeholder="Напишіть нам" value={this.state.text} onChange={(e) => { this.onChangeValue(e, { item: "text" }) }}></textarea>
                            <small hidden={this.state.textValid} className="errorLabel">напишіть нам</small>
                        </div>

                        <div className="col-12 col-md-6">
                            <input className={this.state.nameValid ? "" : "error"} id="youname" type="text" placeholder="Ваше ім'я" value={this.state.name} onChange={(e) => { this.onChangeValue(e, { item: "name" }) }} /><br />
                            <small hidden={this.state.nameValid} className="errorLabel">введіть ваше ім'я</small>
                            <input className={this.state.emailValid ? "" : "error"} id="mail" type="email" placeholder="Ваш E-mail" value={this.state.email} onChange={(e) => { this.onChangeValue(e, { item: "email" }) }} /><br />
                            <small hidden={this.state.emailValid} className="errorLabel">введіть коректну пошту</small>
                            <input id="send" type="submit" value="відправити" onClick={this.onSend} />
                        </div>
                    </div>
                </div>

            </span>
        )
    }

}