import { FormHelperText } from '@mui/material';
import React from 'react';

const CustomErrorMessage = props => {
  const { name, touched, errors } = props;
  return <FormHelperText error>{touched[name] && errors[name] && <>{errors[name]}</>}</FormHelperText>;
};

export default CustomErrorMessage;
