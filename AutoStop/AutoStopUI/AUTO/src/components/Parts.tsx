import * as React from 'react';
import dataService from '../services/data.service';
import Analog from './Analog';
import DataS from '../services/generate_url.service';
import ReactDOM = require('react-dom');

interface Part {
    id: number;
    Number: string;
    Description: string;
    Qty: number;
    Qty1: number;
    Qty2: number;
    Price: number;
    Brand: string;
}



export default class Parts extends React.Component<any, any> {

    private mainService = new dataService();
    private partContainer: HTMLElement;
    private url = "http://autostop.bitsorchestra.com/api/parts?";
    private queryNumber = "number=";
    private queryDescription = "desc=";
    private skip = 0;
    private take = 0;
    private elementWithScroll: Window;


    constructor(props: Part) {
        super(props);

        this.state = {
            data: [],
            lastUrl: null,
            count: 0,
            click: false,
            collapseItemIddex: null,
            item: null,
            loading: false,
            partsLoading: false,
            scrollLoading: false,
            number: "",
            word: "",
        };
    }

    public componentDidMount() {

        // var datas = new DataS();

        this.partContainer = document.getElementById('res');
        this.elementWithScroll = window;
        window.addEventListener('scroll', this.handleScroll);
        this.getData(this.url);

    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }



    getData = (url: string) => {
        this.setState({ partsLoading: true });
        this.mainService.query(url)
            .then((res: any) => {
                this.setState({ data: res.Items, count: res.Count, lastUrl: url, partsLoading: false }, ()=>{this.skip = 0});
            })
    }


    showAnalogs = (item: any): void => {
        const isActive = this.state.collapseItemIddex == item.Part.id ? null : item.Part.id;
        this.setState({ collapseItemIddex: isActive, item: item, loading: true });
    }


    onHideAnalogs = () => {
        this.setState({ collapseItemIddex: null })
    }


    searchParts = () => {
        if (this.state.word != "") {
            this.getData(this.url + this.queryDescription + this.state.word);
        }
        else if (this.state.number != "") {
            this.getData(this.url + this.queryNumber + this.state.number);
        }
    }


    onChangeSearchValue = (e: any, property: { item: string, clear: string }): void => {
        if (e.key === 'Enter') {

            e.target.blur();
            this.searchParts();
            return;
        }
        e.persist();

        this.setState({ [property.item]: e.target.value, [property.clear]: "", collapseItemIddex: null }, () => {
            if (this.state.number == "" && this.state.word == "") {
                this.getData(this.url);
            }
        });
    }

    handleScroll = () => {
        if(!this.state.scrollLoading)
        {
        var windowPosition = window.scrollY;
        var loadPosition = this.partContainer.clientHeight;
        
        if (windowPosition >= loadPosition && this.state.data.length < this.state.count) {
            // loadPosition = (windowPosition+1000);
            this.lazyLoadData();
            }
        }
    }


    lazyLoadData = () => {
        this.setState({ scrollLoading: true });
        this.skip += 20;
        this.mainService.query(this.state.lastUrl + (this.state.word == "" && this.state.number == ""? "skip=" + this.skip: "&skip=" + this.skip))
            .then(res => {
                if (res) {
                    this.setState((prevState: any) => {
                        prevState.data.push(...res.Items);
                        return { data: prevState.data, scrollLoading: false }
                    })
                }
            })
    }


    isLoadingAnalog(res:boolean){
        this.setState({loading:res});
    }



    render() {

        return (
            <React.Fragment>

                <div className="search-container">
                    <div className="search-label">
                        <p>ПОШУК ТОВАРІВ</p>
                    </div>

                    <div className="container">
                        <div className="row justify-content-md-center">
                            <div className="col-12 col-sm-12 col-md-3">
                                <input className="search-input" value={this.state.number} onKeyPress={e => { if (e.key === 'Enter') { this.onChangeSearchValue(e, null) } }} type="text" placeholder="за номером" onChange={(e) => this.onChangeSearchValue(e, { 'item': "number", "clear": "word" })} />
                            </div>
                            <div className="col-12 col-sm-12 col-md-5">
                                <input className="search-input" value={this.state.word} onKeyPress={e => { if (e.key === 'Enter') { this.onChangeSearchValue(e, null) } }} type="text" placeholder="за ключовими словами" onChange={(e) => this.onChangeSearchValue(e, { 'item': "word", "clear": "number" })} />
                            </div>
                            <div className="search-btn-box col-12 col-sm-12 col-md-2">
                                <input className="search-btn" type="button" value="пошук" onClick={this.searchParts} />
                            </div>
                        </div>
                    </div>
                </div>


                <div className="parts-container-header">
                    <div className="container">
                        <div className="row justify-content-md-center">
                            <div className="col-2 col-sm-2">Номер</div>
                            <div className="col-3 col-sm-4">Опис</div>
                            <div className="col-1 col-sm-2">К-сть</div>
                            <div className="col-3 col-sm-2">Вартість</div>
                            <div className="col-2 col-sm-2">Аналоги</div>
                        </div>
                    </div>
                </div>
                <div id={this.state.partsLoading ? "loadParts" : ""}></div>
                <div className="parts-content" id="res">
                    <div className="container">
                        {
                            this.state.data && this.state.data.length > 0 ?

                                this.state.data.map((item: any, index: number) =>
                                    <span key={index}>
                                        <div className="row" id={item.IsAnalog ? "" : "color-grey"}>
                                            <div className="col-2 col-sm-2 number">{item.Part.Number}</div>
                                            <div className="col-3 col-sm-4">{item.Part.Description}</div>
                                            <div className="col-1 col-sm-2">{item.Part.Qty}</div>
                                            <div className="col-3 col-sm-2">{item.Part.Price} грн.</div>
                                            <div className="col-2 col-sm-2">
                                                {item.IsAnalog ? <a onClick={() => this.showAnalogs(item)}>
                                                    <img src={`${this.state.collapseItemIddex == item.Part.id ? './image/hide analog.png' : './image/add analog.png'}`} />
                                                </a> : null}
                                            </div>
                    </div>
                                            {this.state.collapseItemIddex == item.Part.id ?
                                            <span>
                                           <div id={this.state.loading ? "load-scroll" : ""}>

                                           </div>
                                            <Analog isLoadingAnalog={this.isLoadingAnalog.bind(this)} hideAnalogs={this.onHideAnalogs} analogId={this.state.collapseItemIddex} item={this.state.item} loading={this.state.loading}/>
                                              </span>
                                            : null}
                                           
                                        
                                        
                                    </span>
                                )
                                : null

                        }
                    </div>
                    <div id={this.state.scrollLoading ? "load-scroll" : ""}>

                    </div>

                </div>

            </React.Fragment>
        )

    }

}