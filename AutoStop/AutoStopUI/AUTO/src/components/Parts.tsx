import * as React from 'react';
import dataService from '../services/data.service';
import Analog from './Analog';
import URL_Service from '../services/url_service';
import { Part, PartModel, PartCart } from '../services/part_model';

interface IState {
    data: Part[];
    lastUrl: string,
    count: number,
    collapseItemIddex: string,
    loading: boolean,
    partsLoading: boolean,
    scrollLoading: boolean,
    cardList: PartCart[],
    number: string,
    word: string,
    curentlyRate: number;
    showOrderForm: boolean;
    order: ShopingCart;
}

export class ShopingCart {
    id: number;
    Parts: PartCart[];
    NameCustomer: string;
    EmailCustomer: string;
    TotalSum: number;
    DeliveryType: string;
    PaymentType: string;

}



export default class Parts extends React.Component<any, IState> {

    private mainService = new dataService();
    private partContainer: HTMLElement;
    private url = URL_Service.part_url;
    private shopingCartUrl = URL_Service.shopingCart_url;
    private queryNumber = "number=";
    private queryDescription = "desc=";
    private skip = 0;

    constructor(props: any) {
        super(props);

        this.state = {
            data: [],
            lastUrl: null,
            count: 0,
            collapseItemIddex: null,
            loading: false,
            partsLoading: false,
            scrollLoading: false,
            showOrderForm: false,
            cardList: [],
            number: "",
            word: "",
            curentlyRate: 0,
            order: new ShopingCart()
        } as IState;
    }

