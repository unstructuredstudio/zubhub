import { Typography, makeStyles } from '@material-ui/core';
import React from 'react';
import { orDividerStyle } from './orDivider.style';

export default function OrDivider() {
  const classes = makeStyles(orDividerStyle)();

  return (
    <div className={classes.container}>
      <hr />
      <Typography>OR</Typography>
    </div>
  );
}
