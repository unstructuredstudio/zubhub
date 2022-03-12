import React from 'react';
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

  const renderTimeAgo = () => {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = week * 4;
    const year = day * 365;

    let t =
      Date.now() -
      new Date(JSON.parse('"' + notification.time + '"')).getTime();
    let plural = '';
    let timeType = '';
    var type;

    if (t < minute) {
      // seconds
      timeType += 'second';
      type = second;
    } else if (t >= minute && t < hour) {
      // minutes
      timeType += 'minute';
      type = minute;
    } else if (t >= hour && t < day) {
      // hours
      timeType += 'hour';
      type = hour;
    } else if (t >= day && t < week) {
      // days
      timeType += 'day';
      type = day;
    } else if (t >= week && t < month) {
      // weeks
      timeType += 'week';
      type = week;
    } else if (t >= month && t < year) {
      // months
      timeType += 'month';
      type = month;
    } else if (t > year) {
      // render years ago
      timeType += 'year';
      type = year;
    }
    const num = Math.max(1, Math.round(t / type));
    if (num > 1) plural += 's';
    return num.toString() + ' ' + timeType + plural + ' ago';
  };

  // method for rendering message
  const getNotification = () => {
    if (notification.type == NOTIFICATION_TYPE.CLAP) {
      return (
        <>
          <strong>{notification.source.username}</strong> clapped for "
          {notification.projectName}"
        </>
      );
    } else if (notification.type == NOTIFICATION_TYPE.COMMENT) {
      return (
        <>
          <strong>{notification.source.username}</strong> commented on "
          {notification.projectName}!"
        </>
      );
    } else if (notification.type == NOTIFICATION_TYPE.BOOKMARK) {
      return (
        <>
          <strong>{notification.source.username}</strong> bookmarked "
          {notification.projectName}!"
        </>
      );
    } else if (notification.type == NOTIFICATION_TYPE.FOLLOW) {
      return (
        <>
          <strong>{notification.source.username}</strong> started following you!
        </>
      );
    } else if (notification.type == NOTIFICATION_TYPE.FOLLOWING_PROJECT) {
      return (
        <>
          <strong>{notification.source.username}</strong> posted a new project!
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
          window.location.href = notification.link;
        }}
      >
        <img
          className={classes.image}
          src={notification.source.avatar}
          alt="user-profile"
        />

        <div className={classes.text}>
          <p className={classes.message}>{getNotification()}</p>
          <p className={classes.time}>{renderTimeAgo()}</p>
        </div>
        {!notification.viewed && <div className={classes.viewDot}></div>}
        {notification.viewed && <div className={classes.unviewed}></div>}
      </div>
    </>
  );
};

export default Notification;
