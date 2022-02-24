import React, { useState } from 'react';
import Popper from '@material-ui/core/Popper';
import styles from '../../assets/js/styles/components/notification_panel/notificationPanelStyles';
import { makeStyles } from '@material-ui/core/styles';
import NotificationPanelButton from './NotificationPanelButton';

const useStyles = makeStyles(styles);

const NOTIFICATION_VIEW_TYPE = {
  ALL: 'ALL',
  UNREAD: 'UNREAD',
};

const modifiers = {
  offset: {
    enabled: true,
    offset: '20px, 30px',
  },
  arrow: {
    enabled: true,
  },
};

const NotificationPanel = ({ open, anchorEl }) => {
  const classes = useStyles();
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
    <div>Unread notifications here...</div>
  );

  return (
    <Popper
      open={open}
      anchorEl={anchorEl.current}
      disablePortal
      modifiers={modifiers}
      placement="bottom-end"
    >
      <div x-arrow="true" className={classes.popperArrowStyle}></div>

      <div className={classes.popperStyle}>
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
    </Popper>
  );
};

export default NotificationPanel;
