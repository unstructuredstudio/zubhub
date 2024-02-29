import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { Grid, Tab, Tabs, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
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
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const { activities } = useSelector(state => state);
  const [activityList, setActivityList] = useState({
    published: [],
    unPublishedActivities: [],
    userActivities: [],
  });
  const [tab, setTab] = useState('published');
  const commonClasses = makeStyles(DefaultStyles)();
  const { t } = props;

  useEffect(() => {
    setActivityList(activities);
  }, [activities]);

  useEffect(() => {
    setLoading(true);
    async function getActivityList() {
      if (props.auth?.tags.includes('staff')) {
        await props.getUnPublishedActivities({
          t: props.t,
          token: props.auth.token,
        });
      } else if (props.auth?.tags.includes('educator')) {
        await props.getMyActivities({
          t: props.t,
          token: props.auth.token,
        });
      }
      await props.getActivities(props.t);
    }
    getActivityList();
    setLoading(false);
  }, []);

  const handleTabChange = (event, newTab) => {
    setTab(newTab);
  };

  const ActivityCard = ({ activity }) => (
    <Grid key={activity.id} item xs={12} sm={6} lg={4} align="center" className={classes.activityBoxContainer}>
      <Activity
        key={activity.id}
        activity={activity}
        auth={props.auth}
        activityToggleSave={props.activityToggleSave}
        t={props.t}
        navigate={props.navigate}
      />
    </Grid>
  );

  if (loading) {
    return <LoadingPage />;
  } else if (!activityList || activityList.length === 0) {
    return <ErrorPage error={t('activities.errors.emptyList')} />;
  } else {
    return (
      <div className={commonClasses.smallScreenPadding}>
        <Typography className={commonClasses.title1}>{t('activities.title')}</Typography>
        {(props.auth?.tags.includes('staff') || props.auth?.tags.includes('educator')) && (
          <Tabs
            value={tab}
            onChange={handleTabChange}
            aria-label={t('activities.tabs.ariaLabel')}
            indicatorColor="primary"
            variant="fullWidth"
            className={classes.tabs}
          >
            <Tab
              value="published"
              label={`${t('activities.tabs.published')} (${activityList.published?.length})`}
              className={classes.tab}
            />
            <Tab
              value="unpublished"
              label={`${t('activities.tabs.unpublished')} (${
                props.auth?.tags.includes('staff')
                  ? activityList.unPublishedActivities?.length
                  : activityList.userActivities.filter(activity => !activity.publish).length
              })
                  `}
              className={classes.tab}
            />
          </Tabs>
        )}
        <Grid container spacing={3} className={classes.activitiesContainer}>
          {activityList.published &&
            tab === 'published' &&
            activityList.published.map(activity => <ActivityCard activity={activity} key={activity.id} />)}
          {activityList.unPublishedActivities &&
            tab === 'unpublished' &&
            props.auth?.tags.includes('staff') &&
            activityList.unPublishedActivities.map(activity => <ActivityCard activity={activity} key={activity.id} />)}
          {activityList.userActivities &&
            tab === 'unpublished' &&
            props.auth?.tags.includes('educator') &&
            activityList.userActivities
              .filter(activity => !activity.publish)
              .map(activity => <ActivityCard activity={activity} key={activity.id} />)}
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
