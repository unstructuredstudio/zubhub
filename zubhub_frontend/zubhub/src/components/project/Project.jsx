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
import nFormatter from '../../assets/js/nFormatter';
import dFormatter from '../../assets/js/dFormatter';
import styles from '../../assets/js/styles/components/project/projectStyles';

const useStyles = makeStyles(styles);

function Project(props) {
  const classes = useStyles();

  const toggle_like = (e, id) => {
    e.preventDefault();
    if (!props.auth.token) {
      props.history.push('/login');
    } else {
      const toggle_like_promise = props.toggle_like({
        id,
        token: props.auth.token,
      });
      props.updateProjects(toggle_like_promise);
    }
  };

  const toggle_save = (e, id) => {
    e.preventDefault();
    if (!props.auth.token) {
      props.history.push('/login');
    } else {
      const toggle_save_promise = props.toggle_save({
        id,
        token: props.auth.token,
      });
      props.updateProjects(toggle_save_promise);
    }
  };

  const { project, t } = props;
  return (
    <Link to={`/projects/${project.id}`} className={classes.textDecorationNone}>
      <Card className={classes.root}>
        <CardMedia className={classes.mediaBoxStyle} title={project.title}>
          {project.video ? (
            <iframe
              className={classes.mediaStyle}
              title={project.title}
              src={project.video}
            ></iframe>
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
              onClick={(e, id = project.id) => toggle_save(e, id)}
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
              onClick={(e, id = project.id) => toggle_like(e, id)}
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
            <Typography
              className={classes.descriptionStyle}
              variant="subtitle2"
              color="textSecondary"
              component="p"
            >
              {project.description}
            </Typography>
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
                  `project.${dFormatter(project.created_on).key}`,
                )} ${t('project.ago')}`}
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
  toggle_like: PropTypes.func.isRequired,
  toggle_save: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
};

export default Project;
