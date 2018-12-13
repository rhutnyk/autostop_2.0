import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import Test from './Test';
import Currency from './Currency';
import * as serviceWorker from './serviceWorker';

//ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<Test/>, document.getElementById('tab'));
ReactDOM.render(<Currency/>, document.getElementById('currency'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
