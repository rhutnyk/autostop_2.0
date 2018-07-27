import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
import './App.css';
import Search from './components/Search';
import Product from './components/Product';
import EuroExchange from './components/Euro_exchange';

class App extends Component {
  render() {
    return (
      <div className="App">
        <EuroExchange/>
        <Search />
        <Product/>
      </div>
      
    );
  }
}






// let url = 'https://jsonplaceholder.typicode.com/posts/';
//              fetch(url)
//             .then((res) => res.json())
//             .then((data) => {
//                 let output = '';
//                 data.forEach(function(data){
//                     output += `
//                      <table>
//                      <ul>
//                        <li>${data["id"]}</li>
//                        <li>${data["title"]}</li>
//                        <li>${data["body"]}</li>
//                      </ul>
//                      </table >
//                     `;
//                 });
//                 document.getElementById('res').innerHTML = output;
//             })






export default App;


