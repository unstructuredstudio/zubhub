import React, { useState } from 'react';
import styles from '../../assets/js/styles/components/notification/NotificationStyles';
import { makeStyles } from '@material-ui/core/styles';
import { viewNotification } from '../../store/actions/userActions';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(styles);

const NOTIFICATION_TYPE = {
  BOOKMARK: 1,
  CLAP: 2,
  COMMENT: 3,
  FOLLOW: 4,
  FOLLOWING_PROJECT: 5,
};

const Notification = ({ notification }) => {
  const classes = useStyles();
  const token = useSelector(store => store.auth.token);
  // method for rendering message
  const getNotification = () => {
    if (notification.type == 'CLAP') {
      return (
        <>
          <strong>{notification.source.username}</strong> clapped for "
          {notification.projectName}"
        </>
      );
    } else if (notification.type == 'COMMENT') {
      return (
        <>
          <strong>{notification.source.username}</strong> commented on "
          {notification.projectName}!"
        </>
      );
    } else if (notification.type == 'BOOKMARK') {
      return (
        <>
          <strong>{notification.source.username}</strong> bookmarked "
          {notification.projectName}!"
        </>
      );
    } else {
      return (
        <>
          <strong>{notification.source.username}</strong> started following you!
        </>
      );
    }
  };

  return (
    <>
      <div
        className={classes.notificationStyle}
        onClick={() => {
          if (!notification.viewed) {
            viewNotification({
              id: notification.id,
              token: token,
            });
          }
          // window.location.href = notification.link;
        }}
      >
        <img
          className={classes.image}
          src={notification.source.avatar}
          alt="user-profile"
        />

        <div className={classes.text}>
          <p className={classes.message}>{getNotification()}</p>
          <p className={classes.time}>{notification.time}</p>
        </div>
        {!notification.viewed && <div className={classes.viewDot}></div>}
        {notification.viewed && <div className={classes.unviewed}></div>}
      </div>
    </>
  );
};

export default Notification;
