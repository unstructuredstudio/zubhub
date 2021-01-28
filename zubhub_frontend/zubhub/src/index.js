import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import reportWebVitals from './reportWebVitals';

import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

import { ThemeProvider } from '@material-ui/styles';
import { theme } from './assets/js/muiTheme';

import App from './App';
import './assets/css/index.css';
import configureStore from './store/configureStore';
import './i18n';

let { store, persistor } = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <React.StrictMode>
        <ThemeProvider theme={theme}>
          <Suspense fallback={null}>
            <App />
          </Suspense>
        </ThemeProvider>
      </React.StrictMode>
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
