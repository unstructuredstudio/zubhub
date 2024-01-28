import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { style } from '../../assets/js/styles/components/activity/activityStyle';
import {
  getActivities,
  activityToggleSave,
  setActivity,
} from '../../store/actions/activityActions';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Grid,
  Avatar,
  Tooltip,
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import commonStyles from '../../assets/js/styles';
import { dFormatter } from '../../assets/js/utils/scripts';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';

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
        onClick={e => props.setActivity(activity)}
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
              <Typography
                variant="h5"
                component="h2"
                className={classes.activityTitle}
              >
                {activity.title}
              </Typography>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                component="p"
                className={classes.activityDescription}
              >
                {activity.introduction.replace(/(<([^>]+)>)/gi, "")}
              </Typography>
              {activity.category.length > 0 && (
                <div className={classes.activityCategoryContainer}>
                  {activity.category.map(cat => (
                    <div className={classes.activityCategory}>{cat}</div>
                  ))}
                </div>
              )}
              {activity.creators?.length > 0 &&
                activity.creators.map(creator => (
                  <Link
                    to={`/creators/${creator.username}`}
                    className={common_classes.textDecorationNone}
                  >
                    <Box className={classes.creatorBox}>
                      <Avatar 
                        className={classes.creatorAvatar}
                        src={creator.avatar}
                        alt={creator.username}
                      />
                      <Tooltip
                        title={creator.username}
                        placement="bottom"
                        arrow
                        className={classes.creatorUsernameTooltip}
                      >
                        <Box>
                          <Typography
                            color="textSecondary"
                            variant="caption"
                            component="p"
                            className={classes.creatorUsername}
                          >
                            {creator.username}
                          </Typography>
                          <Typography
                            color="textPrimary"
                            className={classes.creatorTag} component="p"
                          >
                            {creator.tags[0]}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Box>
                  </Link>
                ))
              }
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
                    ${t('date.ago',)}
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

const mapStateToProps = state => {
  return {
    activities: state.activities,
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getActivities: () => {
      return dispatch(getActivities());
    },
    activityToggleSave: args => {
      return dispatch(activityToggleSave(args));
    },
    setActivity: args => {
      return dispatch(setActivity(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Activity);
