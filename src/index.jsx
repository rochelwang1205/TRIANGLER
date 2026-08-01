import React from 'react';
import ReactDOM from 'react-dom/client';
import './custom.scss';
import App from './app/App';
import { BrowserRouter } from 'react-router-dom';
import { BASE_PATH } from './config/paths';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter basename={BASE_PATH || undefined}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
