import React from 'react';
import styles from '../../assets/js/styles/components/notification/NotificationStyles';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import API from '../../api/api';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from '@material-ui/core';
import { AvatarGroup } from '@material-ui/lab';
import { dFormatter } from '../../assets/js/utils/scripts';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';

const useStyles = makeStyles(styles);
const Notification = ({ notification, onNotificationClick }) => {
  const classes = useStyles();
  const token = useSelector(store => store.auth.token);
  const { t } = useTranslation();
  const st = dFormatter(JSON.parse('"' + notification.date + '"'));

  const getMessage = () => {
    let message = '';
    if (notification.sources.length === 1) {
      // 50 character message limit + 17 for strong tags being counted as well
      if (notification.message.length < 67) {
        message += notification.message;
      } else {
        message += notification.message.slice(0, 67) + '...';
      }
    } else {
      if (notification.message.length < 50) {
        // handles notifications without tags
        message += notification.message;
      } else {
        message += notification.message.slice(0, 50) + '...';
      }
    }
    return message;
  };

  return (
    <Link
      to={notification.link}
      style={{ textDecoration: 'none', color: 'inherit', maxWidth: '365px' }}
    >
      <ListItem
        alignItems="center"
        disableGutters
        button
        className={classes.notificationStyle}
        onClick={() => {
          if (!notification.viewed) {
            let obj = new API();
            obj.viewNotification({
              id: notification.id,
              token: token,
              body: notification,
            });
          }
          onNotificationClick();
        }}
      >
        <ListItemAvatar>
          {notification.sources.length === 1 && (
            <AvatarGroup className={classes.group}>
              <Avatar
                className={classes.image}
                src={notification.sources[0].avatar}
              />
            </AvatarGroup>
          )}
          {notification.sources.length > 1 && (
            <AvatarGroup className={classes.group}>
              <Avatar
                className={classes.firstImage}
                src={notification.sources[0].avatar}
              />
              <Avatar
                className={classes.secondImage}
                src={notification.sources[1].avatar}
              />
            </AvatarGroup>
          )}
        </ListItemAvatar>
        <ListItemText
          className={classes.text}
          classes={{ primary: classes.message, secondary: classes.time }}
          primary={
            <span
              dangerouslySetInnerHTML={{
                __html: getMessage(),
              }}
            ></span>
          }
          secondary={st.value + ' ' + st.key + ' ' + 'ago'}
        />
        {!notification.viewed && <div className={classes.viewDot}></div>}
        {notification.viewed && <div className={classes.unviewed}></div>}
      </ListItem>
    </Link>
  );
};

export default Notification;