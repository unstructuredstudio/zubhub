import React, { useState } from 'react';
import styles from '../../assets/js/styles/components/user_activitylog/userActivitylogStyles';
import { makeStyles } from '@mui/styles';
import { dFormatter } from '../../assets/js/utils/scripts';
import { Link, useNavigate } from 'react-router-dom';

import { MdBookmarks } from 'react-icons/md';
import { FaComments } from 'react-icons/fa';
import { RiUserFollowFill, RiUserFollowLine } from 'react-icons/ri';
import ClapIcon, { ClapBorderIcon } from '../../assets/js/icons/ClapIcon';
import CommentIcon from '../../assets/js/icons/CommentIcon';

import {
  Tooltip,
  Badge,
  Avatar,
  Grid,
  Box,
  Container,
  Paper,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Typography,
  OutlinedInput,
  InputLabel,
  FormControl,
  Divider,
  ListItem,
  ListItemText,
} from '@mui/material';

const useStyles = makeStyles(styles);

const UserActivity = props => {
  const classes = useStyles();
  const { username } = props;
  console.log(props, 'props_useractivity');
  const st = dFormatter(JSON.parse('"' + props.activity.date + '"'));

  return (
    <Link to={props.activity.link} className={classes.activityLink}>
      <ListItem className={classes.activityStyle}>
        {props.activity.type == 1 && (
          <div className={classes.iconStyle}>
            <ClapIcon />
          </div>
        )}
        {props.activity.type == 2 && (
          <div className={classes.iconStyle}>
            <FaComments size="28px" />
          </div>
        )}
        {props.activity.type == 3 && (
          <div className={classes.iconStyle}>
            <RiUserFollowFill size="28px" />
          </div>
        )}
        {props.activity.type == 4 && (
          <div className={classes.iconStyle}>
            <MdBookmarks size="28px" />
          </div>
        )}

        <ListItemText
          className={classes.text}
          classes={{ primary: classes.message, secondary: classes.time }}
          primary={
            <span
              dangerouslySetInnerHTML={{
                __html: props.activity.message,
              }}
            ></span>
          }
          secondary={st.value + ' ' + st.key + ' ' + 'ago'}
        />
      </ListItem>
    </Link>
  );
};

export default UserActivity;
