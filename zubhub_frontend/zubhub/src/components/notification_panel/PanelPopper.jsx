import { useMediaQuery } from '@mui/material';
import React from 'react';
import Popper from '@mui/material/Popper';
import { makeStyles } from '@mui/styles';

import styles from '../../assets/js/styles/components/notification_panel/panelPopperStyles';

const useStyles = makeStyles(styles);

const modifiers = {
  offset: {
    enabled: true,
    offset: '20px, 30px',
  },
  arrow: {
    enabled: true,
  },
};

const fullscreenModifiers = {};

const PanelPopper = ({ open, anchorEl, children, signUpStyles }) => {
  const classes = useStyles();
  const mediaQuery = useMediaQuery('(max-width: 600px)');

  return (
    <Popper
      open={open}
      anchorEl={mediaQuery ? undefined : anchorEl.current}
      disablePortal={!mediaQuery}
      modifiers={mediaQuery ? fullscreenModifiers : modifiers}
      placement="bottom-end"
      className={mediaQuery ? classes.popperContainerStyle : ''}
      style={{ zIndex: mediaQuery ? 2 : 'unset' }}
    >
      {!mediaQuery && <div x-arrow="true" className={classes.popperArrowStyle}></div>}
      { signUpStyles ? <div className={classes.signUpcontainer}>{children}</div> : <div className={classes.container}>{children}</div>}
    </Popper>
  );
};

export default PanelPopper;
