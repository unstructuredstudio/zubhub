import React from 'react';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Fab,
  Typography,
} from '@material-ui/core';

import ClapIcon, { ClapBorderIcon } from '../../assets/js/icons/ClapIcon';
import CommentIcon from '../../assets/js/icons/CommentIcon';
import playIcon from '../../assets/images/play-icon.png';
import {
  dFormatter,
  nFormatter,
  buildVideoThumbnailURL,
} from '../../assets/js/utils/scripts';
import { toggleLike, toggleSave } from './projectScripts';
import styles from '../../assets/js/styles/components/project/projectStyles';

const useStyles = makeStyles(styles);

function Project(props) {
  const classes = useStyles();

  const { project, t } = props;
  return (
    <Link to={`/projects/${project.id}`} className={classes.textDecorationNone}>
      <Card className={classes.root}>
        <CardMedia className={classes.mediaBoxStyle} title={project.title}>
          {project.video ? (
            <>
              <img
                className={classes.mediaImageStyle}
                src={buildVideoThumbnailURL(project.video)}
                alt={project.title}
              />
              <img className={classes.playIconStyle} src={playIcon} alt="" />
            </>
          ) : project.images.length > 0 ? (
            <img
              className={classes.mediaImageStyle}
              src={project.images[0].image_url}
              alt={project.title}
            />
          ) : null}
        </CardMedia>
        <CardActionArea className={classes.actionAreaStyle}>
          <CardContent
            className={clsx(classes.contentStyle, classes.positionRelative)}
          >
            <Fab
              className={classes.fabButtonStyle}
              size="small"
              aria-label="save button"
              onClick={(e, id = project.id) => toggleSave(e, id, props)}
            >
              {project.saved_by.includes(props.auth.id) ? (
                <BookmarkIcon aria-label="unsave" />
              ) : (
                <BookmarkBorderIcon aria-label="save" />
              )}
            </Fab>
            <Fab
              className={clsx(classes.fabButtonStyle, classes.likeButtonStyle)}
              size="small"
              aria-label="like button"
              variant="extended"
              onClick={(e, id = project.id) => toggleLike(e, id, props)}
            >
              {project.likes.includes(props.auth.id) ? (
                <ClapIcon arial-label="unlike" />
              ) : (
                <ClapBorderIcon arial-label="like" />
              )}
              {nFormatter(project.likes.length)}
            </Fab>
            <Typography
              className={classes.titleStyle}
              variant="h5"
              component="h2"
            >
              {project.title}
            </Typography>
            <Box className={classes.descriptionStyle}>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                component="p"
              >
                {project.description}
              </Typography>
            </Box>
            <Link
              to={`/creators/${project.creator.username}`}
              className={classes.textDecorationNone}
            >
              <Box className={classes.creatorBoxStyle}>
                <Avatar
                  className={classes.creatorAvatarStyle}
                  src={project.creator.avatar}
                  alt={project.creator.username}
                />
                <Typography
                  color="textSecondary"
                  variant="caption"
                  component="p"
                >
                  {project.creator.username}
                </Typography>
              </Box>
            </Link>
            <Box className={classes.captionStyle}>
              <Box className={classes.captionStyle}>
                <Typography
                  className={clsx(
                    classes.captionIconStyle,
                    classes.VisibilityIconStyle,
                  )}
                  color="textSecondary"
                  variant="caption"
                  component="span"
                >
                  <VisibilityIcon /> {project.views_count}
                </Typography>
                <Typography
                  className={classes.captionIconStyle}
                  color="textSecondary"
                  variant="caption"
                  component="span"
                >
                  <CommentIcon /> {project.comments_count}
                </Typography>
              </Box>
              <Typography
                color="textSecondary"
                variant="caption"
                component="span"
              >
                {`${dFormatter(project.created_on).value} ${t(
                  `date.${dFormatter(project.created_on).key}`,
                )} ${t('date.ago')}`}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}

Project.propTypes = {
  auth: PropTypes.object.isRequired,
  updateProjects: PropTypes.func.isRequired,
  toggleLike: PropTypes.func.isRequired,
  toggleSave: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
};

export default Project;