    public componentDidMount() {
        this.partContainer = document.getElementById('res');
        window.addEventListener('scroll', this.handleScroll);
        this.getData(this.url);

        this.mainService.query(URL_Service.currency_url)
            .then((res: any) => {
                this.setState({ curentlyRate: +res.rate });
            })
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    getData = (url: string) => {
        this.setState({ partsLoading: true });
        this.mainService.query(url)
            .then((res: PartModel) => {
                this.setState({ data: res.Items, count: res.Count, lastUrl: url, partsLoading: false }, () => { this.skip = 0; });
            })
    }

    showAnalogs = (id: string): void => {
        const isActive = +this.state.collapseItemIddex == +id ? null : id;
        this.setState({
            collapseItemIddex: isActive,
            loading: isActive != null ? true : false
        }, () => {
            window.scrollTo(0, (document.getElementById(id).offsetTop - 70));
        });
    }

    addToCard = (item: PartCart): void => {
        const _item: PartCart = {
            id: item.id,
            Number: item.Number,
            Description: item.Description,
            Qty: item.Qty,
            Price: item.Price,
            Brand: item.Brand,
            QtyOrder: item.QtyOrder,
        }

        _item.QtyOrder = 1;
        this.setState({ cardList: [...this.state.cardList, _item] }, () => {
            console.log(this.state.cardList);
        })
    }

    removeFromCard = (id: number): void => {
        const _cardList = [...this.state.cardList];
        var index = this.state.cardList.findIndex((x: PartCart) => +x.id == id);
        if (index !== -1) {
            _cardList.splice(index, 1);
            this.setState({ cardList: _cardList });
        }
    }


    searchParts = (): void => {
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
        let _number = Object.assign({}, this.state.number);
        let _word = Object.assign({}, this.state.word);
        if (property.item == 'number') {
            _number = e.target.value;
            _word = "";
        } else {
            _number = "";
            _word = e.target.value;
        }
        this.setState({
            number: _number,
            word: _word,
            collapseItemIddex: null
        }, () => {
            if (this.state.number == "" && this.state.word == "") {
                this.getData(this.url);
            }
        });
    }

    handleScroll = () => {
        if (!this.state.scrollLoading && !this.state.loading) {
            var windowPosition = window.pageYOffset;
            var loadPosition = this.partContainer.clientHeight;
            if (windowPosition >= loadPosition && this.state.data.length < this.state.count) {
                this.lazyLoadData();
            }
        }
    }

    lazyLoadData = () => {
        this.setState({ scrollLoading: true });
        this.skip += 20;
        this.mainService.query(this.state.lastUrl + (this.state.word == "" && this.state.number == "" ? "skip=" + this.skip : "&skip=" + this.skip))
            .then(res => {
                if (res) {
                    this.setState((prevState: any) => {
                        prevState.data.push(...res.Items);
                        return { data: prevState.data, scrollLoading: false }
                    })
                }
            })
    }

    isLoadingAnalog(res: boolean) {
        this.setState({ loading: res });
    }

    isAddedToCard = (item: Part): boolean => {
        if (item.Qty < 1) {
            return true;
        } else {
            const index = this.state.cardList.findIndex((x: PartCart) => +x.id == +item.id);
            if (index !== -1) {
                return true
            } else {
                return false;
            }
        }
    }

    getCartTotal = (): number => {
        let sum = 0;
        this.state.cardList.map((item: PartCart) => {
            sum += item.Price * item.QtyOrder;
        })
        return sum > 0 ? +sum.toFixed(2) : sum;
    }

    changeCountProduct = (index: number, isPlus: boolean) => {
        this.setState((prevState: IState) => {
            if (isPlus) {
                prevState.cardList[index].QtyOrder += 1;
            } else {
                prevState.cardList[index].QtyOrder -= 1;
            }
            return { cardList: prevState.cardList }
        })
    }

    sendOrderForm = (e: any) => {
        e.preventDefault();
        const newOrder: ShopingCart = this.state.order;
        newOrder.Parts = this.state.cardList;
        newOrder.TotalSum = +this.getCartTotal().toFixed(2);

        new dataService().postForm(this.shopingCartUrl, newOrder)
            .then((res) => {
                this.setState({ showOrderForm: false })
            })
            .catch((err) => console.log(err))


    }

    changeOrderForm = (e: any, property: string) => {
        const _order: any = Object.assign({}, this.state.order);
        _order[property] = e.target.value;
        this.setState({ order: _order });
    }

    render() {

        return (
            <React.Fragment>

                <div className="search-container">
                    <div className="search-label">
                        <p>ПОШУК ТОВАРІВ</p>
                    </div>
                    {/* cart______________________ */}

                    <div id="card-buttons" className="card-buttons" onClick={() => this.setState({ showOrderForm: false })}>
                        <div className="btn-group" title="Корзина" data-toggle="modal" data-target="#modal-cart" >
                            <button className="btn btn-primary btnCard">
                                <i className="fa fa-shopping-cart" aria-hidden="true"> </i>
                                {this.state.cardList.length > 0 ?
                                    <div className="card-count">{this.state.cardList.length}</div>
                                    : null
                                }
                            </button>
                        </div>
                    </div>
                    {
                        this.state.showOrderForm ?

                            <div className="modal fade bd-example-modal-lg" id="modal-cart-order" tabIndex={-1} role="dialog" aria-hidden="true">
                                <div className="modal-dialog modal-lg" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" >Форма</h5>
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <form onSubmit={(e) => this.sendOrderForm(e)}>
                                            <div className="modal-body">

                                                <div className="form-group">
                                                    <label>Ім'я</label>
                                                    <input required className="form-control" value={this.state.order.NameCustomer || ''} onChange={(e) => this.changeOrderForm(e, 'NameCustomer')} type="text" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Email</label>
                                                    <input required className="form-control" value={this.state.order.EmailCustomer || ''} onChange={(e) => this.changeOrderForm(e, 'EmailCustomer')} type="email" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Спосіб оплати</label>
                                                    <select className="form-control" value={this.state.order.PaymentType || ''} onChange={(e) => this.changeOrderForm(e, 'PaymentType')}>
                                                        <option value="">select...</option>
                                                        <option value="Готівка">Готівка</option>
                                                        <option value="Карта">Карта</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Спосіб доставки</label>
                                                    <select className="form-control" value={this.state.order.DeliveryType || ''} onChange={(e) => this.changeOrderForm(e, 'DeliveryType')}>
                                                        <option value="">select...</option>
                                                        <option value="Нова Пошта">Нова Пошта</option>
                                                        <option value="Самовивіз">Самовивіз</option>
                                                    </select>
                                                </div>

                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => this.setState({ showOrderForm: false })}>Скасувати</button>
                                                <button disabled={!this.state.order.DeliveryType || !this.state.order.PaymentType} type="submit" className={`btn btn-primary`}>Замовити</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            :

                            <div className="modal fade bd-example-modal-lg" id="modal-cart" tabIndex={-1} role="dialog" aria-hidden="true">
                                <div className="modal-dialog modal-lg" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" >Корзина</h5>
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th className="show-only-tablet">#</th>
                                                        <th >Назва</th>
                                                        <th >Ціна</th>
                                                        <th >Кількість</th>
                                                        <th ></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.cardList.map((item: PartCart, index: number) =>
                                                        <tr key={index}>
                                                            <th className="show-only-tablet">{index + 1}</th>
                                                            <td>{item.Description}</td>
                                                            <td>{item.Price} &euro;</td>
                                                            <td >
                                                                <div className="quantity">
                                                                    <button disabled={item.QtyOrder < 1} className="plus-btn" type="button" name="button" onClick={() => this.changeCountProduct(index, false)}>
                                                                        <i className="fa fa-minus" aria-hidden="true" />
                                                                    </button>
                                                                    <div className="cart-count-item">
                                                                        {item.QtyOrder || 0}
                                                                    </div>
                                                                    <button className="minus-btn" type="button" name="button" onClick={() => this.changeCountProduct(index, true)}>
                                                                        <i className="fa fa-plus" aria-hidden="true" />
                                                                    </button>
                                                                </div>

                                                            </td>
                                                            <td className="btn-delete">
                                                                <i className="fa fa-trash" aria-hidden="true" title="Видалити" onClick={() => this.removeFromCard(+item.id)}></i>
                                                            </td>
                                                        </tr>
                                                    )}

                                                </tbody>
                                            </table>
                                            <div className="total-card">
                                                <div>
                                                    <span>Cума :</span>  {this.getCartTotal().toFixed(2)}  &euro;
                                        </div>
                                                <div className="total-grn">{(this.getCartTotal() * this.state.curentlyRate).toFixed(2)} &#8372;</div>
                                            </div>

                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => this.setState({ showOrderForm: false })}>Закрити</button>
                                            <button disabled={this.state.cardList.length < 1 || this.getCartTotal() == 0} type="button" className={`btn btn-primary`} onClick={() => this.setState({ showOrderForm: true })} data-toggle="modal" data-target="#modal-cart-order">Замовити</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    }
                    {/* ______________________cart */}

