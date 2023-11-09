import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../assets/js/styles/components/notification_panel/notificationPanelStyles';
import { makeStyles } from '@material-ui/core/styles';
import NotificationPanelButton from './NotificationPanelButton';
import cn from 'classnames';
import PanelPopper from './PanelPopper';
import Notification from '../notification/Notification';
import { useMediaQuery, CircularProgress, Typography } from '@material-ui/core';
import API from '../../api/api';
import { useSelector } from 'react-redux';
import { Notifications } from '@material-ui/icons';
import { colors } from '../../assets/js/colors';
import CustomButton from '../button/Button';

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

const notificationSort = (a, b) => {
  return new Date(b.date) - new Date(a.date);
};

const NotificationPanel = ({ open, anchorEl, onClose }) => {
  const classes = useStyles();
  const mediaQuery = useMediaQuery('(max-width: 600px)');
  const [notificationViewType, setNotificationViewType] = useState(NOTIFICATION_VIEW_TYPE.ALL);
  const token = useSelector(state => state.auth.token);
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState({});
  const [loading, setLoading] = useState(false);
  const [topLoading, setTopLoading] = useState(false);
  const [outOfNotifications, setOutOfNotifications] = useState(false);
  const notificationsWrapperRef = useRef();
  const { t } = useTranslation();

  const newNotifications = useMemo(
    () => Object.values(notifications).sort(notificationSort).filter(isNewNotification),
    [notifications],
  );
  const earlierNotifications = useMemo(
    () =>
      Object.values(notifications)
        .sort(notificationSort)
        .filter(notification => !isNewNotification(notification)),
    [notifications],
  );
  const unreadNotifications = useMemo(
    () =>
      Object.values(notifications)
        .sort(notificationSort)
        .filter(notification => !notification.viewed),
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

      const newNotifications = notifications.results.reduce(
        (obj, notification) => ({ ...obj, [notification.id]: notification }),
        {},
      );

      await new Promise(resolve => setTimeout(resolve, 100));
      setNotifications(currentNotifications => ({
        ...currentNotifications,
        ...newNotifications,
      }));
      setLoading(false);
    };

    if (!outOfNotifications && token && page !== 1) {
      getNotifications();
    }
  }, [page, token, outOfNotifications]);

  useEffect(() => {
    const getNotifications = async () => {
      setTopLoading(true);
      const api = new API();

      const notifications = await api.getNotifications(1, token);

      if (!notifications.results) {
        setOutOfNotifications(true);
        setTopLoading(false);
        return;
      }

      const newNotifications = notifications.results.reduce(
        (obj, notification) => ({ ...obj, [notification.id]: notification }),
        {},
      );

      /* await new Promise(resolve => setTimeout(resolve, 100)); */
      setNotifications(currentNotifications => ({
        ...newNotifications,
        ...currentNotifications,
      }));
      setTopLoading(false);
    };

    if (token && open) {
      getNotifications();
    }
  }, [open, token]);

  const handleScroll = ({ target }) => {
    if (!loading && !outOfNotifications && target.scrollTop + target.clientHeight >= target.scrollHeight - 50) {
      setPage(page => page + 1);
      setLoading(true);
    }
  };

  const onNotificationClick = notification => {
    notification.viewed = true;
    setNotifications(currentNotifications => ({
      ...currentNotifications,
      [notification.id]: notification,
    }));
    onClose();
  };

  const getLoadingSpinner = () => (
    <CircularProgress className={classes.circularProgressStyle} size={30} thickness={6} />
  );

  const getAllNotificationView = () => {
    const hasNewNotifications = newNotifications.length > 0;
    const hasEarlierNotifications = earlierNotifications.length > 0;

    return (
      <div className={classes.notificationsWrapper} onScroll={handleScroll} ref={notificationsWrapperRef}>
        {hasNewNotifications && <h2 className={classes.panelSubheadingTextStyle}>{t('notificationPanel.notificationType.new')}</h2>}
        {topLoading && getLoadingSpinner()}
        {newNotifications.map(notification => (
          <Notification notification={notification} onNotificationClick={() => onNotificationClick(notification)} />
        ))}
        {hasEarlierNotifications && <h2 className={classes.panelSubheadingTextStyle}>{t('notificationPanel.notificationType.earlier')}</h2>}
        {earlierNotifications.map(notification => (
          <Notification notification={notification} onNotificationClick={() => onNotificationClick(notification)} />
        ))}
        {!topLoading && !loading && !hasNewNotifications && !hasEarlierNotifications && (
          <p>{t('notificationPanel.noNotificationText')}</p>
        )}
        {loading && getLoadingSpinner()}
      </div>
    );
  };

  const getUnreadNotificationView = () => (
    <div className={classes.notificationsWrapper} onScroll={handleScroll} ref={notificationsWrapperRef}>
      {unreadNotifications.map(notification => (
        <Notification notification={notification} onNotificationClick={() => onNotificationClick(notification)} />
      ))}
      {!loading && unreadNotifications.length === 0 && <p>{t('notificationPanel.noNotificationText')}</p>}
      {loading && getLoadingSpinner()}
    </div>
  );

  const handleNotificationTabChange = notificationViewType => () => {
    setNotificationViewType(notificationViewType);
    notificationsWrapperRef.current.scrollTop = 0;
  };

  return (
    <PanelPopper open={open} anchorEl={anchorEl}>
      <div className={cn(classes.popperStyle, mediaQuery ? classes.fullscreenPopperStyle : '')}>
        {token && (
          <>
            <div className={classes.panelHeaderStyle}>
              <h1 className={classes.panelHeaderTextStyle}>{t('notificationPanel.title')}</h1>
              <div className={classes.panelHeaderButtons}>
                <NotificationPanelButton
                  selected={notificationViewType === NOTIFICATION_VIEW_TYPE.ALL}
                  onClick={handleNotificationTabChange(NOTIFICATION_VIEW_TYPE.ALL)}
                >
                  {t('notificationPanel.viewButtonLabel.all')}
                </NotificationPanelButton>
                <NotificationPanelButton
                  selected={notificationViewType === NOTIFICATION_VIEW_TYPE.UNREAD}
                  onClick={handleNotificationTabChange(NOTIFICATION_VIEW_TYPE.UNREAD)}
                >
                  {t('notificationPanel.viewButtonLabel.unread')}
                </NotificationPanelButton>
              </div>
            </div>
            {notificationViewType === NOTIFICATION_VIEW_TYPE.ALL
              ? getAllNotificationView()
              : getUnreadNotificationView()}
          </>
        )}
        {!token && (
          <>
            <div className={classes.logedOutPanel}>
              <Notifications style={{ color: colors.primary, fontSize: 35 }} />
              <h3>{t('notificationPanel.notLoggedIn.title')}</h3>
              <Typography>{t('notificationPanel.notLoggedIn.text')}</Typography>
              <CustomButton style={{ alignSelf: 'normal', marginTop: 14 }} href="/login" primaryButtonStyle>
                {t('notificationPanel.notLoggedIn.buttonLabel')}
              </CustomButton>
            </div>
          </>
        )}
      </div>
    </PanelPopper>
  );
};

export default NotificationPanel;
