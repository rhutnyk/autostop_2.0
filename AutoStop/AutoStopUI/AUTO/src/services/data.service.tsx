import 'whatwg-fetch';
import {polyfill} from 'es6-promise';
polyfill();


export default class MainServise {

    public query(url: string): Promise<any> {
          return fetch(url)
          .then((res: any) => res.json())
          .then(res => {return res})
          .catch(error => console.error('Error:', error));
      }
  } 