import React, { useEffect, useState, useCallback } from 'react';
import { Checkbox, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import styles from '../../../assets/js/styles';
import { step3Style } from './step3.styles';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import Project from '../../../components/project/Project';
import { Box, Paper, FormLabel } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useDispatch } from 'react-redux';
import ZubhubAPI from '../../../api/api';
const API = new ZubhubAPI();

export default function Step3({ updateSelectedProjects, formik, handleBlur, ...props }) {
  const commonClasses = makeStyles(styles)();
  const classes = makeStyles(step3Style)();
  const api = new ZubhubAPI();
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const username = props.auth.username;
  const [selectedProjects, setSelectedProjects] = useState([]);
  const dispatch = useDispatch();

  const handleProjectClick = (project, isAdded) => {
    if (isAdded) {
      setSelectedProjects(prevSelectedProjects => [...prevSelectedProjects, project]);
    } else {
      setSelectedProjects(prevSelectedProjects => prevSelectedProjects.filter(p => p.id !== project.id));
    }
  };

  const selectProjects = project => {
    const projectsTemp = [...selectedProjects];
    const projectIndex = projectsTemp.findIndex(p => p.id === project.id);

    if (projectIndex !== -1) {
      projectsTemp.splice(projectIndex, 1);
    } else {
      projectsTemp.push(project);
    }
    setSelectedProjects(projectsTemp);
    updateSelectedProjects(projectsTemp);
  };

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await API.getUserProjects({ username });
        setProjects(response.results);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }

    fetchProjects();
  }, [username]);

  console.log(selectedProjects);
  return (
    <>
      <label htmlFor="" className={commonClasses.title2}>
        Select a Project you worked on with a Team <span className={commonClasses.colorRed}>*</span>
      </label>
      {/* ... (other code) */}
      <Grid container spacing={3}>
        <Grid item xs={12} className={commonClasses.title2}>
          <FormLabel
            label={'projects'}
            required={true}
            classes={classes}
            common_classes={commonClasses}
            inputOrder={4}
            fieldLabel={'createTeam.3rdpage.title'}
          />
        </Grid>
        <Grid item xs={12} className={commonClasses.commonClasses}>
          <Paper className={classes.profileLowerStyle}>
            <Grid container spacing={3}>
              {Array.isArray(projects) &&
                projects.map(project => (
                  <Grid item xs={12} sm={6} md={6} className={classes.projectGridStyle} align="center">
                    <div style={{ position: 'relative', marginLeft: '16px', marginRight: '16px' }}>
                      <Project project={project} t={t} handleProjectClick={handleProjectClick} />
                      <div
                        className={clsx(
                          classes.overLay,
                          selectedProjects.some(p => p.id === project.id) && classes.blurOverLay,
                        )}
                        onClick={() => selectProjects(project)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        {selectedProjects.some(p => p.id === project.id) ? (
                          <span
                            style={{
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <CheckCircleIcon style={{ color: 'white', marginRight: '5px' }} />
                            Project Added
                          </span>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </Grid>
                ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
