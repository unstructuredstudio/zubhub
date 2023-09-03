import { IconButton, Typography, makeStyles } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
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
