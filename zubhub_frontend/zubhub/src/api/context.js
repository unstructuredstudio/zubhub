import React from 'react';
const APIContext = React.createContext(null);

export const withAPI = Component => props =>
  (
    <APIContext.Consumer>
      {api => <Component {...props} api={api} />}
    </APIContext.Consumer>
  );

export default APIContext;
