import { Link, Box, ListItemIcon, ListItemText, List, ListItem, makeStyles } from '@material-ui/core';
import { Bookmark, Dashboard, School, Settings, EmojiObjects, Web, FeaturedPlayList } from '@material-ui/icons';
import React from 'react';
import clsx from 'clsx';
import { sidenavStyle } from './sidenav.styles';
import { useLocation } from 'react-router-dom';

const links = [
  { label: 'Dashboard', link: '/dashboard', icon: Dashboard },
  { label: 'Create Project', link: '/projects/create', icon: EmojiObjects },
  { label: 'Browse Activities', link: '/activities', icon: Web },
  { label: 'Explore Ideas', link: '#', icon: FeaturedPlayList },
  { label: 'Be our Ambassador', link: '/dashboard', icon: School },
  { label: 'Bookmarks', link: '/dashboard', icon: Bookmark },
  { label: 'Settings', link: '/profile', icon: Settings },
];

export default function Sidenav() {
  const classes = makeStyles(sidenavStyle)();
  const { pathname } = useLocation();

  return (
    <div className={classes.container}>
      <List>
        {links.map(({ label, link, icon: Icon }, index) => (
          <Link
            key={index}
            className={clsx(classes.label, pathname == link && classes.active)}
            style={{ textDecoration: 'none' }}
            href={link}
          >
            <ListItem key={label} disablePadding>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItem>
          </Link>
        ))}
      </List>
    </div>
  );
}
