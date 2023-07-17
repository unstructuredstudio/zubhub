import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import InputText from '../../components/inputText/inputText';
import CancelIcon from '@material-ui/icons/Cancel';
import 'react-toastify/dist/ReactToastify.css';
import { vars } from '../create_project/createProjectScripts';
import {
  getMakingStepsRequiredError,
  getStepError,
} from '../create_activity/createActivityScripts';
import ZubhubAPI from '../../api/api';
import { toast } from 'react-toastify';
import Project from '../../components/project/Project';
import {
  getUserProfile,
  copyProfileUrl,
  updateProjects,
  toggleFollow,
  sortTags,
  handleMoreMenuOpen,
  handleMoreMenuClose,
  handleToggleDeleteAccountModal,
  deleteAccount,
} from '../profile/profileScripts';
import ProjectsDraftsGrid from '../../components/projects_drafts/ProjectsDraftsGrid';
import * as ProjectActions from '../../store/actions/projectActions';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, FormControl, Box, Typography,   Paper } from '@material-ui/core';
import CustomButton from '../../components/button/Button';
import AddIcon from '@material-ui/icons/Add';
import projectStyles from '../../assets/js/styles/views/create_project/createProjectStyles';
import { styles } from '../../assets/js/styles/views/create_activity/createActivityStyles';
import commonStyles from '../../assets/js/styles';
import MaterialsUsed from '../../components/materialsUsed/materialsUsed';
import UploadFile from '../../components/upload_file/uploadFile';
import FormLabel from '../../components/form_labels/formLabel';
import AddMore from '../../components/addMore/addMore';
import Input from '../../components/input/input';
import { Field, FieldArray } from 'formik';
const useProjectStyles = makeStyles(projectStyles);
const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);
const API = new ZubhubAPI();


function CreateTeam3(props) {

  const [projects,setProjects] = React.useState([]);
  const username= props.formikProps.formikValues.auth.username;
  const { t, formikProps, validateSteps } = props;
  const classes = useProjectStyles();
  const activity_classes = useStyles();
  const common_classes = useCommonStyles();
  const [makingSteps, setMakingSteps] = useState([]);
  const [inspiringExamples, setInspiringExamples] = useState([]);
  const [page, setPage] = useState(1);

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

  React.useEffect(() => {
    let project= API.getUserProjects({username});
    project.then(data=>setProjects(data.results));

  }, []);
  

  // const {
  //   results: projects
  // } = state;


  return (
    <div className={activity_classes.createActivityStepContainer}>
      <Grid container spacing={3}>
      <Grid item xs={12} className={common_classes.marginTop1em}>
      <FormLabel
            label={'materialsUsed'}
            required={true}
            classes={classes}
            common_classes={common_classes}
            inputOrder={4}
            fieldLabel={t('createTeam.3rdpage.title')}
          />
      </Grid>
      <Grid item xs={12} className={common_classes.marginTop1em}>
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
                            updateProjects={res =>
                              handleSetState(
                                
                              )
                            }
                            {...props}
                          />
                        </Grid>
                      ))}
                  </Grid>
                </Paper>
              
      </Grid>
      </Grid>
    </div>
  );
}

export default CreateTeam3;
