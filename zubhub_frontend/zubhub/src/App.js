import React, { useContext, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { updateTheme } from './theme';
import ScrollToTop from './ScrollToTop';
import { SessionExpiredModal } from './components';
import RoutesContainer from './Routes';
import ZubhubAPI from '../src/api/api';
const API = new ZubhubAPI();

const ThemeContext = React.createContext();

function App(props) {
  const theme = useContext(ThemeContext);

  useEffect(() => {
    handleThemeChange();
  }, []);

  const handleThemeChange = async () => {
    try {
      const data = await API.theme();

      updateTheme(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      <ScrollToTop />
      <RoutesContainer {...props} />
    </ThemeContext.Provider>
  );
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const ConnectedApp = connect(mapStateToProps)(App);

export default withTranslation()(ConnectedApp);
