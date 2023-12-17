import StepWizard from 'react-step-wizard';
import PropTypes from 'prop-types';
import * as AuthActions from '../../store/actions/authActions';
import { connect } from 'react-redux';
import { Step1, Step2, Step3, Step4, Step5, Step6 } from './steps';
import { useRef, useState } from 'react';
import { useFormik } from 'formik';
import { Container, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { formikSchema } from './signupScripts';
import EducatorsForm from './EducatorsForm';
import { mainGridStyles } from './signupStyles';

const useStyles = makeStyles(mainGridStyles);
function Signup(props) {
  const mainClasses = useStyles();
  const formik = useFormik({
    ...formikSchema,
    onSubmit: (values, formikHelpers) => {
      console.log(values, formikHelpers, props);
    },
  });
  const wizardRef = useRef(null);
  const [activeStep, setActiveStep] = useState(1);

  const wizardGo = (direction, stepErrorsAvailable) => {
    if (stepErrorsAvailable) {
      return;
    }
    if (direction === 'next') {
      wizardRef.current.nextStep();
      setActiveStep(step => step + 1);
    }
    if (direction === 'prev') {
      wizardRef.current.previousStep();
      setActiveStep(step => step - 1);
    }
  };

  return (
    <Container>
      <Grid container direction="column" alignItems="center" className={mainClasses.wrapper}>
        <Grid sx={{ width: '100%' }}>
          <StepWizard initialStep={activeStep} ref={wizardRef} className={mainClasses.wizard}>
            <Step1 {...formik} goAction={wizardGo} />
            <EducatorsForm {...formik} />
            <Step6 {...formik} goAction={wizardGo} />
            <Step5 {...formik} goAction={wizardGo} />
            <Step4 {...formik} goAction={wizardGo} />
            <Step2 {...formik} goAction={wizardGo} />
            <Step3 {...formik} goAction={wizardGo} />
          </StepWizard>
        </Grid>
        <Grid>
          <Typography>Already have an account? Log In </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

Signup.propTypes = {
  auth: PropTypes.object.isRequired,
  setAuthUser: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired,
  getLocations: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setAuthUser: auth_user => {
      dispatch(AuthActions.setAuthUser(auth_user));
    },
    signup: args => {
      return dispatch(AuthActions.signup(args));
    },
    getLocations: args => {
      return dispatch(AuthActions.getLocations(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
