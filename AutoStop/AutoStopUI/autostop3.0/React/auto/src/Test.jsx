import React, { Component } from 'react';
import './Test.css';

class Test extends Component {

    constructor(props) {

        super(props);

        this.state = {
            data: null,
        };
    }

    componentDidMount() {
        const url = "http://autostop.bitsorchestra.com/api/parts";

        fetch(url)
            .then(result => result.json())
            .then(data => {
                this.setState({
                    data: data.Items
                })
            });
    }


    render() {

        return (

            this.state.data && this.state.data.length > 0 ?
                this.state.data.map((item, i) => <tr className={item.IsAnalog ? 'text-item' : ''}>
                    <td key={i}>{item.Part.Number}</td>
                    <td key={i}>{item.Part.Description}</td>
                    <td key={i}>{item.Part.Qty}</td>
                    <td key={i}>{item.Part.Price}</td>
                    <td key={i} className="td-btn">
                        {
                            item.IsAnalog ?
                                <button className="btn-self">+</button>
                                : null
                        }
                    </td>
                </tr>)
                : null


        )

    }

}

export default Test;