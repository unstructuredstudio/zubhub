import React, { useState } from 'react';
import styles from '../../assets/js/styles/components/notification/NotificationStyles';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(styles);

const NOTIFICATION_TYPE = {
  ALL: 'ALL',
  CLAP: 'CLAP',
  COMMENT: 'COMMENT',
  BOOKMARK: 'BOOKMARK',
  FOLLOW: 'FOLLOW',
};

const Notification = ({ notification }) => {
  const classes = useStyles();
  const history = useHistory();
  const [viewed, setViewed] = useState(notification.viewed);
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
          history.push(notification.link);
          if (viewed == false) setViewed((viewed = true));
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
        {!viewed && <div className={classes.viewDot}></div>}
        {viewed && <div className={classes.unviewed}></div> }
      </div>
    </>
  );
};

export default Notification;
