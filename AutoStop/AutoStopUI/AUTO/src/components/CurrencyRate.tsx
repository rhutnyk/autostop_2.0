import * as React from 'react';
import dataService from '../services/data.service';
import URL_Service from '../services/url_service';



export default class CurrencyRate extends React.Component<any, any>{

    private mainService = new dataService();
    private url = URL_Service.currency_url;

    constructor(props: any) {
        super(props);
        this.state = {
            item: {},
        };
    }


    public componentDidMount() {
        this.mainService.query(this.url)
            .then((res: any) => {
                this.setState({ item: res });
            })
    }


    public render() {
        return (
            <span>
                {
                    !this.state.item ? null :
                        "1 EURO = " + this.state.item.rate + " ГРН."
                }
            </span>

        )

    }
}