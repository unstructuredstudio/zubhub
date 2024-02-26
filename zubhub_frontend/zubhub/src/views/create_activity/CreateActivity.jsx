import { makeStyles } from '@mui/styles';
import { Box, Dialog, Grid, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import StepWizard from 'react-step-wizard';
import { ArrowBackIosRounded, ArrowForwardIosRounded, DoneRounded } from '@mui/icons-material';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { CustomButton, PreviewActivity } from '../../components';
import { createActivityStyles } from './CreateActivity.styles';
import styles from '../../assets/js/styles';
import { useDomElementHeight } from '../../hooks/useDomElementHeight.hook';
import * as script from './script';
import Step1 from './step1/Step1';
import Step2 from './step2/Step2';

const steps = ['Activity Basics', 'Activity Details'];

const firstRender = true;

export default function CreateActivity(props) {
  const { height } = useDomElementHeight('navbar-root');
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));

  const classes = makeStyles(createActivityStyles)({ height });
  const commonClasses = makeStyles(styles)();
  const auth = useSelector(state => state.auth);

  const wizardRef = useRef(null);

  const [activeStep, setActiveStep] = useState(1);
  const [state, setState] = useState({ ...JSON.parse(JSON.stringify(script.vars.default_state)) });
  const [completedSteps, setcompletedSteps] = useState([]);
  const [preview, setPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isActive = index => index + 1 === activeStep;
  const isCompleted = index => completedSteps.includes(index + 1);
  const { t } = props;
  const formikStep1 = useFormik(script.step1Schema);
  const formikStep2 = useFormik(script.step2Schema);

  const checkErrors = () => {
    if (activeStep === 1) {
      return formikStep1.setTouched({ title: true }, true);
    }

    if (activeStep === 2) {
      return formikStep2.setTouched({ introduction: true }, true);
    }
  };

  const go = direction => {
    if (direction === 'next') {
      if (activeStep !== 3) {
        wizardRef.current.nextStep();
        const completedStepsTemp = [...new Set([...completedSteps, activeStep])];
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

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  useEffect(() => {
    if (firstRender) {
      if (props.params.id) {
        setIsLoading(true);
        script
          .getActivity({ ...props, auth, formikStep1, formikStep2 }, state)
          .then(() => {})
          .finally(() => setIsLoading(false));
      }
    }
  }, []);

  const togglePreview = () => setPreview(!preview);

  const previous = () => go('prev');
  const next = async () => {
    const error = await checkErrors();

    console.log(error);
    if (Object.keys(error || {}).length > 0) return;

    setIsLoading(true);

    script.submitForm(
      {
        step1Values: formikStep1.values,
        step2Values: formikStep2.values,
        props: { ...props, auth },
        state,
        handleSetState,
        step: activeStep,
      },
      success => {
        if (success) {
          if (activeStep === 1) go('next');
          if (activeStep === 2) props.navigate(`/activities/${props.params.id}?success=true`);
          setIsLoading(false);
        }
      },
    );
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
        <PreviewActivity {...props} onClose={togglePreview} />
      </Dialog>
      {/* Form */}
      <Box className={classes.formContainer}>
        <Grid item md={12} lg={12}>
          <Box sx={{ textAlign: isSmallScreen ? 'left' : 'center' }}>
            <Typography className={clsx(commonClasses.title1)}>{t('createActivity.welcomeMsg.primary')}</Typography>
            <Typography>{t('createActivity.welcomeMsg.secondary')}</Typography>
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
              {t('createActivity.buttons.Prev')}
            </CustomButton>
          )}

          <CustomButton
            onClick={next}
            loading={isLoading}
            style={{ marginLeft: 'auto' }}
            primaryButtonStyle
            endIcon={<ArrowForwardIosRounded className={classes.nextButton} />}
          >
            {activeStep === 2 ? t('createActivity.buttons.create') : t('createActivity.buttons.Next')}
          </CustomButton>
        </Box>
      </Box>
    </div>
  );
}
