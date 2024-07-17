import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { Grid, Typography } from '@mui/material';
import clsx from 'clsx';

import {
  getActivities,
  getMyActivities,
  activityToggleSave,
  setActivity,
  getUnPublishedActivities,
} from '../../store/actions/activityActions';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Activity from '../../components/activity/activity';
import styles from '../../assets/js/styles/views/activities/activitiesStyles';
import ErrorPage from '../error/ErrorPage';
import DefaultStyles from '../../assets/js/styles';
import LoadingPage from '../loading/LoadingPage';

const useStyles = makeStyles(styles);

function Activities(props) {
  const location = useLocation();
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const { activities } = useSelector(state => state);
  const [activityList, setActivityList] = useState([]);

  const commonClasses = makeStyles(DefaultStyles)();

  useEffect(() => {
    setActivityList(activities.all_activities);
  }, [activities]);

  const flagMap = {
    staff: () =>
      props.getUnPublishedActivities({
        t: props.t,
        token: props.auth.token,
      }),
    educator: () =>
      props.getMyActivities({
        t: props.t,
        token: props.auth.token,
      }),
  };
  useEffect(async () => {
    setLoading(true);
    if (location.state?.flag && flagMap[location.state.flag]) {
      await flagMap[location.state.flag]();
    } else {
      await props.getActivities(props.t);
    }
    setActivityList(activities.all_activities);
    setLoading(false);
  }, [location]);

  if (loading) {
    return <LoadingPage />;
  } else if (!activityList || activityList.length === 0) {
    return <ErrorPage error={props.t('activities.errors.emptyList')} />;
  } else {
    return (
      <div className={clsx(classes.activityListContainer, commonClasses.smallScreenPadding)}>
        <Typography style={{ marginBottom: 50 }} className={commonClasses.title1}>
          Activities
        </Typography>
        <Grid container spacing={3}>
          {activityList &&
            activityList.map((activity, index) => (
              <Grid
                key={`activityContainer-${index}`}
                item
                xs={12}
                sm={6}
                lg={4}
                align="center"
                className={classes.activityBoxContainer}
              >
                <Activity
                  key={`activity-${index}`}
                  activity={activity}
                  auth={props.auth}
                  activityToggleSave={props.activityToggleSave}
                  t={props.t}
                  navigate={props.navigate}
                />
              </Grid>
            ))}
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activities: state.activities,
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  getActivities: args => dispatch(getActivities(args)),
  getMyActivities: args => dispatch(getMyActivities(args)),
  getUnPublishedActivities: args => dispatch(getUnPublishedActivities(args)),
  activityToggleSave: args => dispatch(activityToggleSave(args)),
  setActivity: args => dispatch(setActivity(args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Activities);
