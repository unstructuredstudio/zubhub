import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { makeStyles } from '@material-ui/core/styles';
import styles from '../../assets/js/styles/components/hamburger_menu/hamburgerMenuStyles.js';
import commonStyles from '../../assets/js/styles';
import cn from 'classnames';
import clsx from 'clsx';
import { Typography, Drawer, Avatar, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import * as AuthActions from '../../store/actions/authActions';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

const HamburgerMenu = ({ setDropdownOpen, dropdownOpen }) => {
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
      onClick={() => {
        if (!dropdownOpen) {
          setHamburgerMenuOpen(!hamburgerMenuOpen);
        }
        setDropdownOpen(false);
      }}
      color="secondary"
    >
      {dropdownOpen ? <KeyboardArrowUpIcon /> : <MenuIcon />}
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
        to="/profile"
        className={classes.menuItemStyle}
        style={{ textDecoration: 'none' }}
        onClick={() => setHamburgerMenuOpen(false)}
      >
        <MenuItem className={classes.paddingItem}>
          <Typography variant="subtitle2" color="textPrimary" component="span">
            {t('pageWrapper.navbar.profile')}
          </Typography>
        </MenuItem>
      </Link>
      <Link
        to="/projects/create"
        className={classes.menuItemStyle}
        style={{ textDecoration: 'none' }}
        onClick={() => setHamburgerMenuOpen(false)}
      >
        <MenuItem className={classes.paddingItem}>
          <Typography variant="subtitle2" color="textPrimary" component="span">
            {t('pageWrapper.navbar.createProject')}
          </Typography>
        </MenuItem>
      </Link>
      {auth.tags.filter(tag => tag === 'staff' || tag === 'educator').length >
        0 && (
        <Link
          to="/activities/create"
          className={clsx(
            classes.menuItemStyle,
            common_classes.textDecorationNone,
          )}
          onClick={() => setHamburgerMenuOpen(false)}
        >
          <MenuItem
            className={clsx(
              common_classes.addOnSmallScreen,
              classes.paddingItem,
            )}
          >
            <Typography
              variant="subtitle2"
              color="textPrimary"
              component="span"
            >
              {t('pageWrapper.navbar.createActivityMenu')}
            </Typography>
          </MenuItem>
        </Link>
      )}
      <div
        className={classes.menuItemStyle}
        style={{ textDecoration: 'none' }}
        onClick={() => {
          setDropdownOpen(true);
          setHamburgerMenuOpen(false);
        }}
      >
        <MenuItem className={classes.paddingItem}>
          <Typography variant="subtitle2" color="textPrimary" component="span">
            Notifications
          </Typography>
        </MenuItem>
      </div>
      <Link
        to={`/creators/${auth.username}/projects`}
        className={classes.menuItemStyle}
        style={{ textDecoration: 'none' }}
        onClick={() => setHamburgerMenuOpen(false)}
      >
        <MenuItem className={classes.paddingItem}>
          <Typography variant="subtitle2" color="textPrimary" component="span">
            {t('pageWrapper.navbar.projects')}
          </Typography>
        </MenuItem>
      </Link>
      <Link
        to={`/creators/${auth.username}/followers`}
        className={classes.menuItemStyle}
        style={{ textDecoration: 'none' }}
        onClick={() => setHamburgerMenuOpen(false)}
      >
        <MenuItem className={classes.paddingItem}>
          <Typography variant="subtitle2" color="textPrimary" component="span">
            {t('pageWrapper.navbar.followers')}
          </Typography>
        </MenuItem>
      </Link>
      <Link
        to={`/creators/${auth.username}/following`}
        className={classes.menuItemStyle}
        style={{ textDecoration: 'none' }}
        onClick={() => setHamburgerMenuOpen(false)}
      >
        <MenuItem className={classes.paddingItem}>
          <Typography variant="subtitle2" color="textPrimary" component="span">
            {t('pageWrapper.navbar.following')}
          </Typography>
        </MenuItem>
      </Link>
      <Link
        to="/projects/saved"
        className={classes.menuItemStyle}
        style={{ textDecoration: 'none' }}
        onClick={() => setHamburgerMenuOpen(false)}
      >
        <MenuItem className={classes.paddingItem}>
          <Typography variant="subtitle2" color="textPrimary" component="span">
            {t('pageWrapper.navbar.savedProjects')}
          </Typography>
        </MenuItem>
      </Link>
      <MenuItem
        className={clsx(
          classes.logOutStyle,
          common_classes.textDecorationNone,
        )}
        onClick={() =>
          dispatch(AuthActions.logout({ token: auth.token, history, t }))
        }
      >
        <Typography
          className={clsx(common_classes.colorRed, classes.paddingItem)}
          variant="subtitle2"
          component="span"
        >
          {t('pageWrapper.navbar.logout')}
        </Typography>
      </MenuItem>
    </Drawer>,
  ];
};

export default HamburgerMenu;
