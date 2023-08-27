import { Typography, makeStyles } from '@material-ui/core';
import React from 'react';
import styles from '../../assets/js/styles';

export default function Settings() {
  const commonClasses = makeStyles(styles)();
  return (
    <div>
      <Typography className={commonClasses.title1}>Settings</Typography>
    </div>
  );
}
