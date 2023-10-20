import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoutes = (props) => {
  return  props.auth?.token ? <Outlet /> : <Navigate to="/login" replace />
};

export default ProtectedRoutes