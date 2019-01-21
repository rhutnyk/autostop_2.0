import * as React from 'react';
import dataService from '../services/data.service';
import URL_Service from '../services/url_service';
import PartModel from '../services/part_model';


class IProps {
    hideAnalogs: () => void;
    isLoadingAnalog: (res: boolean) => void;
    analogId: number;
    loading: boolean
}


export default class Analog extends React.Component<IProps, any> {

    private mainService = new dataService();
    private url = URL_Service.analog_url;


    constructor(props: any) {
        super(props);
        this.state = {
            data: PartModel,
            id: null,
            loading: false
        };
    }


    componentDidMount() {
        this.setState({ id: this.props.analogId, loading: true }, () => this.getData())
    }


    getData = () => {

        if (this.state.id >= 0) {
            this.mainService.query(this.url + this.props.analogId)
                .then((res: any) => {
                    this.setState({ data: res.Items }, () => { this.props.isLoadingAnalog(false); });
                })
        }
    }


    public render() {

        return (
            this.state.data.length > 0 ?
                <span>
                    <div className="container analog" >

                        {this.state.data.length > 0 ?
                            this.state.data.map((item: any, index: number) =>

                                <div className="row" id="analog" key={index}>
                                    <div className="col-12 col-sm-2 number"><label className="d-sm-none">№</label>{item.Part.Number}</div>
                                    <div className="col-12 col-sm-4"><label className="d-sm-none">Опис: </label>{item.Part.Description}</div>
                                    <div className="col-12 col-sm-2"><label className="d-sm-none">К-сть: </label>{item.Part.Qty}</div>
                                    <div className="col-12 col-sm-2"><label className="d-sm-none">Ціна: </label>{item.Part.Price} &euro;</div>
                                </div>

                            ) : null}
                    </div>
                    {/* <div className="container">
                    <hr className="line-analog"></hr>
                    </div> */}
                </span>
                : null
        )

    }

}
