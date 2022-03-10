import React from 'react';
import styles from '../../assets/js/styles/components/notification_panel/notificationPanelButtonStyles';
import { makeStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(styles);

const NotificationPanelButton = ({ selected, children, ...rest }) => {
  const classNames = useStyles();

  const selectedButtonClassName = selected
    ? classNames.selectedButtonStyle
    : '';

  return (
    <button
      className={cn(classNames.buttonStyle, selectedButtonClassName)}
      {...rest}
    >
      {children}
    </button>
  );
};

export default NotificationPanelButton;
