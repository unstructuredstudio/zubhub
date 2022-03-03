import React, { useState } from 'react';
import styles from '../../assets/js/styles/components/notification_panel/notificationPanelStyles';
import { makeStyles } from '@material-ui/core/styles';
import NotificationPanelButton from './NotificationPanelButton';
import cn from 'classnames';
import NotificationPanelPopper from './NotificationPanelPopper';
import { useMediaQuery } from '@material-ui/core';

const useStyles = makeStyles(styles);

const NOTIFICATION_VIEW_TYPE = {
  ALL: 'ALL',
  UNREAD: 'UNREAD',
};

const NotificationPanel = ({ open, anchorEl }) => {
  const classes = useStyles();
  const mediaQuery = useMediaQuery('(max-width: 600px)');
  const [notificationViewType, setNotificationViewType] = useState(
    NOTIFICATION_VIEW_TYPE.ALL,
  );

  const getAllNotificationView = () => {
    const newNotificationsLength = 1;
    const earlierNotificationsLength = 1;

    return (
      <div>
        {newNotificationsLength > 0 && (
          <h2 className={classes.panelSubheadingTextStyle}>New</h2>
        )}
        {earlierNotificationsLength > 0 && (
          <h2 className={classes.panelSubheadingTextStyle}>Earlier</h2>
        )}
      </div>
    );
  };

  const getUnreadNotificationView = () => (
    <div style={{ color: 'black' }}>Unread notifications here...</div>
  );

  return (
    <NotificationPanelPopper open={open} anchorEl={anchorEl}>
      <div
        className={cn(
          classes.popperStyle,
          mediaQuery ? classes.fullscreenPopperStyle : '',
        )}
      >
        <div className={classes.panelHeaderStyle}>
          <h1 className={classes.panelHeaderTextStyle}>Notifications</h1>
          <NotificationPanelButton
            selected={notificationViewType === NOTIFICATION_VIEW_TYPE.ALL}
            onClick={() => setNotificationViewType(NOTIFICATION_VIEW_TYPE.ALL)}
          >
            All
          </NotificationPanelButton>
          <NotificationPanelButton
            selected={notificationViewType === NOTIFICATION_VIEW_TYPE.UNREAD}
            onClick={() =>
              setNotificationViewType(NOTIFICATION_VIEW_TYPE.UNREAD)
            }
          >
            Unread
          </NotificationPanelButton>
        </div>
        {notificationViewType === NOTIFICATION_VIEW_TYPE.ALL
          ? getAllNotificationView()
          : getUnreadNotificationView()}
      </div>
    </NotificationPanelPopper>
  );
};

export default NotificationPanel;
