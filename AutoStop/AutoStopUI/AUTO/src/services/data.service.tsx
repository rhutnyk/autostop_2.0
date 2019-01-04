import 'whatwg-fetch';
import {polyfill} from 'es6-promise';
polyfill();


export default class MainServise {

    public query(url: string): Promise<any> {
          return fetch(url)
          .then((res: any) => res.json())
          .then(res => {return res});
      }
  

    private _url: string;
    private _URL:string;


    constructor(url:string){
        this._URL = url;
    }



    private GetData(url: string): Promise<any> {

        return fetch(url)
            .then((res: any) => res.json())
            .then(res => { return res })
            .catch(error => console.error('Error:', error));
    }


    public Query(filter?: string, skip?: number, take?: number ) {

        var isFirst = false;
        this._url = this._URL;

        if (filter != null || skip != null || take != null) {

            if (filter != null) {
                this._url += isFirst ? '&' + filter : '?' + filter;
                isFirst = true;
            }
            if (skip != null) {
                this._url += isFirst ? '&skip=' + skip : '?skip=' + skip;
                isFirst = true;
            }
            if (take != null) {
                this._url += isFirst ? '&take=' + take : '?take=' + take;
                isFirst = true;
            }

        }

      return  this.GetData(this._url);
    }




  } 