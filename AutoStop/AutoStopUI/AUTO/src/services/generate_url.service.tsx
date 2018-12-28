import { number, string, any } from "prop-types";






export default class DataS {


    private _url: string;
    private _filter: string;
    private _take: string;
    private _skip: string;


    private _URL = 'http://www.dood.com';




    public query(url: string): Promise<any> {
        return fetch(url)
            .then((res: any) => res.json())
            .then(res => { return res });
    }


    GenerateUrl(setting: { filter?: string, skip?: number, take?: number }) {
        var first = false;

        if (setting.filter != null || setting.skip != null || setting.take != null) {

            this._url = this._URL;

            if (setting.filter != null) {
                this._url += first ? '&' + setting.filter : '?' + setting.filter;
                first = true;
            }
            if (setting.skip != null) {
                this._url += first ? '&skip=' + setting.skip : '?skip=' + setting.skip;
                first = true;
            }
            if (setting.take != null) {
                this._url += first ? '&take=' + setting.take : '?take=' + setting.take;
                first = true;
            }

        }
    }
}