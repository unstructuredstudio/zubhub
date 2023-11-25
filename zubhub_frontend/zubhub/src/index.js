import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import reportWebVitals from './reportWebVitals';

import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { theme } from './assets/js/muiTheme';

import App from './App';
import './theme.js';
import './assets/css/index.css';
import configureStore from './store/configureStore';
import './i18n';
import { BrowserRouter } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material/styles' 

let { store, persistor } = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <React.StrictMode>
        <ThemeProvider theme={theme}>
          <StyledEngineProvider injectFirst>
            <Suspense fallback={null}>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </Suspense>
          </StyledEngineProvider>
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
