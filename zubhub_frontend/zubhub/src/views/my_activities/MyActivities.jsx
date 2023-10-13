import React, { useEffect, useMemo, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
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
import { makeStyles } from '@material-ui/core/styles';
import ErrorPage from '../error/ErrorPage';
import DefaultStyles from '../../assets/js/styles';
import { Grid, Box, Typography } from '@material-ui/core';
import LoadingPage from '../loading/LoadingPage';
const useStyles = makeStyles(styles);

function MyActivities(props) {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const { activities } = useSelector(state => state);
  const [activityList, setActivityList] = useState(props?.activities ?? []);

  const commonClasses = makeStyles(DefaultStyles)();

  useEffect(() => {
    setActivityList(activities.all_activities);
  }, [activities]);

  useEffect(() => {
    async function fetcher() {
      setLoading(true);
      await props.getMyActivities(props.auth);
      setActivityList(activities.all_activities);
      setLoading(false);
    }

    fetcher();
  }, []);

  if (loading) {
    return <LoadingPage />;
  } else {
    if (!activityList || activityList.length === 0) {
      return <ErrorPage error={props.t('activities.errors.emptyList')} />;
    } else {
      return (
        <div className={commonClasses.smallScreenPadding}>
          <Typography style={{ marginBottom: 50 }} className={commonClasses.title1}>
            My Activities
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
                    history={props.history}
                  />
                </Grid>
              ))}
          </Grid>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    activities: state.activities,
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getActivities: args => {
      return dispatch(getActivities(args));
    },
    getMyActivities: args => {
      return dispatch(getMyActivities(args));
    },
    getUnPublishedActivities: args => {
      return dispatch(getUnPublishedActivities(args));
    },
    activityToggleSave: args => {
      return dispatch(activityToggleSave(args));
    },
    setActivity: args => {
      return dispatch(setActivity(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyActivities);
