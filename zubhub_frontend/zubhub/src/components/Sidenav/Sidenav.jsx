import { Link, Box, ListItemIcon, ListItemText, List, ListItem, makeStyles, useMediaQuery } from '@material-ui/core';
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
import React from 'react';
import clsx from 'clsx';
import { sidenavStyle } from './sidenav.styles';
import { useLocation } from 'react-router-dom';
import { RiTeamFill, RiLogoutBoxRFill } from 'react-icons/ri';
import { GiNotebook } from 'react-icons/gi';
import { images } from '../../assets/images';

const links = ({ draftCount, projectCount }) => [
  { label: 'All Projects', link: '/dashboard', icon: Dashboard },
  { label: 'Profile', link: '/profile', icon: Person, reactIcon: true },
  { label: 'Create Project', link: '/projects/create', icon: EmojiObjects },
  { label: `My Drafts(${draftCount})`, link: '/activities', icon: GiNotebook, rightIcon: ExpandMore },
  { label: `My Projects(${projectCount})`, link: '/dashboard', icon: Publish, rightIcon: ExpandMore },
  { label: 'Bookmarks', link: '/dashboard', icon: Bookmark },
  { label: 'Teams', link: '/dashboard', icon: RiTeamFill },
  { label: 'Explore Ideas', link: '#', icon: FeaturedPlayList },
];

const bottomLinks = [
  { label: 'Settings', link: '/profile', icon: Settings },
  { label: 'Log Out', link: '/profile', icon: RiLogoutBoxRFill, red: true },
];

export default function Sidenav() {
  const classes = makeStyles(sidenavStyle)();
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const { pathname } = useLocation();

  return (
    <div className={classes.container}>
      <List className={classes.listContainer}>
        {isSmallScreen && (
          <Link style={{ textDecoration: 'none' }} className={classes.logo} href="/">
            <ListItem disablePadding>
              <img src={images.logo} />
            </ListItem>
          </Link>
        )}

        {links({ draftCount: 2, projectCount: 1 }).map(
          ({ label, link, icon: Icon, red, rightIcon: RightIcon }, index) => (
            <Link
              key={index + label}
              className={clsx(classes.label, pathname == link && classes.active, red && classes.red)}
              style={{ textDecoration: 'none' }}
              href={link}
            >
              <ListItem key={label} disablePadding>
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
          {bottomLinks.map(({ label, link, icon: Icon, red }, index) => (
            <Link
              key={index + label}
              className={clsx(classes.label, pathname == link && classes.active, red && classes.red)}
              style={{ textDecoration: 'none' }}
              href={link}
            >
              <ListItem key={label} disablePadding>
                <ListItemIcon>
                  <Icon size={22} />
                </ListItemIcon>
                <ListItemText primary={label} />
              </ListItem>
            </Link>
          ))}
        </div>
      </List>
    </div>
  );
}
