import React, { useEffect, useState } from 'react';
import { Checkbox, Grid, Typography, makeStyles } from '@material-ui/core';
import styles from '../../../assets/js/styles';
import { step3Style } from './step3.styles';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import Project from '../../../components/project/Project';
import { Box, Paper, FormLabel } from '@material-ui/core';
import ZubhubAPI from '../../../api/api';
const API = new ZubhubAPI();


export default function Step3({ formik, handleBlur, ...props }) {
  const commonClasses = makeStyles(styles)();
  const classes = makeStyles(step3Style)();
  const api = new ZubhubAPI();
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const username = props.auth.username;
  const [selectedProjects, setSelectedProjects] = useState([]);

  const handleProjectClick = (project, isAdded) => {
    if (isAdded) {
      setSelectedProjects((prevSelectedProjects) => [...prevSelectedProjects, project]);
    } else {
      setSelectedProjects((prevSelectedProjects) => prevSelectedProjects.filter((p) => p.id !== project.id));
    }
  };

  const selectProjects=(project) =>{
    const projectsTemp = [...selectedProjects];
    const projectIndex= projectsTemp.findIndex((p)=>p==project.id);
    if(projectIndex!==-1){
      projectsTemp.splice(projectIndex,1);
    } else{
      projectsTemp.push(project.id);
    }
    setSelectedProjects(projectsTemp);

  }

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

  // return (
  //   <>
  //     <label htmlFor="" className={commonClasses.title2}>
  //       Select a Project you worked on with a Team <span className={commonClasses.colorRed}>*</span>
  //     </label>
  //     <Grid container spacing={3}>
  //       <Grid item xs={12} className={commonClasses.title2}>
  //         <FormLabel
  //           label={'materialsUsed'}
  //           required={true}
  //           classes={classes}
  //           common_classes={commonClasses}
  //           inputOrder={4}
  //           fieldLabel={('createTeam.3rdpage.title')}
  //         />
  //       </Grid>
  //       <Grid item xs={12} className={commonClasses.commonClasses}>
  //         <Paper className={classes.profileLowerStyle}>
  //           <Grid container>
  //             {Array.isArray(projects) &&
  //               projects.map((project) => (
  //                 <Grid
  //                   item
  //                   xs={12}
  //                   sm={6}
  //                   md={6}
  //                   className={classes.projectGridStyle}
  //                   align="center"
  //                 >
  //                   <Project
  //                     project={project}
  //                     key={project.id}
  //                     updateProjects={(res) => handleSetState(project)}
  //                     // onProjectSelect={handleProjectSelect}
  //                     // t={t}
  //                     // isSelected={selectedProjects.includes(project)}
  //                   />
  //                 </Grid>
  //               ))}
  //           </Grid>
  //         </Paper>
  //       </Grid>
  //     </Grid>
  //   </>
  // );
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
            fieldLabel={('createTeam.3rdpage.title')}
          />
        </Grid>
        <Grid item xs={12} className={commonClasses.commonClasses}>
          <Paper className={classes.profileLowerStyle}>
            <Grid container>
              {Array.isArray(projects) &&
                projects.map((project) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    className={classes.projectGridStyle}
                    align="center"
                  >
                    <div style={{position:'relative'}}>
                    <Project
                      project={project}
                      t={t}
                      handleProjectClick={handleProjectClick}
                    />
                    <div className={clsx(classes.overLay, selectedProjects.includes(project.id) && classes.blurOverLay)}
                      onClick={()=> selectProjects(project)} >
                          {selectedProjects.includes(project.id) ? <span>Project Added</span> : ''}
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