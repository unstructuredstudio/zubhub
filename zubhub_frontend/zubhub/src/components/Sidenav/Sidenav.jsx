import {
  Link,
  Box,
  ListItemIcon,
  ListItemText,
  List,
  ListItem,
  makeStyles,
  useMediaQuery,
  CircularProgress,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { sidenavStyle } from './sidenav.styles';
import { useLocation } from 'react-router-dom';
import { RiTeamFill, RiLogoutBoxRFill } from 'react-icons/ri';
import { GiNotebook } from 'react-icons/gi';
import { images } from '../../assets/images';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/actions/authActions';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Bookmark,
  Dashboard,
  School,
  Settings,
  EmojiObjects,
  Web,
  FeaturedPlayList,
  Person,
  ExitToApp,
  Publish,
  ExpandMore,
  Image,
} from '@material-ui/icons';
import { TEAM_ENABLED } from '../../utils.js';
import API from '../../api';

const links = ({ draftCount, myProjectCount, username }) => [
  { label: 'All Projects', link: '/', icon: Dashboard },
  { label: 'Profile', link: '/profile', icon: Person, reactIcon: true, requireAuth: true },
  { label: 'Create Project', link: '/projects/create', icon: EmojiObjects },
  {
    label: `My Drafts(${draftCount})`,
    link: `/creators/${username}/drafts`,
    icon: GiNotebook,
    rightIcon: ExpandMore,
    requireAuth: true,
  },
  {
    label: `My Projects(${myProjectCount})`,
    link: `/creators/${username}/projects`,
    icon: Publish,
    rightIcon: ExpandMore,
    requireAuth: true,
  },
  { label: 'Bookmarks', link: '/projects/saved', icon: Bookmark, requireAuth: true },
  ...(TEAM_ENABLED ? [{ label: 'Teams', link: '/dashboard', icon: RiTeamFill }] : []),
  { label: 'Explore Ideas', link: 'https://kriti.unstructured.studio/', target: '_blank', icon: FeaturedPlayList },
];

const bottomLinks = [
  // { label: 'Settings', link: '/settings', icon: Settings, requireAuth: true },
  { label: 'Log Out', action: 'logout', icon: RiLogoutBoxRFill, red: true, requireAuth: true },
];

export default function Sidenav() {
  const classes = makeStyles(sidenavStyle)();
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();
  const auth = useSelector(state => state.auth);
  const [isLogginOut, setIsLogginOut] = useState(false);
  const [draftCount, setDraftCount] = useState(0);
  const [myProjectCount, setMyProjectCount] = useState(0);

  useEffect(() => {
    const api = new API();
    api.getUserDrafts({ username: auth?.username, token: auth?.token }).then(data => setDraftCount(data.count));
    api.getUserProjects({ username: auth?.username, token: auth?.token }).then(data => setMyProjectCount(data.count));
  }, []);

  const handleLogout = async () => {
    setIsLogginOut(true);
    const res = await dispatch(logout({ token: auth.token, history, t }));
    console.log(res);
  };

  const displayLink = requireAuth => {
    if (requireAuth && !auth?.token) return false;
    return true;
  };

  return (
    <div className={classes.container}>
      <List className={classes.listContainer}>
        {isSmallScreen && (
          <Link style={{ textDecoration: 'none' }} className={classes.logo} href="/">
            <ListItem>
              <img src={images.logo} />
            </ListItem>
          </Link>
        )}

        {links({ draftCount, myProjectCount, username: auth.username }).map(
          ({ label, link, icon: Icon, red, rightIcon: RightIcon, requireAuth, target }, index) =>
            displayLink(requireAuth) && (
              <Link
                key={index + label}
                className={clsx(classes.label, pathname == link && classes.active, red && classes.red)}
                style={{ textDecoration: 'none' }}
                href={link}
                target={target || '_self'}
              >
                <ListItem key={label}>
                  <ListItemIcon>
                    <Icon size={22} />
                  </ListItemIcon>
                  <ListItemText primary={label} />
                  {RightIcon && (
                    <ListItemIcon>
                      <RightIcon size={22} />
                    </ListItemIcon>
                  )}
                </ListItem>
              </Link>
            ),
        )}

        <div style={{ marginTop: 'auto' }}>
          {bottomLinks.map(
            ({ label, link, icon: Icon, red, action, requireAuth }, index) =>
              displayLink(requireAuth) && (
                <Link
                  key={index + label}
                  className={clsx(classes.label, pathname == link && classes.active, red && classes.red)}
                  style={{ textDecoration: 'none' }}
                  {...(link && { href: link })}
                  onClick={action == 'logout' ? handleLogout : null}
                >
                  <ListItem key={label}>
                    <ListItemIcon>
                      {action === 'logout' && isLogginOut ? (
                        <CircularProgress size={22} color="inherit" />
                      ) : (
                        <Icon size={22} />
                      )}
                    </ListItemIcon>
                    <ListItemText primary={label} />
                  </ListItem>
                </Link>
              ),
          )}
        </div>
      </List>
    </div>
  );
}
