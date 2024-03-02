import React from 'react';
import styles from '../../assets/js/styles/components/notification/NotificationStyles';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import API from '../../api/api';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from '@mui/material';
import { AvatarGroup } from '@mui/lab';
import { dFormatter } from '../../assets/js/utils/scripts';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';

const useStyles = makeStyles(styles);
const Notification = ({ notification, onNotificationClick }) => {
  const classes = useStyles();
  const token = useSelector(store => store.auth.token);
  const { t } = useTranslation();
  const st = dFormatter(JSON.parse('"' + notification.date + '"'));

  return (
    <Link to={notification.link} className={classes.notificationLink}>
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
                __html: notification.message,
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
