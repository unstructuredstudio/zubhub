import {
  AppBar,
  Avatar,
  Box,
  Container,
  Hidden,
  MenuItem,
  OutlinedInput,
  Select,
  SwipeableDrawer,
  Typography,
  makeStyles,
  Menu,
} from '@material-ui/core';
import { Menu as MenuIcon, Notifications, Search, SearchOutlined, Translate } from '@material-ui/icons';
import clsx from 'clsx';
import React, { forwardRef, useState } from 'react';
import { images } from '../../assets/images';
import { colors } from '../../assets/js/colors';
import languageMap from '../../assets/js/languageMap.json';
import commonStyles from '../../assets/js/styles';
import { handleChangeLanguage } from '../../views/pageWrapperScripts';
import Sidenav from '../Sidenav/Sidenav';
import BreadCrumb from '../breadCrumb/breadCrumb';
import { navbarStyle } from './navbar.style';
import CustomButton from '../button/Button';
import NotificationButton from '../notification_button/NotificationButton';
import AvatarButton from '../avatar_button/AvatarButton';

const anchor = 'left';

forwardRef();
export default function Navbar(props) {
  const classes = makeStyles(navbarStyle)();
  const commonClasses = makeStyles(commonStyles)();
  const [state, setState] = useState({ left: false });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [left, setleft] = useState(null);

  const open = Boolean(anchorEl);
  const handleClickListItem = event => {
    const { screenY, screenX } = event;
    setleft(screenX);
    console.log(screenX, screenY);
    setAnchorEl(event.currentTarget);
  };

  const languages = Object.keys(languageMap).map((ln, index) => (
    <MenuItem key={index} value={ln}>
      {languageMap[ln]}
    </MenuItem>
  ));

  const toggleDrawer = event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ left: !state.left });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar id="navbar-root" className={classes.root}>
      <div className={classes.box}>
        <Container className={classes.container} maxWidth="lg">
          <Hidden mdUp>
            <Box onClick={toggleDrawer}>
              <MenuIcon />
            </Box>
          </Hidden>
          {/* Logo */}
          <img src={images.logo} className={classes.logo} />

          {/* Search Input */}
          <Hidden smDown>
            <OutlinedInput
              placeholder="Search"
              className={classes.input}
              startAdornment={<Search style={{ color: colors.white }} />}
            />
          </Hidden>

          {/* Language on Mobile */}
          <Box
            className={clsx(
              classes.languageContainerStyle,
              commonClasses.displayInlineFlex,
              commonClasses.alignCenter,
              commonClasses.addOnSmallScreen,
            )}
          >
            <Translate />
            <Select className={classes.languageSelectStyle} value="" onChange={e => handleChangeLanguage({ e, props })}>
              {languages}
            </Select>
          </Box>

          {/* Language on Desktop */}
          <Box
            className={clsx(
              classes.languageContainerStyle,
              commonClasses.displayInlineFlex,
              commonClasses.alignCenter,
              commonClasses.removeOnSmallScreen,
            )}
          >
            <Translate />
            <Select
              className={classes.languageSelectStyle}
              value={props.i18n.language}
              onChange={e => handleChangeLanguage({ e, props })}
            >
              {languages}
            </Select>
          </Box>

          <Hidden mdUp>
            <SearchOutlined />
          </Hidden>

          <NotificationButton />
          <Hidden smDown>
            {props.auth.username && (
              <Box>
                <Typography className={clsx(commonClasses.title2, classes.username)}>{props.auth.username}</Typography>
                <Typography className="">Student</Typography>
              </Box>
            )}
          </Hidden>

          <AvatarButton {...props} />
        </Container>
      </div>
      <Container maxWidth="lg">
        <BreadCrumb />
      </Container>

      <SwipeableDrawer anchor={anchor} open={state.left} onClose={toggleDrawer} onOpen={toggleDrawer}>
        <Sidenav />
      </SwipeableDrawer>
    </AppBar>
  );
}
