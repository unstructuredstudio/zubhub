import React from 'react';
import { colors } from '../../assets/js/colors';
import { Typography, makeStyles } from '@material-ui/core';

export default function Pill({ text }) {
  const classes = makeStyles(styles)();
  return (
    <div className={classes.primaryButtonOutlinedStyle}>
      <Typography>{text}</Typography>
    </div>
  );
}

const styles = theme => ({
  primaryButtonOutlinedStyle: {
    backgroundColor: 'transparent',
    border: `1px solid ${colors.primary}`,
    padding: '8px 40px',
    borderRadius: 4,
    color: colors.primary,
    // '&:hover': {
    //   backgroundColor: '#00B8C4',
    //   color: colors.white,
    // },
  },
});
