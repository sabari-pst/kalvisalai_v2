import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import './assets/css/aos.css';
//import './assets/css/bootstrap.min.css';
import './assets/main.css';
import './assets/boxicons/css/boxicons.min.css';
import './assets/themify-icons/css/themify-icons.css';
import './assets/font-awesome/css/all.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
