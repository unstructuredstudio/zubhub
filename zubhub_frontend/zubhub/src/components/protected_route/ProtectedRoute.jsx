import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import PageWrapper from '../../views/PageWrapper';
import LoadingPage from '../../views/loading/LoadingPage';

const ProtectedRoute = ({ component: LazyComponent, ...props }) => {
    return (
      <Route
        {...props}
        render={routeProps =>
          props.auth?.token ? (
            <PageWrapper {...props} {...routeProps}>
              <React.Suspense fallback={<LoadingPage />}>
                <LazyComponent {...routeProps} {...props} />
              </React.Suspense>
            </PageWrapper>
          ) : (
            <Redirect to="/login" />
          )
        }
      />
    );
  };

  export default ProtectedRoute