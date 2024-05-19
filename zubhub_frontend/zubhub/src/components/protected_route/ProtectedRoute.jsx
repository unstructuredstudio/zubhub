import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = props =>
  props.auth?.token ? props.children : <Navigate to={`/login?redirect=${props.location?.pathname}`} replace />;

export default ProtectedRoute;
