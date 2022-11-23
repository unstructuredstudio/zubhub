import React, { useEffect, useState } from 'react';
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

import { Grid, Box } from '@material-ui/core';
import LoadingPage from '../loading/LoadingPage';
const useStyles = makeStyles(styles);

function Activities(props) {
  const location = useLocation();
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const { activities } = useSelector(state => state);
  let [activityList, setActivityList] = useState([]);

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
  } else {
    if (!activityList || activityList.length === 0) {
      return <ErrorPage error={props.t('activities.errors.emptyList')} />;
    } else {
      return (
        <div>
          <Grid container className={classes.activityListContainer}>
            {activityList &&
              activityList.map((activity, index) => (
                <Grid
                  key={`activityContainer-${index}`}
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
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

export default connect(mapStateToProps, mapDispatchToProps)(Activities);
