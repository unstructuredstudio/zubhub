import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { style } from '../../assets/js/styles/components/activity/activityStyle';
import ProjectsCountIcon from '../../assets/js/icons/projectsCountIcon';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
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
  Fab,
} from '@material-ui/core';
import commonStyles from '../../assets/js/styles';
import Creator from '../creator/creator';
import { toggleSave } from './activityScripts';

const useCommonStyles = makeStyles(commonStyles);
const useStyles = makeStyles(style);
function Activity(props) {
  const { activity, t } = { ...props };
  const [tagsShowMore, setTagsShowMore] = useState(false);
  const classes = useStyles();
  const common_classes = useCommonStyles();
  const topMarginCoefficient = activity.creator?.length < 6 ? 2 : 1;
  const [state, handleSetState] = useState({ loading: false });
 
  return (
    <div className={classes.activityCardContainer}>
      {activity.creators?.length > 0
        ? activity.creators.map((creator, index) => (
            <Creator
              key={index}
              creator={creator}
              top={index * topMarginCoefficient - 1 + 'em'}
            />
          ))
        : ''}
      <Link
        to={`/activities/${activity.id}`}
        className={common_classes.textDecorationNone}
      >
      <Card className={classes.activityCard}>
        <CardMedia title={activity.title} className={classes.mediaBoxStyle}>
          <img
            src={activity.images[0] ? activity.images[0].image.file_url : ''}
            alt={activity.title}
            className={classes.activityCardImage}
          />

          <Box className={classes.activityTagsBox}>
            {activity.tags?.length > 0
              ? activity.tags.slice(0, 3).map(tag => (
                  <Typography
                    className={
                      common_classes.baseTagStyle +
                      ' ' +
                      classes.activityTagPill
                    }
                    key={tag.id}
                  >
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
                  className={
                    common_classes.baseTagStyle +
                    ' ' +
                    classes.activityTagsShowMore
                  }
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
              onClick={
                 e =>
                  toggleSave(
                    e,
                    activity.id,
                    props.auth,
                    props.history,
                    handleSetState,
                    props.activityToggleSave,
                    t,
                  )
              }
            >
              {props.auth && activity.saved_by.includes(props.auth.id) ? (
                <BookmarkIcon aria-label="unsave" />
              ) : (
                <BookmarkBorderIcon aria-label="save" />
              )}
            </Fab>
            <Box className={classes.activityCardInfoBox}>
              <Typography
                variant="h6"
                component="h6"
                className={classes.activityTitle}
              >
                {activity.title}
              </Typography>
              <Typography component="h6" className={classes.projectsCount}>
                <ProjectsCountIcon
                  className={common_classes.projectsCountIcon}
                />
                {activity.views_count}
              </Typography>
            </Box>
          </CardContent>
        </CardActions>
      </Card>
      </Link>
    </div>
  );
}

Activity.propTypes = {
  activity: PropTypes.object.isRequired,
};

export default Activity;
