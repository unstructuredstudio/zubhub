import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { makeStyles } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import { Typography, Container } from '@material-ui/core';
import Project from '../project/Project';

import styles from '../../assets/js/styles/components/projectsbar/projectsBarStyles';
import { toast } from 'react-toastify';

const useStyles = makeStyles(styles);

function ProjectsBar({ projects, ...props }) {
  console.log(props);
  const classes = useStyles();
  const mediaQuery = useMediaQuery('(max-width: 600px)');

  return (
    <Container className={classes.projectsBarWrapperStyle}>
      <Typography variant="h5" className={classes.descriptionHeadingStyle}>
        {mediaQuery ? 'Recommended' : 'Recommended Projects'}
      </Typography>
      <Container
        className={
          mediaQuery
            ? classes.projectsMobileBarInnerWrapperStyle
            : classes.projectsBarInnerWrapperStyle
        }
      >
        {projects.map(project => (
          <Project project={project} key={project.id} {...props} />
        ))}
      </Container>
    </Container>
  );
}

export default ProjectsBar;
