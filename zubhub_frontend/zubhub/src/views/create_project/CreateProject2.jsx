import { Box, CircularProgress, Grid, Link, Typography, makeStyles, useMediaQuery } from '@material-ui/core';
import { ArrowBackIosRounded, ArrowForwardIosRounded, CloudDoneOutlined } from '@material-ui/icons';
import DoneRounded from '@material-ui/icons/DoneRounded';
import KeyboardBackspaceRoundedIcon from '@material-ui/icons/KeyboardBackspaceRounded';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useRef, useState } from 'react';
import StepWizard from 'react-step-wizard';
import * as Yup from 'yup';
import styles from '../../assets/js/styles';
import CustomButton from '../../components/button/Button';
import { useDomElementHeight } from '../../hooks/useDomElementHeight.hook';
import { createProjectStyle } from './createProject.style';
import Step1 from './step1/Step1';
import Step2 from './step2/Step2';
import Step3 from './step3/Step3';

const DRAFT_STATUSES = { saved: 'SAVED', saving: 'SAVING', idle: 'IDLE' };
const steps = ['Details', 'Photos/Videos', 'Features'];

export default function CreateProject2() {
  const [draftStatus, setDraftStatus] = useState(DRAFT_STATUSES.saved);
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setcompletedSteps] = useState([]);
  const { height } = useDomElementHeight('navbar-root');
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const wizardRef = useRef(null);
  const classes = makeStyles(createProjectStyle)({ height });
  const commonClasses = makeStyles(styles)();

  const isActive = index => index + 1 === activeStep;
  const isCompleted = index => completedSteps.includes(index + 1);

  const draftContainerText = () => {
    if (draftStatus === DRAFT_STATUSES.idle) return 'Draft';
    if (draftStatus === DRAFT_STATUSES.saving) return !isSmallScreen ? 'Saving to draft' : 'Saving...';
    if (draftStatus === DRAFT_STATUSES.saved) return !isSmallScreen ? 'Saved to draft' : '';
  };

  const formikStep1 = useFormik({
    initialValues: {
      title: '',
      description: '',
      materials_used: [],
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Please add a name for your project'),
      description: Yup.string().required('Please add a description'),
      materials_used: Yup.array().required('Please add the materials you used'),
    }),
  });

  const formikStep2 = useFormik({
    initialValues: {
      images: [],
      video: [],
      video_link: '',
    },
    validationSchema: Yup.object({}),
  });

  const formikStep3 = useFormik({
    initialValues: {
      hashtags: '',
      categories: [],
    },
    validationSchema: Yup.object({}),
  });

  const previous = () => go('prev');
  const next = () => {
    let formikFormData = [formikStep1, formikStep2, formikStep3];

    go('next');
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
      {/* Banner */}
      <Box className={classes.banner}>
        <KeyboardBackspaceRoundedIcon />
        <CustomButton className={classes.previewButton} variant="outlined">
          Preview
        </CustomButton>
        <Box className={clsx(classes.draft, draftStatus === DRAFT_STATUSES.saved && classes.savedToDraft)}>
          {draftStatus === DRAFT_STATUSES.saving ? <CircularProgress size={20} color={'inherit'} /> : null}
          {draftStatus === DRAFT_STATUSES.saved ? <CloudDoneOutlined size={20} color={'inherit'} /> : null}

          <Link className={classes.linkToDraft} href="#">
            <Typography>{draftContainerText()}</Typography>
          </Link>
        </Box>
      </Box>

      {/* Form */}
      <Box className={classes.formContainer}>
        <Grid item md={12} lg={12}>
          <Typography className={clsx(commonClasses.title1)}>Create Project</Typography>
          <Typography className={clsx()}>Tell us about your amazing project !</Typography>

          {/* Step Navigation UI */}
          <Box className={classes.stepperContainer}>{renderSteps}</Box>

          <Box style={{ marginTop: 100 }}>
            <StepWizard initialStep={activeStep} ref={wizardRef}>
              <Step1 formik={formikStep1} />
              <Step2 formik={formikStep2} />
              <Step3 formik={formikStep3} />
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
            primaryButtonStyle
            style={{ marginLeft: 'auto' }}
            endIcon={<ArrowForwardIosRounded className={classes.nextButton} />}
          >
            Next
          </CustomButton>
        </Box>
      </Box>
    </div>
  );
}
