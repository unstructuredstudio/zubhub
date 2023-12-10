import React, { useState } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';
import { makeStyles } from '@mui/styles';
import { Grid, Typography, Container } from '@mui/material';
import { toast } from 'react-toastify';
import ErrorPage from '../error/ErrorPage';
import Project from '../../components/project/Project';
import { updateProjects } from './LinkedProjectsScripts';
import * as ProjectActions from '../../store/actions/projectActions';
import styles from '../../assets/js/styles/views/user_projects/userProjectsStyles';

const useStyles = makeStyles(styles);

function LinkedProjects(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { activities, auth } = useSelector(state => state);
  const dispatch = useDispatch();
  console.log('selected activity object', activities.selectedActivity);
  const [state, setState] = useState({
    loading: true,
    projects: activities.selectedActivity.inspired_projects ? activities.selectedActivity.inspired_projects : [],
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };
  if (state.projects && state.projects.length > 0) {
    return (
      <Container className={classes.mainContainerStyle}>
        <Grid container>
          <Grid item xs={12}>
            <Typography className={classes.pageHeaderStyle} variant="h3" gutterBottom>
              {`${activities.selectedActivity.title}  ${t('activities.LinkedProjects')}`}
            </Typography>
          </Grid>
          {state.projects.map(project => (
            <Grid item xs={12} sm={6} md={4} align="center" className={classes.projectGridStyle}>
              <Project
                project={project}
                key={project.id}
                updateProjects={res => handleSetState(updateProjects(res, state.projects, props, toast))}
                toggleLike={props => dispatch(ProjectActions.toggleLike(props))}
                toggleSave={props => dispatch(ProjectActions.toggleSave(props))}
                auth={auth}
                t={t}
                {...props}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  } else {
    return <ErrorPage error={t('activities.errors.LinkedProjects')} />;
  }
}

export default LinkedProjects;
