import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { labeledLineStyle } from './labeledLine.style';

export default function LabeledLine({ label = 'OR' }) {
  const classes = makeStyles(labeledLineStyle)();

  return (
    <div className={classes.container}>
      <hr />
      <Typography>{label}</Typography>
    </div>
  );
}
