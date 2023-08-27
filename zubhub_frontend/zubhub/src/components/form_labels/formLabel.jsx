import React from 'react';
import { Box, Typography, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import styles from '../../assets/js/styles';

function FormLabel({ required, htmlFor, children, ...props }) {
  const commonClasses = makeStyles(styles)();

  return (
    <label htmlFor={htmlFor}>
      <Typography color="textSecondary" className={clsx(commonClasses.marginBottom1em, commonClasses.title2)}>
        {children}
        {required ? <span className={commonClasses.colorRed}>*</span> : ''}
      </Typography>
    </label>
  );
}

export default FormLabel;
