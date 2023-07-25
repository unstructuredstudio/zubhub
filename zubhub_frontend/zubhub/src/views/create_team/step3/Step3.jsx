import React, { useEffect, useState } from 'react';
// import { Dropdown } from '../../../components';
import { getCategories } from '../script';
// import { TEAM_ENABLED, getUrlQueryObject } from '../../../utils.js';
import { Checkbox, Grid, Typography, makeStyles } from '@material-ui/core';
import { colors } from '../../../assets/js/colors';
import styles from '../../../assets/js/styles';
import { step3Style } from './step3.styles';
import Project from '../../../components/project/Project';
import { Box, Paper, InputBase, FormControl, TextField, FormLabel } from '@material-ui/core';
import ZubhubAPI from '../../../api/api';
const API = new ZubhubAPI();

export default function Step3({ formik, handleBlur, ...props }) {
  const commonClasses = makeStyles(styles)();
  const classes = makeStyles(step3Style)();

  const [projects,setProjects] = React.useState([]);
  const username= props.auth.username;
  const [selectedProjects, setSelectedProjects] = useState([]);
  const handleSetState = (obj) => {
    if (obj) {
      Promise.resolve(obj).then((obj) => {
        setSelectedProjects((prevSelectedProjects) => [
          ...prevSelectedProjects,
          obj,
        ]);
      });
    }
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


  return (
    <>
      <label htmlFor="" className={commonClasses.title2}>
        Select a Project you worked on with a Team <span className={commonClasses.colorRed}>*</span>
      </label>
      {/* <Typography style={{ marginBottom: 10 }}>
        Select any of the categories that best describe your project. Select none of you are unsure about your category.
      </Typography> */}
      <Grid container spacing={3}>
      <Grid item xs={12} className={commonClasses.title2}>
      <FormLabel
            label={'materialsUsed'}
            required={true}
            classes={classes}
            common_classes={commonClasses}
            inputOrder={4}
            fieldLabel={('createTeam.3rdpage.title')}
          />
      </Grid>
      <Grid item xs={12} className={commonClasses.commonClasses}>
                <Paper className={classes.profileLowerStyle}>
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
                              updateProjects={(res) => handleSetState(project)}
                              // onProjectSelect={handleProjectSelect} 
                              // t={t} 
                              // isSelected={selectedProjects.includes(project)} 
                            />
                        </Grid>
                      ))}
                  </Grid>
                </Paper>
              
      </Grid>
      </Grid>
    </>
  );
}