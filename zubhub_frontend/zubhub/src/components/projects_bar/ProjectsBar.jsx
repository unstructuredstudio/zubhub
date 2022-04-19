import React from 'react';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import VisibilityIcon from '@material-ui/icons/Visibility';
import LockIcon from '@material-ui/icons/Lock';
import PublicIcon from '@material-ui/icons/Public';
import {
  Tooltip,
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Fab,
  Typography,
  Container,
} from '@material-ui/core';
import Project from '../project/Project';

import ClapIcon, { ClapBorderIcon } from '../../assets/js/icons/ClapIcon';
import CommentIcon from '../../assets/js/icons/CommentIcon';
import playIcon from '../../assets/images/play-icon.png';
import {
  dFormatter,
  nFormatter,
  buildVideoThumbnailURL,
  isBaseTag,
} from '../../assets/js/utils/scripts';
import { publish_type } from '../../assets/js/utils/constants';
// import {
//   toggleLike,
//   toggleSave,
//   formatProjectDescription,
//   getPublishTypeLabel,
// } from './projectScripts';
import commonStyles from '../../assets/js/styles';
import styles from '../../assets/js/styles/components/projectsbar/projectsBarStyles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function ProjectsBar({ projects }) {
  const classes = useStyles();

  return (
    <Container className={classes.projectsBarWrapperStyle}>
      <Typography variant="h5" className={classes.descriptionHeadingStyle}>
        Recommended Projects
      </Typography>
      <Container className={classes.projectsBarInnerWrapperStyle}>
        Hello
        {console.log(projects)}
        {projects.map(project => (
          <Project
            project={project}
            key={project.id}
            updateProjects={res =>
              handleSetState(updateProjects(res, props, toast))
            }
            {...props}
          />
        ))}
      </Container>
    </Container>
  );
}

export default ProjectsBar;
