import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Link,
  Typography,
  makeStyles,
  useMediaQuery,
} from '@material-ui/core';
import { ArrowBackIosRounded, ArrowForwardIosRounded, CloudDoneOutlined } from '@material-ui/icons';
import DoneRounded from '@material-ui/icons/DoneRounded';
import KeyboardBackspaceRoundedIcon from '@material-ui/icons/KeyboardBackspaceRounded';
import clsx from 'clsx';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import StepWizard from 'react-step-wizard';
import styles from '../../assets/js/styles';
import CustomButton from '../../components/button/Button';
import { useDomElementHeight } from '../../hooks/useDomElementHeight.hook';
import * as AuthActions from '../../store/actions/authActions';
import * as ProjectActions from '../../store/actions/projectActions';
import * as UserActions from '../../store/actions/userActions';
import { createProjectStyle } from './createProject.style';
import * as script from './script';
import Step1 from './step1/Step1';
import Step2 from './step2/Step2';
import Step3 from './step3/Step3';

const DRAFT_STATUSES = { saved: 'SAVED', saving: 'SAVING', idle: 'IDLE' };
const steps = ['Details', 'Photos/Videos', 'Features'];

function CreateProject2(props) {
  const [draftStatus, setDraftStatus] = useState(DRAFT_STATUSES.saved);
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setcompletedSteps] = useState([]);
  const { height } = useDomElementHeight('navbar-root');
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const wizardRef = useRef(null);
  const classes = makeStyles(createProjectStyle)({ height });
  const commonClasses = makeStyles(styles)();
  const [state, setState] = useState({ ...JSON.parse(JSON.stringify(script.vars.default_state)) });

  const isActive = index => index + 1 === activeStep;
  const isCompleted = index => completedSteps.includes(index + 1);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  useEffect(() => {
    if (props.match.params.id) {
      Promise.all([script.getProject({ ...props, ...formik }, state), script.getCategories(props)]).then(result =>
        handleSetState({ ...result[0], ...result[1] }),
      );
    } else {
      handleSetState(script.getCategories(props));
    }
    // handleSetState(buildPublishTypes(props));
  }, []);

  useEffect(() => {
    if (state.success) {
      if (props.location.pathname === '/projects/create') props.history.replace(`/projects/${state.id}/edit`);
      if (activeStep === 3) {
        return toggleDialog();
      }
      go('next');
    }
  }, [state.success]);

  useEffect(() => {
    console.log(state.loading, 'loading state');
  }, [state.loading]);

  const draftContainerText = () => {
    if (draftStatus === DRAFT_STATUSES.idle) return 'Draft';
    if (draftStatus === DRAFT_STATUSES.saving) return !isSmallScreen ? 'Saving to draft' : 'Saving...';
    if (draftStatus === DRAFT_STATUSES.saved) return !isSmallScreen ? 'Saved to draft' : '';
  };

  const formik = useFormik(script.formikSchema);

  const previous = () => go('prev');
  const next = async () => {
    let error = await checkErrors();
    if (Object.keys(error).length > 0) return;
    submitData();
  };

  const submitData = async () => {
    try {
      return (
        !script.vars.upload_in_progress &&
        script.initUpload(state, { ...props, ...formik, step: activeStep }, handleSetState)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const checkErrors = () => {
    if (activeStep === 1) {
      return formik.setTouched({ title: true, materials_used: true, description: true });
    }

    if (activeStep === 2) {
      return formik.setTouched({ video: true, project_images: true }, true);
    }

    if (activeStep === 3) {
      return formik.setTouched({ categories: true, hashtags: true }, true);
    }
  };

  const go = direction => {
    if (direction === 'next') {
      if (activeStep !== 3) {
        wizardRef.current.nextStep();
        let completedStepsTemp = [...new Set([...completedSteps, activeStep])];
        setcompletedSteps(completedStepsTemp);
        setActiveStep(step => step + 1);
      }
    }
    if (direction === 'prev') {
      if (activeStep !== 1) {
        wizardRef.current.previousStep();
        setActiveStep(step => step - 1);
      }
    }
  };

  const renderSteps = steps.map((label, index) => (
    <Box
      key={index}
      className={clsx(classes.stepperLine, (isActive(index) || isCompleted(index)) && classes.activeStep)}
    >
      <Box className={clsx(classes.stepBall, (isActive(index) || isCompleted(index)) && classes.activeStep)}>
        {isCompleted(index) && !isActive(index) ? (
          <DoneRounded style={{ fontSize: 14 }} />
        ) : (
          <Typography style={{ fontWeight: '600' }}>{index + 1}</Typography>
        )}
      </Box>
      <Typography className={clsx(classes.stepLabel, (isActive(index) || isCompleted(index)) && classes.activeLabel)}>
        {label}
      </Typography>
    </Box>
  ));

  const toggleDialog = () => setOpen(!open);
  console.log({ formik });

  return (
    <div className={classes.container}>
      {/* Banner */}
      <Box className={classes.banner}>
        <KeyboardBackspaceRoundedIcon />
        <CustomButton className={classes.previewButton} variant="outlined">
          Preview
        </CustomButton>
        <Box className={clsx(classes.draft, draftStatus === DRAFT_STATUSES.saved && classes.savedToDraft)}>
          {draftStatus === DRAFT_STATUSES.saving ? <CircularProgress size={20} color="inherit" /> : null}
          {draftStatus === DRAFT_STATUSES.saved ? <CloudDoneOutlined size={20} color="inherit" /> : null}

          <Link className={classes.linkToDraft} href="#">
            <Typography>{draftContainerText()}</Typography>
          </Link>
        </Box>
      </Box>

      {/* Form */}
      <Box className={classes.formContainer}>
        <Grid item md={12} lg={12}>
          <Box sx={{ textAlign: isSmallScreen ? 'left' : 'center' }}>
            <Typography className={clsx(commonClasses.title1)}>Create Project</Typography>
            <Typography>Tell us about your amazing project !</Typography>
          </Box>

          {/* Step Navigation UI */}
          <Box className={classes.stepperContainer}>{renderSteps}</Box>

          <Box style={{ marginTop: 100 }}>
            <StepWizard initialStep={activeStep} ref={wizardRef}>
              <Step1 formik={formik} />
              <Step2 formik={formik} />
              <Step3 formik={formik} {...props} />
            </StepWizard>
          </Box>
        </Grid>

        {/* Previous and Next buttons */}
        <Box className={classes.buttonGroup}>
          {activeStep > 1 && (
            <CustomButton
              onClick={previous}
              primaryButtonOutlinedStyle
              startIcon={<ArrowBackIosRounded className={classes.nextButton} />}
            >
              Previous
            </CustomButton>
          )}

          <CustomButton
            onClick={next}
            loading={state.default_state?.loading}
            primaryButtonStyle
            style={{ marginLeft: 'auto' }}
            endIcon={<ArrowForwardIosRounded className={classes.nextButton} />}
          >
            {activeStep == 3 ? 'Publish' : 'Next'}
          </CustomButton>

          <Dialog open={open} onClose={toggleDialog}>
            <DialogTitle>Congratulations your project has been published</DialogTitle>
            <DialogContent>
              <p>Modal content goes here.</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={toggleDialog}>Close</Button>
              <Button variant="contained" onClick={toggleDialog}>
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </div>
  );
}

CreateProject2.propTypes = {
  auth: PropTypes.object.isRequired,
  getProject: PropTypes.func.isRequired,
  getCategories: PropTypes.func.isRequired,
  suggestTags: PropTypes.func.isRequired,
  createProject: PropTypes.func.isRequired,
  updateProject: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
    projects: state.projects,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getSignature: args => {
      return dispatch(AuthActions.getSignature(args));
    },
    getProject: values => {
      return dispatch(ProjectActions.getProject(values));
    },
    getCategories: values => {
      return dispatch(ProjectActions.getCategories(values));
    },
    suggestTags: args => {
      return dispatch(ProjectActions.suggestTags(args));
    },
    suggestCreators: args => {
      return dispatch(UserActions.suggestCreators(args));
    },
    createProject: props => {
      return dispatch(ProjectActions.createProject(props));
    },
    updateProject: props => {
      return dispatch(ProjectActions.updateProject(props));
    },
    shouldUploadToLocal: args => {
      return dispatch(ProjectActions.shouldUploadToLocal(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateProject2);
