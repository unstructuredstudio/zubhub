import { IconButton, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import styles from '../../assets/js/styles/index';
import { collapsibleStyles } from './collapsible.styles';
import clsx from 'clsx';
import { useState } from 'react';

const Collapsible = ({ title, children }) => {
  const classes = makeStyles(collapsibleStyles)();
  const commonClasses = makeStyles(styles)();
  const [open, setOpen] = useState(true);

  return (
    <div className={clsx(classes.card, classes.expandableMargin, commonClasses.boxShadow)}>
      <div className={clsx(commonClasses.displayFlex, commonClasses.justifySpaceBetween, commonClasses.alignCenter)}>
        <Typography className={commonClasses.title2}>{title}</Typography>
        <IconButton onClick={() => setOpen(prev => !prev)}>
          <ExpandMore />
        </IconButton>
      </div>
      <div className={clsx(classes.closed, open && classes.expanded)}>{children}</div>
    </div>
  );
};

export default Collapsible;
