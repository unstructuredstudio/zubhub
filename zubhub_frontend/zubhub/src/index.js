import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
import {PersistGate} from 'redux-persist/integration/react';
import API, {APIContext} from './components/api';

let {store, persistor} = configureStore();

ReactDOM.render(
  <APIContext.Provider value={new API()}>
  <Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </PersistGate>
  </Provider>
  </APIContext.Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
