import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Link,
  Typography,
  makeStyles,
  useMediaQuery,
} from '@material-ui/core';
import {
  ArrowBackIosRounded,
  ArrowForwardIosRounded,
  CloseOutlined,
  CloudDoneOutlined,
  Person,
} from '@material-ui/icons';
import { useSelector } from 'react-redux';
import DoneRounded from '@material-ui/icons/DoneRounded';
import KeyboardBackspaceRoundedIcon from '@material-ui/icons/KeyboardBackspaceRounded';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState, lazy } from 'react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import StepWizard from 'react-step-wizard';
import { toast } from 'react-toastify';
import { colors } from '../../assets/js/colors';
import styles from '../../assets/js/styles';
import Modal from '../../components/modals/Modal';
import CustomButton from '../../components/button/Button';
import { useDomElementHeight } from '../../hooks/userDomElementHeight.hook';
import * as AuthActions from '../../store/actions/authActions';
import * as ProjectActions from '../../store/actions/projectActions';
import * as UserActions from '../../store/actions/userActions';
import { createProjectStyle } from './createTeam.style';
import * as script from './script';
import Step1 from './step1/Step1';
import Step2 from './step2/Step2';
import Step3 from './step3/Step3';
import { TEAM_ENABLED } from '../../utils.js';

// const PreviewProject = lazy(() => import('../../components/previewProject/PreviewProject'));

const DRAFT_STATUSES = { saved: 'SAVED', saving: 'SAVING', idle: 'IDLE' };
const steps = ['Team Details', 'Add Team Members', 'Select Team Project'];


function CreateTeam(props) {
  const [completedSteps, setcompletedSteps] = useState([]);
  const { height } = useDomElementHeight('navbar-root');
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const wizardRef = useRef(null);
  const classes = makeStyles(createProjectStyle)({ height });
  const commonClasses = makeStyles(styles)();
  const [draftStatus, setDraftStatus] = useState(DRAFT_STATUSES.idle);
  const [activeStep, setActiveStep] = useState(1);
  const [publishOrAddTags, setPublishOrAddTags] = useState(false);
  const [addTagsDialog, setAddTagsDialog] = useState(false);
  const [value, setValue] = useState('');
  const [remoteTags, setRemoteTags] = useState([]);

  const [preview, setPreview] = useState(false);

  const isActive = index => index + 1 === activeStep;
  const isCompleted = index => completedSteps.includes(index + 1);
  const togglePublishOrAddTags = () => {
    formik.values?.tags.length == 0 ? setPublishOrAddTags(!publishOrAddTags) : toggleAddTagsDialog();
  };
  const toggleAddTagsDialog = () => setAddTagsDialog(!addTagsDialog);
  const clearSuggestions = () => setRemoteTags([]);

  const handleSubmit = async (values) => {
    return await script.submitData(values, props)
  }

  const handleBlur = name => {
    formik.setTouched({ [name]: true }, true);
  };

  const togglePreview = () => setPreview(!preview);

  const draftContainerText = () => {
    if (draftStatus === DRAFT_STATUSES.idle) return 'Draft';
    if (draftStatus === DRAFT_STATUSES.saving) return !isSmallScreen ? 'Saving to draft' : 'Saving...';
    if (draftStatus === DRAFT_STATUSES.saved) return !isSmallScreen ? 'Saved to draft' : '';
  };

  const formik = useFormik({...script.formikSchema, onSubmit: handleSubmit});

  const previous = () => go('prev');

  const next = async () => {
    const isError = await checkErrors()

    if (!isError) go('next');
  };

  const handleAddTags = () => {
    togglePublishOrAddTags();
    toggleAddTagsDialog();
  };

  const checkErrors = async () => {
    if (activeStep === 1) {
      const errors = await formik.setTouched({ groupname: true, description: true }, true);
      return (errors.groupname || errors.description) ? true : false
    }

    if (activeStep === 2) {
      const errors = await formik.setTouched({ admins: true, members: true }, true);
      return (errors.admins || errors.members) ? true : false
    }

    return null
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

  return (
    <div className={classes.container}>
      <Dialog open={preview} fullScreen>
        {/* <PreviewProject {...props} onClose={togglePreview} /> */}
      </Dialog>
      {/* Banner */}
      <Box className={classes.banner}>
      <Link href="/create-team" color="inherit" >
        <KeyboardBackspaceRoundedIcon/>
      </Link>
        {props.match.params.id && (
          <>
            <CustomButton onClick={togglePreview} className={classes.previewButton} variant="outlined">
              Preview
            </CustomButton>
            <Box className={clsx(classes.draft, draftStatus === DRAFT_STATUSES.saved && classes.savedToDraft)}>
              {draftStatus === DRAFT_STATUSES.saving ? <CircularProgress size={20} color="inherit" /> : null}
              {draftStatus === DRAFT_STATUSES.saved ? <CloudDoneOutlined size={20} color="inherit" /> : null}

              <Link className={classes.linkToDraft} href={`/creators/${props.auth.username}/drafts`}>
                <Typography>{draftContainerText()}</Typography>
              </Link>
            </Box>
          </>
        )}
      </Box>

      {/* Form */}
      <Box className={classes.formContainer}>
        <Grid item md={12} lg={12}>
          <Box sx={{ textAlign: isSmallScreen ? 'left' : 'center' }}>
            <Typography className={clsx(commonClasses.title1)}>Create Team</Typography>
            <Typography>Create a team for group of creatives</Typography>
          </Box>

          {/* Step Navigation UI */}
          <Box className={classes.stepperContainer}>{renderSteps}</Box>

          <Box style={{ marginTop: 100 }}>
            <StepWizard initialStep={activeStep} ref={wizardRef}>
              <Step1 handleBlur={handleBlur} formik={formik} />
              <Step2 formik={formik} />
              <Step3
                formik={formik}
                handleBlur={handleBlur}
                auth={props.auth}
              />
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
            onClick={activeStep === 3 ? formik.handleSubmit : next}
            // loading={state.default_state?.loading}
            style={{ marginLeft: 'auto' }}
            primaryButtonStyle
            endIcon={<ArrowForwardIosRounded className={classes.nextButton} />}
          >
            {activeStep === 3 ? props.t('profile.createTeam') : 'Next'}
          </CustomButton>
        </Box>
      </Box>
    </div>
  );
}

CreateTeam.propTypes = {
  auth: PropTypes.object.isRequired,

};

const mapStateToProps = state => {
  return {
    auth: state.auth,
    projects: state.projects,
  };
};

const mapDispatchToProps = dispatch => {
  return {

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTeam);
