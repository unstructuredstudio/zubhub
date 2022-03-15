import React from 'react';
import styles from '../../assets/js/styles/components/notification/NotificationStyles';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import API from '../../api';
import { renderTimeAgo, getNotification } from './NotificationScripts';

const useStyles = makeStyles(styles);
const Notification = ({ notification }) => {
  const classes = useStyles();
  const token = useSelector(store => store.auth.token);
  return (
    <>
      <div
        className={classes.notificationStyle}
        onClick={() => {
          if (!notification.viewed) {
            API.viewNotification({
              id: notification.id,
              token: token,
            });
          }
          window.location.href = notification.link;
        }}
      >
        <img
          className={classes.image}
          src={notification.source.avatar}
          alt="user-profile"
        />

        <div className={classes.text}>
          <p className={classes.message}>{getNotification(notification)}</p>
          <p className={classes.time}>{renderTimeAgo(notification)}</p>
        </div>
        {!notification.viewed && <div className={classes.viewDot}></div>}
        {notification.viewed && <div className={classes.unviewed}></div>}
      </div>
    </>
  );
};

export default Notification;
