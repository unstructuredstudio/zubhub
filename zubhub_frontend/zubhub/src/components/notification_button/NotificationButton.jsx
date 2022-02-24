import React, { useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import NotificationPanel from '../notification_panel/NotificationPanel';
import NotificationsIcon from '@material-ui/icons/Notifications';
import CustomButton from '../button/Button';

const useStyles = makeStyles(theme => ({
  paper: {
    border: '1px solid',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
}));

const NotificationButton = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const buttonRef = useRef();

  return (
    <>
      <CustomButton
        onClick={() => setDropdownOpen(!dropdownOpen)}
        ref={buttonRef}
      >
        <NotificationsIcon />
      </CustomButton>
      <NotificationPanel open={dropdownOpen} anchorEl={buttonRef} />
    </>
  );
};

export default NotificationButton;
