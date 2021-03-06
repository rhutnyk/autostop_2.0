import React from 'react';
import './App.css';
import Loading from './components/Loading/Loading';
import DataService from './services/DataService';

export default class App extends React.Component {

  dataSvc = new DataService(`http://autostop.bitsorchestra.com/api/parts?$inlinecount=allpages`)
  elementWithScroll = null;
  loading = false;
  lengthData = null;
  skip = 0;

  state = {
    data: [],
    number: '',
    keyword: '',
    showLoading: false,
    analogs: [],
    positionAnalog: null,
  };

  componentDidMount() {
    this.elementWithScroll = document.getElementById('res');
    console.log(this.elementWithScroll)
    this.elementWithScroll.addEventListener('scroll', this.handleScroll);//
    this.submit()
  }

  componentWillUnmount() {
    this.elementWithScroll.removeEventListener('scroll', this.handleScroll);//
  }

  handleScroll = () => {
    var a = this.elementWithScroll.scrollTop;
    var b = this.elementWithScroll.scrollHeight - this.elementWithScroll.clientHeight;//
    if (a >= b && !this.loading && this.state.data && !(this.state.data.Items.length >= this.lengthData)) {
      this.loadData();
    }
  }


  loadData = () => {
    this.setState({ showLoading: true })
    this.loading = true;
    this.skip += 20;
    this.dataSvc.take(this.skip)
      .then(res => {
        if (res) {
          this.setState((prevState) => {
            prevState.data.Items.push(...res.Items);
            return { data: prevState.data }
          }, () => this.setState({ showLoading: false }))
          this.loading = false;
        }
      })
      .catch(() => this.setState({ showLoading: false }))

  }

  changeValue = e => {//
    const name = e.target.name;
    const value = e.target.value;

    this.setState((prevState) => {
      prevState[name] = value;
      return {}
    })
  };

  submit = e => {
    //this.skip = 0;
    if (e) {
      e.preventDefault();
    }
    this.setState({ showLoading: true })
    this.dataSvc.filter(this.state.number, this.state.keyword)
      .then(res => {//
        this.lengthData = res.Count;
        this.setState({ data: res, showLoading: false, analogs: [], positionAnalog: null  });
      })
      .catch(() => this.setState({ showLoading: false }))//
  }

  showAnalog = (element, i, close) => {
    if (close) {
      this.setState({ analogs: [], positionAnalog: null })
    } else {
      this.dataSvc.select(element.Part.id)
        .then(res => {
          this.setState({ analogs: res, positionAnalog: i })
        })
    }

  }

  // clear = () => {


  //   //this.skip = 0;

  //   this.setState({
  //     // analogs: [],
  //     // positionAnalog: null,
  //     number: '',
  //     keyword: '',
  //   })
  // }

  render() {
    console.log(this.state.data);

    return (
      <div className="App">
        <Loading show={this.state.showLoading} />

        <div className="euro-exchange">
          1 Euro = 30.10 грн.
        </div>

        <form onSubmit={this.submit}>
          <input  type="text" onChange={(e) => this.changeValue(e)} name="number" placeholder="Номер" value={this.state.number || ''}/><a className="closeBtnNumber">&times;</a>
          <input type="text" onChange={(e) => this.changeValue(e)} name="keyword" placeholder="Ключове слово" value={this.state.keyword || ''} /><a className="closeBtnKeyword">&times;</a>
          <div className="all-btns">
            {/* <button className="btn-cancel" type="button" onClick={this.clear}><i className="fa fa-ban" aria-hidden="true" /> Clear</button> */}
            <button className="btn-submit" type="submit">Search <i className="fa fa-search" aria-hidden="true" />  </button>
          </div>

        </form>

        <div id="res">
          {
            this.state.data.Items && this.state.data.Items.length > 0 ?
              <table className="table table-bordered">
                <thead>
                  <tr className="table-header">
                    <th>Номер</th>
                    <th>Опис</th>
                    <th>К-сть</th>
                    <th>Вартість</th>
                    <th>Аналоги</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.data.Items.map((curItem, i) =>
                      <React.Fragment key={i}>

                        <tr className={this.state.positionAnalog === i ? 'analogs red' : ''}>
                          <td> {curItem.Part.Number} </td>
                          <td> {curItem.Part.Description} </td>
                          <td> {curItem.Part.Qty} </td>
                          <td> {curItem.Part.Price} </td>
                          <td className={`analog-icon ${curItem.IsAnalog ? '' : 'disable'}`} onClick={() => this.showAnalog(curItem, i, this.state.positionAnalog === i)}>
                            {/* <i className="fa fa-clone" aria-hidden="true" title="Аналоги" /> */}
                            <i
                              className={`fa fa-chevron-${this.state.positionAnalog === i ? 'up' : 'down'}`}
                          
                              aria-hidden="true"
                              title="Аналоги"
                            />
                          </td>
                        </tr>

                        {
                          this.state.analogs && this.state.analogs.Items && this.state.positionAnalog === i ?
                            <React.Fragment>
                              <tr>
                                <td className="analogs-header" colSpan="5">Аналоги</td>
                              </tr>

                              {this.state.analogs.Items.map((analog, i) =>
                                <tr key={i} className="analogs">
                                  <td> {analog.Part.Number} </td>
                                  <td> {analog.Part.Description} </td>
                                  <td> {analog.Part.Qty} </td>
                                  <td> {analog.Part.Price} </td>
                                  <td className="analog-icon"> {} </td>
                                </tr>
                              )}
                            </React.Fragment>
                            :
                            null
                        }



                      </React.Fragment>
                    )
                  }

                </tbody>
              </table>
              : null
          }

        </div>

      </div>

    )
  };

}

