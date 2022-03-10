import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import styles from '../../assets/js/styles/views/profile/profileStyles';
import commonStyles from '../../assets/js/styles';
import cn from 'classnames';
import clsx from 'clsx';
import CustomButton from '../../components/button/Button';
import {
  Typography,
  Grid,
  Paper,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux'
import * as AuthActions from '../../store/actions/authActions';
import { useHistory } from "react-router-dom";
import Project from '../../components/project/Project';
import {updateProjects} from '../../views/profile/profileScripts'

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

const ProjectsDraftsGrid = ({ props, state, profile, projects }) => {
  const classes = useStyles();
  const common_classes = useCommonStyles();
  
  // const profile = useSelector((state) => state.profile);
  // const projects = useSelector((state) => state.projects);
  

  const {t} = useTranslation();

  return (
    <Paper className={classes.profileLowerStyle}>
    <Typography
      gutterBottom
      component="h2"
      variant="h6"
      color="textPrimary"
      className={classes.titleStyle}
    >
      {t('profile.projects.label')}
      <CustomButton
        className={clsx(classes.floatRight)}
        variant="outlined"
        margin="normal"
        secondaryButtonStyle
        onClick={() =>
          props.history.push(
            `/creators/${profile.username}/projects`,
          )
        }
      >
        {t('profile.projects.viewAll')}
      </CustomButton>
    </Typography>
    <Grid container>
      {Array.isArray(projects) &&
        projects.map(project => (
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            className={classes.projectGridStyle}
            align="center"
          >
            <Project
              project={project}
              key={project.id}
              updateProjects={res =>
                updateProjects(res, state, props, toast)
                
              }
              {...props}
            />
          </Grid>
        ))}
    </Grid>
  </Paper>
  );
}

export default ProjectsDraftsGrid;