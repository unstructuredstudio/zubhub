import { FormHelperText } from '@mui/material';
import React from 'react';

const CustomErrorMessage = props => {
  const { name, touched, errors, printText } = props;
  return <FormHelperText error>{touched[name] && errors[name] && <>{printText}</>}</FormHelperText>;
};

export default CustomErrorMessage;
