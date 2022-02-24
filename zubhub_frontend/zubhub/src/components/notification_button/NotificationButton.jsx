import React, { useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import NotificationPanel from '../notification_panel/NotificationPanel';
import NotificationsIcon from '@material-ui/icons/Notifications';
import CustomButton from '../button/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const useStyles = makeStyles(theme => ({
  paper: {
    border: '1px solid',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
}));

const NotificationButton = ({ className }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const buttonRef = useRef();

  return (
    <ClickAwayListener onClickAway={() => setDropdownOpen(false)}>
      <div>
        <CustomButton
          className={className}
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
