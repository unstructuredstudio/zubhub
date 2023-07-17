import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import React, { useRef, useState } from 'react';
import styles from '../../assets/js/styles/components/notification_button/notificationButtonStyles';
import commonStyles from '../../assets/js/styles/index';
import NotificationPanel from '../notification_panel/NotificationPanel';

import { makeStyles } from '@material-ui/core/styles';
import { Notifications } from '@material-ui/icons';
import clsx from 'clsx';
import { colors } from '../../assets/js/colors';
import HamburgerMenu from '../hamburger_menu/HamburgerMenu';
const useStyles = makeStyles(styles);

const NotificationButton = ({ className, notif }) => {
  const classes = useStyles();
  const commonClasses = makeStyles(commonStyles)();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const buttonRef = useRef();

  return (
    <ClickAwayListener onClickAway={() => setDropdownOpen(false)}>
      <div>
        <HamburgerMenu setDropdownOpen={setDropdownOpen} dropdownOpen={dropdownOpen} />
        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          ref={buttonRef}
          className={clsx(classes.notification, commonClasses.iconBox)}
        >
          <Notifications style={{ color: colors.primary, fontSize: 20 }} />
        </div>
        <NotificationPanel
          open={dropdownOpen}
          anchorEl={buttonRef}
          notif={notif}
          onClose={() => setDropdownOpen(false)}
        />
      </div>
    </ClickAwayListener>
  );
};

export default NotificationButton;