                    <div className="container">
                        <div className="row justify-content-md-center">
                            <div className="col-12 col-sm-12 col-md-3">
                                <input className="search-input" value={this.state.number} onKeyPress={e => { if (e.key === 'Enter') { this.onChangeSearchValue(e, null) } }} type="text" placeholder="за номером" onChange={(e) => this.onChangeSearchValue(e, { 'item': "number", "clear": "word" })} />
                            </div>
                            <div className="word_or col-12 col-sm-12 col-md-1"><span>або</span></div>
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
                            <div className="d-none d-sm-block col-sm-2">Номер</div>
                            <div className="d-none d-sm-block col-sm-4">Опис</div>
                            <div className="d-none d-sm-block col-sm-2">К-сть</div>
                            <div className="d-none d-sm-block col-sm-2">Вартість</div>
                            <div className="d-none d-sm-block col-sm-2">Аналоги</div>
                        </div>
                    </div>
                </div>

                <div id={this.state.partsLoading ? "loadParts" : ""}></div>
                <div className="parts-content" id="res">

                    {
                        this.state.data && this.state.data.length > 0 ?

                            this.state.data.map((item: any, index: number) =>
                                <span key={index}>
                                    <div className="container">

                                        <div id={item.id}>
                                            <div className={"row justify-content-md-center " + (item.id == this.state.collapseItemIddex ? "border-0" : "")} id={item.hasAnalog ? "" : "color-grey"}>
                                                <div className="col-12 col-sm-2 number"><label className="d-sm-none part-label-mobile">№</label>{item.Number}</div>
                                                <div className="col-12 col-sm-4"><label className="d-sm-none part-label-mobile">Опис:</label>{item.Description}</div>
                                                <div className="col-12 col-sm-2"><label className="d-sm-none part-label-mobile">К-сть:</label>{item.Qty > 5 ? '>5 ' : item.Qty}</div>
                                                <div className="col-12 col-sm-2"><label className="d-sm-none part-label-mobile">Ціна:</label>{item.Price.toFixed(2)} &euro;</div>
                                                <div className="col-12 col-sm-2 action-icons">
                                                    {item.hasAnalog ?
                                                        <i onClick={() => this.showAnalogs(item.id)} className={`fa ${this.state.collapseItemIddex == item.id ? 'fa-chevron-up' : 'fa-chevron-down'}`} aria-hidden="true" title={`${this.state.collapseItemIddex == item.id ? 'Приховати' : 'Показати'} аналоги`}></i>
                                                        : null}
                                                    <i onClick={() => this.addToCard(item)} className={`fa fa-cart-plus ${this.isAddedToCard(item) ? 'disable' : ''}`} title="Додати до кошика"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {this.state.collapseItemIddex == item.id ?
                                        <span>
                                            <div id={this.state.loading ? "load-scroll" : ""}></div>
                                            <Analog isLoadingAnalog={this.isLoadingAnalog.bind(this)} analogId={+this.state.collapseItemIddex} loading={this.state.loading} />
                                        </span>
                                        : null}

                                </span>)
                            : null
                    }
                    <div id={this.state.scrollLoading ? "load-scroll" : ""}></div>
                </div>
            </React.Fragment>
        )

    }

}