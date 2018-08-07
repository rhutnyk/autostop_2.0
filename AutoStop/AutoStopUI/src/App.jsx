import React from 'react';
import './App.css';
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
  };

  componentDidMount() {
    this.elementWithScroll = document.getElementById('mySidenav0');
    this.elementWithScroll.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    this.elementWithScroll.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    var a = this.elementWithScroll.scrollTop + 20;
    var b = this.elementWithScroll.scrollHeight - this.elementWithScroll.clientHeight;
    if (a >= b && !this.loading && this.state.data && !(this.state.data.length >= this.lengthData)) {
      this.loadData();
    }
  }

  loadData = () => {
    this.loading = true;
    this.skip += 20;
    this.dataSvc.take(this.skip)
      .then(res => {
        if (res) {
          const _data = this.state.data;
          _data.push(...res.value);
          this.setState({ data: _data })
          this.loading = false;
        }
      })

  }

  changeValue = e => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState((prevState) => {
      prevState[name] = value;
      return {}
    })
  };

  submit = e => {
    e.preventDefault();
    if (this.state.number || this.state.keyword) {
      this.dataSvc.query(this.state.number, this.state.keyword)
        .then(res => {
          if (res["odata.count"]) {
            this.lengthData = res["odata.count"];
          }
          this.setState({ data: res.value });

        });
    }
  }

  cancel = () => {
    this.setState({
      data: [],
      number: '',
      keyword: '',
    })
  }

  render() {

    return (
      <div className="App">
        <div className="euro-exchange">
          Euro exchange rate: 30.10 UAH
        </div>

        <form onSubmit={this.submit}>
          <label>
            Number:
            <input type="text" onChange={(e) => this.changeValue(e)} name="number" placeholder="number" value={this.state.number || ''}
            />
            Keyword:
            <input type="text" onChange={(e) => this.changeValue(e)} name="keyword" placeholder="name" value={this.state.keyword || ''} />
          </label>
          <div className="all-btns">
            <button className="btn-cancel" type="button" onClick={this.cancel}><i className="fa fa-ban" aria-hidden="true" /> Clear</button>
            <button className="btn-submit" type="submit">Search <i className="fa fa-search" aria-hidden="true" />  </button>
          </div>

          <br />
          <br />
        </form>

        <div id="res">
          {
            this.state.data.length > 0 ?
              <table className="table table-bordered">
                <thead>
                  <tr className="table-header">
                    <th>Number</th>
                    <th>Description</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.data.map((element, i) =>
                      <tr key={i}>
                        <td> {element.Number} </td>
                        <td> {element.Description} </td>
                        <td> {element.Price} </td>
                      </tr>
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

