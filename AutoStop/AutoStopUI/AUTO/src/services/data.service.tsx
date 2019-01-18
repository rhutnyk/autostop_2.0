import 'whatwg-fetch';
import {polyfill} from 'es6-promise';
polyfill();
import ContactForm from './contact_model';


export default class MainServise {

    public query(url: string): Promise<any> {
        console.log("Fetch "+url);
          return fetch(url)
          .then((res: any) => res.json())
          .then(res => {return res})
          .catch(error => console.error('Error:', error));
      }

    public post_query(url:string, data:ContactForm):Promise<any>{
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(res => {
            return res;
        })
        .catch(error => {return error});
        
    }

  } 