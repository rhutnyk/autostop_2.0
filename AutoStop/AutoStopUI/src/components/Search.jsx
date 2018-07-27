import React , { Component } from 'react';


class Search extends Component {
        state = {
            number: '',
            keyword: '',
            url: 'http://autostop.bitsorchestra.com/api/parts?'
        }
    changeValue = (name, event) => {
        if (name === 'number') {
            this.setState({
                 number: event.target.value,
                })
        } else { 
            this.setState({
                keyword: event.target.value,
            })
        }
    }
    submit = (e) => {
        let subStr = '';
        if (this.state.number) {
            subStr = `number=${this.state.number}`
        } else {
            subStr = `desc=${this.state.keyword}`
        }
        
        let ress = `${this.state.url}${subStr}`;
            fetch(ress)
            .then((res) =>  res.json())
            .then((data) => {
                let output = '';
                    output += `
                    <table style="width:100%">
                    <tr>
                       <th><h3>Number</h3></th> 
                       <th><h3>Description</h3></th>
                       <th><h3>Price</th>
                    </tr>
                    <tr>
                       <th>${data.value[0].Number}</th> 
                       <th>${data.value[0].Description}</th>
                       <th>${data.value[0].Price}</th>
                    </tr>
                    <tr>
                       <th>${data.value[1].Number}</th> 
                       <th>${data.value[1].Description}</th>
                       <th>${data.value[1].Price}</th>
                    </tr>
                    <tr>
                       <th>${data.value[2].Number}</th> 
                       <th>${data.value[2].Description}</th>
                       <th>${data.value[2].Price}</th>
                    </tr>
                    <tr>
                       <th>${data.value[3].Number}</th> 
                       <th>${data.value[3].Description}</th>
                       <th>${data.value[3].Price}</th>
                    </tr>
                    <tr>
                       <th>${data.value[4].Number}</th> 
                       <th>${data.value[4].Description}</th>
                       <th>${data.value[4].Price}</th>
                    </tr>
                    <tr>
                       <th>${data.value[6].Number}</th> 
                       <th>${data.value[6].Description}</th>
                       <th>${data.value[6].Price}</th>
                    </tr>
                    <tr>
                       <th>${data.value[7].Number}</th> 
                       <th>${data.value[7].Description}</th>
                       <th>${data.value[7].Price}</th>
                    </tr>
                    <tr>
                       <th>${data.value[8].Number}</th> 
                       <th>${data.value[8].Description}</th>
                       <th>${data.value[8].Price}</th>
                    </tr>
                    <tr>
                       <th>${data.value[9].Number}</th> 
                       <th>${data.value[9].Description}</th>
                       <th>${data.value[9].Price}</th>
                    </tr>
                    `;
                document.getElementById('res').innerHTML = output
                ;
            })
            .catch((err) => console.log(err))
            e.preventDefault();
    }
    
    render() {
        return (
            <form onSubmit={this.submit}>
                <label>
                    Number:
            <input type="text" onChange={(e) => this.changeValue('number', e)} name="number" value={this.state.number || ''}
             />
                    Keyword:
            <input type="text" onChange={(e) => this.changeValue('keyword', e)} name="keyword" value={this.state.keyword || '' }/>
                </label>
                <input type="submit" value="Submit" />
                <br />
                <br />
            </form>
        )
    }
}
export default Search