import { Grid, Hidden, makeStyles } from '@material-ui/core';
import React from 'react';
import Sidenav from '../../components/Sidenav/Sidenav';
import { dashboardLayoutStyles } from './dashboardLayout.styles';
import { useDomElementHeight } from '../../hooks/useDomElementHeight.hook';

export default function DashboardLayout({ children }) {
  const { height } = useDomElementHeight('navbar-root');

  const classes = makeStyles(dashboardLayoutStyles)({ height });
  return (
    <Grid className={classes.root} container>
      <Hidden smDown>
        <Grid style={{ position: 'relative' }} item md={4} lg={3}>
          <Sidenav />
        </Grid>
      </Hidden>
      <Grid item xs={12} md={8} lg={9}>
        <div className={classes.body}>{children}</div>
      </Grid>
    </Grid>
  );
}
