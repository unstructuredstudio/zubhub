import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import styles from '../../assets/js/styles/components/notification_button/notificationButtonStyles';
import commonStyles from '../../assets/js/styles/index';
import NotificationPanel from '../notification_panel/NotificationPanel';

import { makeStyles } from '@material-ui/core/styles';
import { Notifications } from '@material-ui/icons';
import API from '../../api/api'
import clsx from 'clsx';
import { colors } from '../../assets/js/colors';
import HamburgerMenu from '../hamburger_menu/HamburgerMenu';
const useStyles = makeStyles(styles);

const notificationSort = (a, b) => {
  return new Date(b.date) - new Date(a.date);
};

const NotificationButton = ({ className, notif, auth }) => {
  const classes = useStyles();
  const commonClasses = makeStyles(commonStyles)();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const buttonRef = useRef();

  const unreadNotifications = useMemo(
    () =>
      Object.values(notifications)
        .sort(notificationSort)
        .filter(notification => !notification.viewed),
    [notifications],
  );

  useEffect(() => {
    async function fetchData() {
    const api = new API();
    const notifications = await api.getNotifications(1, auth.token);
    setNotifications(notifications.results)
    }
    fetchData()
  }, [auth.token])

  return (
    <ClickAwayListener onClickAway={() => setDropdownOpen(false)}>
      <div>
        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          ref={buttonRef}
          className={clsx(classes.notification, commonClasses.iconBox)}
          style={{ position: 'relative', cursor: 'pointer' }}
        >
        {
          unreadNotifications?.length > 0 && (
           <span className={classes.spanNumber}>
             {unreadNotifications.length > 9 ? '9+' : unreadNotifications?.length}
           </span>
          )
        }
         <Notifications style={{ color: colors.primary, fontSize: 24 }} />
        </div>
        <NotificationPanel
          open={dropdownOpen}
          anchorEl={buttonRef}
          notif={notif}
          onClose={() => setDropdownOpen(false)}
        />
      </div>
    </ClickAwayListener>
  );
};

export default NotificationButton;