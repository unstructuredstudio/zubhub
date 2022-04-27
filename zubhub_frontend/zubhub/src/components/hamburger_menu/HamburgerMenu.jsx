import React, { useState, useCallback } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import styles from '../../assets/js/styles/components/hamburger_menu/hamburgerMenuStyles.js';
import commonStyles from '../../assets/js/styles';
import cn from 'classnames';
import clsx from 'clsx';
import { Typography, Drawer, Link, Avatar, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import * as AuthActions from '../../store/actions/authActions';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

const HamburgerMenu = () => {
  const classes = useStyles();
  const common_classes = useCommonStyles();

  const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  return [
    <IconButton
      className={cn(
        classes.hamburgerButtonStyle,
        common_classes.addOnSmallScreen,
      )}
      aria-label="hamburger_menu"
      aria-haspopup="true"
      onClick={() => setHamburgerMenuOpen(!hamburgerMenuOpen)}
    >
      <MenuIcon />
    </IconButton>,
    <Drawer
      className={classes.hamburgerSidebarStyle}
      id="hamburger_menu"
      open={hamburgerMenuOpen}
      onClose={() => setHamburgerMenuOpen(false)}
      anchor={'top'}
      style={{ zIndex: 1250 }}
      transitionDuration={0}
    >
      <MenuItem className={classes.avatarItemStyle}>
        <Avatar
          className={clsx(classes.avatarStyle)}
          aria-label={`${auth.username}' Avatar`}
          src={auth.avatar}
          alt={auth.username}
        />
        <Typography variant="h6" color="textPrimary" component="span">
          {auth.username}
        </Typography>
      </MenuItem>
      <Link
        href="/profile"
        className={classes.menuItemStyle}
        style={{ textDecoration: 'none' }}
      >
        <MenuItem className={classes.paddingItem}>
          <Typography variant="subtitle2" color="textPrimary" component="span">
            {t('pageWrapper.navbar.profile')}
          </Typography>
        </MenuItem>
      </Link>
      <Link
        href="/projects/create"
        className={classes.menuItemStyle}
        style={{ textDecoration: 'none' }}
      >
        <MenuItem className={classes.paddingItem}>
          <Typography variant="subtitle2" color="textPrimary" component="span">
            {t('pageWrapper.navbar.createProject')}
          </Typography>
        </MenuItem>
      </Link>
      <Link
        className={classes.menuItemStyle}
        style={{ textDecoration: 'none' }}
        onCl
      >
        <MenuItem className={classes.paddingItem}>
          <Typography variant="subtitle2" color="textPrimary" component="span">
            Notifications
          </Typography>
        </MenuItem>
      </Link>
      <Link
        href={`/creators/${auth.username}/projects`}
        className={classes.menuItemStyle}
        style={{ textDecoration: 'none' }}
      >
        <MenuItem className={classes.paddingItem}>
          <Typography variant="subtitle2" color="textPrimary" component="span">
            {t('pageWrapper.navbar.projects')}
          </Typography>
        </MenuItem>
      </Link>
      <Link
        href={`/creators/${auth.username}/followers`}
        className={classes.menuItemStyle}
        style={{ textDecoration: 'none' }}
      >
        <MenuItem className={classes.paddingItem}>
          <Typography variant="subtitle2" color="textPrimary" component="span">
            {t('pageWrapper.navbar.followers')}
          </Typography>
        </MenuItem>
      </Link>
      <Link
        href={`/creators/${auth.username}/following`}
        className={classes.menuItemStyle}
        style={{ textDecoration: 'none' }}
      >
        <MenuItem className={classes.paddingItem}>
          <Typography variant="subtitle2" color="textPrimary" component="span">
            {t('pageWrapper.navbar.following')}
          </Typography>
        </MenuItem>
      </Link>
      <Link
        href="/projects/saved"
        className={classes.menuItemStyle}
        style={{ textDecoration: 'none' }}
      >
        <MenuItem className={classes.paddingItem}>
          <Typography variant="subtitle2" color="textPrimary" component="span">
            {t('pageWrapper.navbar.savedProjects')}
          </Typography>
        </MenuItem>
      </Link>
      <Link
        className={cn(classes.logOutStyle)}
        style={{ textDecoration: 'none' }}
        onClick={() =>
          dispatch(AuthActions.logout({ token: auth.token, history, t }))
        }
      >
        <MenuItem className={classes.paddingItem}>
          <Typography
            className={common_classes.colorRed}
            variant="subtitle2"
            component="span"
          >
            {t('pageWrapper.navbar.logout')}
          </Typography>
        </MenuItem>
      </Link>
    </Drawer>,
  ];
};

export default HamburgerMenu;
