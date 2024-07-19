import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';
import { Card, CardActions, CardContent, CardMedia, Typography, Box } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import { style } from '../../assets/js/styles/components/activity/activityStyle';
import { getActivities, activityToggleSave, setActivity } from '../../store/actions/activityActions';
import commonStyles from '../../assets/js/styles';
import { dFormatter } from '../../assets/js/utils/scripts';
import Categories from '../categories/Categories';
import Creators from '../creators/Creators';

const useCommonStyles = makeStyles(commonStyles);
const useStyles = makeStyles(style);
function Activity(props) {
  const { activity, t } = { ...props };
  const classes = useStyles();
  const common_classes = useCommonStyles();
  return (
    <div className={classes.activityCardContainer}>
      <Link
        to={`/activities/${activity.id}`}
        className={common_classes.textDecorationNone}
        onClick={() => props.setActivity(activity)}
      >
        <Card className={clsx(classes.activityCard)}>
          <CardMedia title={activity.title} className={classes.mediaBoxStyle}>
            <img
              src={activity.images[0] ? activity.images[0].image.file_url : ''}
              alt={activity.title}
              className={classes.activityCardImage}
            />
          </CardMedia>
          <CardActions>
            <CardContent className={classes.activityCardContent}>
              <Typography variant="h5" component="h2" className={classes.activityTitle}>
                {activity.title}
              </Typography>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                component="p"
                className={classes.activityDescription}
              >
                {activity.introduction.replace(/(<([^>]+)>)/gi, '')}
              </Typography>
              {activity.category.length > 0 && <Categories categories={activity.category} />}
              <Creators creators={activity?.creators} />
              <Box className={classes.footer}>
                <Box className={classes.captionStyle}>
                  <Typography
                    className={classes.captionIconStyle}
                    color="textSecondary"
                    variant="caption"
                    component="span"
                  >
                    <VisibilityIcon /> {activity.views_count}
                  </Typography>
                  <Typography
                    className={classes.captionIconStyle}
                    color="textSecondary"
                    variant="caption"
                    component="span"
                  >
                    <EmojiObjectsIcon /> {activity.inspired_projects.length}
                  </Typography>
                </Box>
                <Typography color="textSecondary" variant="caption" component="span" className={classes.date}>
                  {`
                    ${dFormatter(activity.created_on).value}
                    ${t(`date.${dFormatter(activity.created_on).key}`)}
                    ${t('date.ago')}
                  `}
                </Typography>
              </Box>
            </CardContent>
          </CardActions>
        </Card>
        {activity.publish ? '' : <Box className={classes.opacity}></Box>}
      </Link>
    </div>
  );
}

Activity.propTypes = {
  activity: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({ activities: state.activities, auth: state.auth });

const mapDispatchToProps = dispatch => ({
  getActivities: () => dispatch(getActivities()),
  activityToggleSave: args => dispatch(activityToggleSave(args)),
  setActivity: args => dispatch(setActivity(args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Activity);
