import React, { useRef, useState } from 'react';
import NotificationPanel from '../notification_panel/NotificationPanel';
import NotificationsIcon from '@material-ui/icons/Notifications';
import CustomButton from '../button/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import cn from 'classnames';
import styles from '../../assets/js/styles/components/notification_button/notificationButtonStyles';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(styles);

const NotificationButton = ({ className }) => {
  const classes = useStyles();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const buttonRef = useRef();

  return (
    <ClickAwayListener onClickAway={() => setDropdownOpen(false)}>
      <div>
        <CustomButton
          className={cn(className, classes.notificationButtonStyle)}
          variant="contained"
          primaryButtonStyle
          customButtonStyle
          size="small"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          ref={buttonRef}
        >
          <NotificationsIcon />
        </CustomButton>
        <NotificationPanel open={dropdownOpen} anchorEl={buttonRef} />
      </div>
    </ClickAwayListener>
  );
};

export default NotificationButton;
