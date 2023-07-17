import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import React, { useRef, useState } from 'react';
import commonStyles from '../../assets/js/styles/index';
import { Avatar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HamburgerMenu from '../hamburger_menu/HamburgerMenu';
import PanelPopper from '../notification_panel/PanelPopper';
import { useSelector } from 'react-redux';
import { styles } from './avatarButton.styles';
import { colors } from '../../assets/js/colors';
import CustomButton from '../button/Button';

const AvatarButton = props => {
  const commonClasses = makeStyles(commonStyles)();
  const classes = makeStyles(styles)();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const buttonRef = useRef();
  const auth = useSelector(state => state.auth);
  const goToProfile = () => {
    if (window.location.pathname !== '/profile') {
      props.history.push('/profile');
    }
  };

  return (
    <ClickAwayListener onClickAway={() => setDropdownOpen(false)}>
      <div>
        <HamburgerMenu setDropdownOpen={setDropdownOpen} dropdownOpen={dropdownOpen} />
        <Avatar
          ref={buttonRef}
          onClick={() => (!auth.token ? setDropdownOpen(!dropdownOpen) : goToProfile())}
          className={commonClasses.iconBox}
          alt={auth?.username?.toUpperCase()}
          src="/static/images/avatar/1.jpg"
        />
        <PanelPopper open={dropdownOpen} anchorEl={buttonRef}>
          <div className={classes.container}>
            <Avatar style={{ fontSize: 35, color: colors.primary, backgroundColor: colors.white }} />
            <h3>Sign Up or Log In to your ZubHub account</h3>
            <Typography>Takes only a few seconds</Typography>
            <CustomButton href="/signup" style={{ alignSelf: 'normal' }} primaryButtonStyle>
              Sign Up
            </CustomButton>
            <CustomButton href="/login" style={{ alignSelf: 'normal' }} primaryButtonOutlinedStyle>
              Sign In
            </CustomButton>
          </div>
        </PanelPopper>
      </div>
    </ClickAwayListener>
  );
};

export default AvatarButton;
