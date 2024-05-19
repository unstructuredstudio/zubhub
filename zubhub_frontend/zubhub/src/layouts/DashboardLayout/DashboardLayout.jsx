import { makeStyles } from '@mui/styles';
import { Grid, Hidden } from '@mui/material';
import React from 'react';
import Sidenav from '../../components/Sidenav/Sidenav';
import { dashboardLayoutStyles } from './dashboardLayout.styles';

export default function DashboardLayout({ children }) {
  const classes = makeStyles(dashboardLayoutStyles)();
  return (
    <Grid className={classes.root} container>
      <Hidden mdDown>
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
