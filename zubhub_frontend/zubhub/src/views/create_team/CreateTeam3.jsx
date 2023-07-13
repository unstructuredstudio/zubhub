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
import API from '../../api'
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


function CreateTeam3(props) {
  const [state, setState] = React.useState({
    results: [],
    loading: true,
    profile: {},
    open_delete_account_modal: false,
    dialog_error: null,
    more_anchor_el: null,
    drafts: [],
    badge_tags: [],
  });
  const username_el = React.useRef(null);
  const username = props.match.params.username || props.auth.username;
  const { t, formikProps, validateSteps } = props;
  const classes = useProjectStyles();
  const activity_classes = useStyles();
  const common_classes = useCommonStyles();
  const [makingSteps, setMakingSteps] = useState([]);
  const [inspiringExamples, setInspiringExamples] = useState([]);
  const [page, setPage] = useState(1);
  React.useEffect(() => {
    setMakingSteps(
      formikProps.formikValues.making_steps
        ? formikProps.formikValues.making_steps
        : [
            {
              description: '',
              image: null,
            },
          ],
    );
    setInspiringExamples(
      formikProps.formikValues.inspiring_examples
        ? formikProps.formikValues.inspiring_examples
        : [
            {
              description: '',
              credit: '',
              image: null,
            },
          ],
    );
    try{
      let activitylogObj= new API()
      const promises = [getUserProfile(props), activitylogObj.getUserActivity(username, page)];
      if (username === props.auth.username) {
        promises.push(
          ProjectActions.getUserDrafts({
            username,
            token: props.auth.token,
            t: props.t,
            limit: 4,
          }),
        );
      }

    } catch (error) {
      console.log(error);
    }
    // }, [page]);
  }, [formikProps.formikValues]);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const {
      results: projects,
      profile,
      loading,
      open_delete_account_modal,
      dialog_error,
      more_anchor_el,
      drafts,
      badge_tags,
    } = state;

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
      {/* {profile.projects_count > 0 || drafts.length > 0 (
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
                              handleSetState(
                                updateProjects(res, state, props, toast),
                              )
                            }
                            {...props}
                          />
                        </Grid>
                      ))}
                  </Grid>
                </Paper>
              )
            } */}
      </Grid>
      </Grid>
    </div>
  );
}

export default CreateTeam3;
