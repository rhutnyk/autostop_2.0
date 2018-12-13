import React, { Component } from 'react';




class Currency extends Component{
    constructor(props){

        super(props);

        this.state = {
            data:null,
        }
    };

componentDidMount(){
    const url = "http://autostop.bitsorchestra.com/api/parts?rate";

    fetch(url)
    .then(result=>result.json())
    .then(data=>{
        this.setState({data: data})
    });
}

render(){
    return (
        this.state.data && this.state.data.length > 0 ?
        this.state.data.map((item, index)=>
        <span key="index">OOO</span>
        )
        :null
    )
}

}

export default Currency;