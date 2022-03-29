import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from '../../assets/js/styles/components/notification_panel/notificationPanelStyles';
import { makeStyles } from '@material-ui/core/styles';
import NotificationPanelButton from './NotificationPanelButton';
import cn from 'classnames';
import NotificationPanelPopper from './NotificationPanelPopper';
import { useMediaQuery, CircularProgress } from '@material-ui/core';
import API from '../../api/api';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(styles);

const NOTIFICATION_VIEW_TYPE = {
  ALL: 'ALL',
  UNREAD: 'UNREAD',
};

const recentDateThreshold = 3.6e6; // One hour
const isNewNotification = notification => {
  const date = new Date(notification.date);
  const now = new Date();

  return now - date < recentDateThreshold;
};

const NotificationPanel = ({ open, anchorEl }) => {
  const classes = useStyles();
  const mediaQuery = useMediaQuery('(max-width: 600px)');
  const [notificationViewType, setNotificationViewType] = useState(
    NOTIFICATION_VIEW_TYPE.ALL,
  );
  const token = useSelector(state => state.auth.token);
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [outOfNotifications, setOutOfNotifications] = useState(false);
  const notificationsWrapperRef = useRef();

  const newNotifications = useMemo(
    () => notifications.filter(isNewNotification),
    [notifications],
  );
  const earlierNotifications = useMemo(
    () =>
      notifications.filter(notification => !isNewNotification(notification)),
    [notifications],
  );
  const unreadNotifications = useMemo(
    () => notifications.filter(notification => !notification.viewed),
    [notifications],
  );

  useEffect(() => {
    const getNotifications = async () => {
      setLoading(true);
      const api = new API();

      const notifications = await api.getNotifications(page, token);

      if (!notifications.results) {
        setOutOfNotifications(true);
        setLoading(false);
        return;
      }

      if (page > 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setNotifications(currentNotifications => [
        ...currentNotifications,
        ...notifications.results,
      ]);
      await new Promise(resolve => setTimeout(resolve, 100));
      setLoading(false);
    };

    if (!outOfNotifications && token && page) {
      getNotifications();
    }
  }, [page, token, outOfNotifications]);

  const handleScroll = ({ target }) => {
    if (
      !loading &&
      target.scrollTop + target.clientHeight >= target.scrollHeight - 50
    ) {
      setPage(page => page + 1);
    }
  };

  const getLoadingSpinner = () => (
    <CircularProgress
      className={classes.circularProgressStyle}
      size={30}
      thickness={6}
    />
  );

  const getAllNotificationView = () => {
    const newNotificationsLength = newNotifications.length;
    const earlierNotificationsLength = earlierNotifications.length;

    return (
      <div
        className={classes.notificationsWrapper}
        onScroll={handleScroll}
        ref={notificationsWrapperRef}
      >
        {newNotificationsLength > 0 && (
          <h2 className={classes.panelSubheadingTextStyle}>New</h2>
        )}
        {newNotifications.map(notification => (
          <p style={{ color: 'black', padding: '50px 0px' }}>
            {notification.message}
          </p>
        ))}
        {earlierNotificationsLength > 0 && (
          <h2 className={classes.panelSubheadingTextStyle}>Earlier</h2>
        )}
        {earlierNotifications.map(notification => (
          <p style={{ color: 'black', padding: '50px 0px' }}>
            {notification.message}
          </p>
        ))}
        {loading && getLoadingSpinner()}
      </div>
    );
  };

  const getUnreadNotificationView = () => (
    <div
      className={classes.notificationsWrapper}
      onScroll={handleScroll}
      ref={notificationsWrapperRef}
    >
      {unreadNotifications.map(notification => (
        <p style={{ color: 'black', padding: '50px 0px' }}>
          {notification.message}
        </p>
      ))}
      {loading && getLoadingSpinner()}
    </div>
  );

  const handleNotificationTabChange = notificationViewType => () => {
    setNotificationViewType(notificationViewType);
    notificationsWrapperRef.current.scrollTop = 0;
  };

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
            onClick={handleNotificationTabChange(NOTIFICATION_VIEW_TYPE.ALL)}
          >
            All
          </NotificationPanelButton>
          <NotificationPanelButton
            selected={notificationViewType === NOTIFICATION_VIEW_TYPE.UNREAD}
            onClick={handleNotificationTabChange(NOTIFICATION_VIEW_TYPE.UNREAD)}
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
