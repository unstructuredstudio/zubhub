import React from 'react'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = props => {
  const { wrapper: Wrapper, component, ...rest } = props;

  return props.auth?.token ? <Wrapper component={component} {...rest} /> : <Navigate to="/login" replace />;
  };

  export default ProtectedRoute