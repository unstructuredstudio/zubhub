import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Grid,
  Fab,
} from '@mui/material';

import { getActivities, activityToggleSave, setActivity } from '../../store/actions/activityActions';
import commonStyles from '../../assets/js/styles';
import Creator from '../creator/creator';
import { toggleSave } from './activityScripts';
import { style } from '../../assets/js/styles/components/activity/activityStyle';

const useCommonStyles = makeStyles(commonStyles);
const useStyles = makeStyles(style);
function Activity(props) {
  const { activity, t } = { ...props };
  const [tagsShowMore, setTagsShowMore] = useState(false);
  const classes = useStyles();
  const common_classes = useCommonStyles();
  const topMarginCoefficient = activity.creator?.length < 6 ? 2 : 1;

  return (
    <div className={classes.activityCardContainer}>
      {activity.creators?.length > 0
        ? activity.creators.map((creator, index) => (
            <Creator key={index} creator={creator} top={`${index * topMarginCoefficient - 1}em`} />
          ))
        : ''}
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

            <Box className={classes.activityTagsBox}>
              {activity.tags?.length > 0
                ? activity.tags.slice(0, 3).map(tag => (
                    <Typography className={clsx(common_classes.baseTagStyle, classes.activityTagPill)} key={tag.id}>
                      {tag.name}
                    </Typography>
                  ))
                : ''}
              {activity.tags?.length > 3 ? (
                <div
                  className={classes.tagsShowMoreIconContainer}
                  onMouseOver={() => setTagsShowMore(true)}
                  onMouseOut={() => setTagsShowMore(false)}
                >
                  <Typography
                    className={clsx(common_classes.baseTagStyle, classes.activityTagsShowMore)}
                    key="activityTagsShowMore"
                  >
                    {['+', activity.tags.length - 3].join('')}
                  </Typography>
                </div>
              ) : (
                ''
              )}
            </Box>

            {tagsShowMore ? (
              <Box
                className={classes.tagsShowMoreList}
                onMouseEnter={() => setTagsShowMore(true)}
                onMouseLeave={() => setTagsShowMore(false)}
              >
                <List
                  sx={{
                    width: '100%',
                    maxWidth: '150px',
                    backgroundColor: 'background.paper',

                    '& ul': { padding: 0 },
                  }}
                >
                  {activity.tags?.map(tag => (
                    <ListItem key={`tag-${tag.id}`}>
                      <ListItemText primary={tag.name} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ) : (
              ''
            )}
          </CardMedia>
          <CardActions>
            <CardContent className={classes.activityCardContent}>
              <Fab
                className={common_classes.fabButtonStyle}
                size="small"
                aria-label="save button"
                onClick={e => toggleSave(e, activity.id, props.auth, props.navigate, props.activityToggleSave, t)}
              >
                {props.auth && activity.saved_by.includes(props.auth.id) ? (
                  <BookmarkIcon aria-label="unsave" />
                ) : (
                  <BookmarkBorderIcon aria-label="save" />
                )}
              </Fab>
              <Grid container className={clsx(classes.activityCardInfoBox, common_classes.alignCenter)}>
                <Grid item xs={6} sm={6}>
                  <Typography variant="h6" component="h6" className={classes.activityTitle}>
                    {activity.title}
                  </Typography>
                </Grid>
                <Grid item>
                  <Link
                    to={`/activities/${activity.id}/linkedProjects`}
                    className={common_classes.textDecorationNone}
                    onClick={() => props.setActivity(activity)}
                  >
                    <Typography variant="caption" className={classes.projectsCount}>
                      {`${t('activities.LinkedProjects')} `}{' '}
                      <span className={classes.projectsCountNumber}>{` ${activity.inspired_projects.length}`}</span>
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
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
