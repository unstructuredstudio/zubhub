import { useMediaQuery } from '@material-ui/core';
import React from 'react';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';

import styles from '../../assets/js/styles/components/notification_panel/notificationPanelPopperStyles';

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

const NotificationPanelPopper = ({ open, anchorEl, children }) => {
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
      {!mediaQuery && (
        <div x-arrow="true" className={classes.popperArrowStyle}></div>
      )}
      {children}
    </Popper>
  );
};

export default NotificationPanelPopper;
