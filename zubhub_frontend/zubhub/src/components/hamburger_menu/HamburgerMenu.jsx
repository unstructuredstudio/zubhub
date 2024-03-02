import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { makeStyles } from '@mui/styles';
import styles from '../../assets/js/styles/components/hamburger_menu/hamburgerMenuStyles.js';
import commonStyles from '../../assets/js/styles';
import cn from 'classnames';
import clsx from 'clsx';
import { Typography, Drawer, Avatar, MenuItem, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import * as AuthActions from '../../store/actions/authActions';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

const HamburgerMenu = ({ setDropdownOpen, dropdownOpen }) => {
  const classes = useStyles();
  const common_classes = useCommonStyles();
  const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  return [
    <IconButton
      className={cn(classes.hamburgerButtonStyle, common_classes.addOnSmallScreen)}
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
      {auth.tags.filter(tag => tag === 'staff' || tag === 'educator').length > 0 && (
        <>
          <Link
            to="/activities/create"
            className={clsx(classes.menuItemStyle, common_classes.textDecorationNone)}
            onClick={() => setHamburgerMenuOpen(false)}
          >
            <MenuItem className={clsx(common_classes.addOnSmallScreen, classes.paddingItem)}>
              <Typography variant="subtitle2" color="textPrimary" component="span">
                {t('pageWrapper.navbar.createActivityMenu')}
              </Typography>
            </MenuItem>
          </Link>
          <Box className={clsx(classes.menuItemStyle, common_classes.addOnSmallScreen)}>
            <MenuItem
              className={clsx(classes.paddingItem)}
              onClick={() => {
                navigate('/activities', { state: { flag: 'educator' } });
                setHamburgerMenuOpen(false);
              }}
            >
              <Typography variant="subtitle2" color="textPrimary" component="span">
                {t('pageWrapper.navbar.myActivities')}
              </Typography>
            </MenuItem>
          </Box>
        </>
      )}
      {auth.tags.filter(tag => tag === 'staff' || tag === 'moderator').length > 0 && (
        <Box className={clsx(common_classes.addOnSmallScreen, classes.menuItemStyle)}>
          <MenuItem
            className={clsx(classes.paddingItem)}
            onClick={() => {
              navigate('/activities', { state: { flag: 'staff' } });
              setHamburgerMenuOpen(false);
            }}
          >
            <Typography variant="subtitle2" color="textPrimary" component="span">
              {t('pageWrapper.navbar.unpublishedActivities')}
            </Typography>
          </MenuItem>
        </Box>
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
        className={clsx(classes.logOutStyle, common_classes.textDecorationNone)}
        onClick={() => dispatch(AuthActions.logout({ token: auth.token, navigate, t }))}
      >
        <Typography className={clsx(common_classes.colorRed, classes.paddingItem)} variant="subtitle2" component="span">
          {t('pageWrapper.navbar.logout')}
        </Typography>
      </MenuItem>
    </Drawer>,
  ];
};

export default HamburgerMenu;
