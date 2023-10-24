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
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { CustomButton, PreviewActivity } from '../../components';
import StepWizard from 'react-step-wizard';
import {
  ArrowBackIosRounded,
  ArrowForwardIosRounded,
  CloudDoneOutlined,
  DoneRounded,
  KeyboardBackspaceRounded,
} from '@material-ui/icons';
import { createActivityStyles } from './CreateActivity.styles';
import clsx from 'clsx';
import styles from '../../assets/js/styles';
import { useDomElementHeight } from '../../hooks/useDomElementHeight.hook';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as script from './script';
import Step1 from './step1/Step1';
import Step2 from './step2/Step2';
import { useSelector } from 'react-redux';

const DRAFT_STATUSES = { saved: 'SAVED', saving: 'SAVING', idle: 'IDLE' };
const steps = ['Activity Basics', 'Activity Details'];

let firstRender = true;

function CreateEditActivity(props) {
  useEffect(() => {
    if (!['staff', 'creator'].some(tag => props.auth.tags.includes(tag))) {
      props.history.push('/activities');
    }
  }, [props.auth.tags, props.history]);

  const editting = props?.editting;
  const { height } = useDomElementHeight('navbar-root');
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));

  const classes = makeStyles(createActivityStyles)({ height });
  const commonClasses = makeStyles(styles)();
  const auth = useSelector(state => state.auth);

  const wizardRef = useRef(null);

  const [activeStep, setActiveStep] = useState(1);
  const [state, setState] = useState({ ...JSON.parse(JSON.stringify(script.vars.default_state)) });
  const [draftStatus, setDraftStatus] = useState(DRAFT_STATUSES.idle);
  const [completedSteps, setcompletedSteps] = useState([]);
  const [preview, setPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isActive = useCallback(index => index + 1 === activeStep, [activeStep]);
  const isCompleted = useCallback(index => completedSteps.includes(index + 1), [completedSteps]);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  useEffect(() => {
    if (firstRender) {
      if (props.match.params.id) {
        setIsLoading(true);
        script
          .getActivity({ ...props, auth, formikStep1, formikStep2 }, state)
          .then(result => {})
          .finally(() => setIsLoading(false));
      }
    }
  }, []);

  const togglePreview = () => setPreview(!preview);

  useEffect(() => {
    if (isLoading) {
      setDraftStatus(DRAFT_STATUSES.saving);
    } else {
      setDraftStatus(DRAFT_STATUSES.saved);
    }
  }, [isLoading]);

  const draftContainerText = () => {
    if (draftStatus === DRAFT_STATUSES.idle) return 'Draft';
    if (draftStatus === DRAFT_STATUSES.saving) return !isSmallScreen ? 'Saving to draft' : 'Saving...';
    if (draftStatus === DRAFT_STATUSES.saved) return !isSmallScreen ? 'Saved to draft' : '';
  };

  const formikStep1 = useFormik(script.step1Schema);
  const formikStep2 = useFormik(script.step2Schema);

  const previous = () => go('prev');

  const submit = async () => {
    const errors = await checkErrors();

    if (Object.keys(errors).length > 0) {
      Object.keys(errors).map(err => {
        return toast.warn(err);
      });
      return;
    }

    setIsLoading(true);

    script.submitForm({
      step1Values: formikStep1.values,
      step2Values: formikStep2.values,
      props: { ...props, auth },
      state,
      handleSetState: handleSetState,
      step: activeStep,
      publish: true,
    });
  };

  const checkErrors = () => {
    return formikStep2.setTouched({ introduction: true, materials_used: true }, true);
  };

  const go = async direction => {
    if (direction === 'next') {
      const errors = await formikStep1.setTouched({ title: true, class_grade: true, category: true }, true);

      if (Object.keys(errors).length > 0) return;

      if (activeStep !== 3) {
        wizardRef.current.nextStep();
        let completedStepsTemp = [...new Set([...completedSteps, activeStep])];
        setcompletedSteps(completedStepsTemp);
        if (activeStep !== 2) {
          setActiveStep(step => step + 1);
        }
      }
    }
    if (direction === 'prev') {
      if (activeStep !== 1) {
        wizardRef.current.previousStep();
        setActiveStep(step => step - 1);
      }
    }
  };

  const renderSteps = useMemo(
    () =>
      steps.map((label, index) => (
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
          <Typography
            className={clsx(classes.stepLabel, (isActive(index) || isCompleted(index)) && classes.activeLabel)}
          >
            {label}
          </Typography>
        </Box>
      )),
    [
      classes.activeLabel,
      classes.activeStep,
      classes.stepBall,
      classes.stepLabel,
      classes.stepperLine,
      isActive,
      isCompleted,
    ],
  );

  return (
    <div className={classes.container}>
      <Dialog open={preview} fullScreen>
        <PreviewActivity {...props} onClose={togglePreview} />
      </Dialog>
      {/* Banner */}
      <Box className={classes.banner}>
        <KeyboardBackspaceRounded />
        <>
          <CustomButton onClick={togglePreview} className={classes.previewButton} variant="outlined">
            Preview
          </CustomButton>
          <Box className={clsx(classes.draft, draftStatus === DRAFT_STATUSES.saved && classes.savedToDraft)}>
            {draftStatus === DRAFT_STATUSES.saving ? <CircularProgress size={20} color="inherit" /> : null}
            {draftStatus === DRAFT_STATUSES.saved ? <CloudDoneOutlined size={20} color="inherit" /> : null}

            <Link className={classes.linkToDraft} href={`/creators/${props.auth?.username}/drafts`}>
              <Typography>{draftContainerText()}</Typography>
            </Link>
          </Box>
        </>
      </Box>

      {/* Form */}
      <Box className={classes.formContainer}>
        <Grid item md={12} lg={12}>
          <Box sx={{ textAlign: isSmallScreen ? 'left' : 'center' }}>
            <Typography className={clsx(commonClasses.title1)}>
              {editting ? 'Edit Activity' : 'Create Activity'}
            </Typography>
            <Typography>Tell us about your informative activity !</Typography>
          </Box>

          {/* Step Navigation UI */}
          <Box className={classes.stepperContainer}>{renderSteps}</Box>

          <Box style={{ marginTop: 100 }}>
            <StepWizard initialStep={activeStep} ref={wizardRef}>
              <Step1 formik={formikStep1} />
              <Step2 formik={formikStep2} id={props.match?.params.id} />
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
            onClick={activeStep === 2 ? submit : () => go('next')}
            loading={isLoading}
            style={{ marginLeft: 'auto' }}
            primaryButtonStyle
            endIcon={<ArrowForwardIosRounded className={classes.nextButton} />}
          >
            {activeStep === 2 ? (editting ? 'Update' : 'Publish') : 'Next'}
          </CustomButton>
        </Box>
      </Box>
    </div>
  );
}

export default CreateEditActivity;
