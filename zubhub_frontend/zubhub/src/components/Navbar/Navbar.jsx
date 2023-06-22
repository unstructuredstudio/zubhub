import {
  AppBar,
  Container,
  makeStyles,
  Box,
  Select,
  MenuItem,
  Avatar,
  Typography,
  OutlinedInput,
  Hidden,
  SwipeableDrawer,
} from '@material-ui/core';
import React, { useState } from 'react';
import { images } from '../../assets/images';
import { Translate, Notifications, Search, Menu, SearchOutlined } from '@material-ui/icons';
import { navbarStyle } from './navbar.style';
import commonStyles from '../../assets/js/styles';
import languageMap from '../../assets/js/languageMap.json';
import { handleChangeLanguage } from '../../views/pageWrapperScripts';
import clsx from 'clsx';
import Autocomplete from '../autocomplete/Autocomplete';
import { colors } from '../../assets/js/colors';
import HamburgerMenu from '../hamburger_menu/HamburgerMenu';
import Sidenav from '../Sidenav/Sidenav';

const anchor = 'left';

export default function Navbar(props) {
  const classes = makeStyles(navbarStyle)();
  const commonClasses = makeStyles(commonStyles)();
  const [state, setState] = useState({ left: false });

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

  return (
    <AppBar className={classes.box}>
      <Container className={classes.container} maxWidth="lg">
        <Hidden mdUp>
          <Box onClick={toggleDrawer}>
            <Menu />
          </Box>
        </Hidden>
        {/* Logo */}
        <img src={images.logo} className={classes.logo} />

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
            // value={props.i18n.language}
            onChange={e => handleChangeLanguage({ e, props })}
          >
            {languages}
          </Select>
        </Box>

        <Hidden mdUp>
          <SearchOutlined />
        </Hidden>

        <Hidden smDown>
          <div className={clsx(classes.notification, commonClasses.iconBox)}>
            <Notifications style={{ color: colors.primary, fontSize: 20 }} />
          </div>

          <Box>
            <Typography className={clsx(commonClasses.title2, classes.username)}>Faridah Ade</Typography>
            <Typography className="">Student</Typography>
          </Box>
        </Hidden>
        <Avatar className={commonClasses.iconBox} alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
      </Container>
      <SwipeableDrawer anchor={anchor} open={state.left} onClose={toggleDrawer} onOpen={toggleDrawer}>
        {/* <Typography>Hello</Typography> */}
        <Sidenav />
      </SwipeableDrawer>
    </AppBar>
  );
}
