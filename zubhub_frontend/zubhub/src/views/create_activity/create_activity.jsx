import React, { useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { styles } from '../../assets/js/styles/views/create_activity/createActivityStyles';
import { withFormik } from 'formik';
import clsx from 'clsx';
import CustomButton from '../../components/button/Button';
import { validationSchema, initUpload } from './createActivityScripts';
import * as UserActions from '../../store/actions/userActions';
import * as AuthActions from '../../store/actions/authActions';
import { Grid, Box, Typography } from '@material-ui/core';
import CreateActivityStep1 from './create_activity_step1';
import CreateActivityStep2 from './create_activity_step2';
import CreateActivityStep3 from './create_activity_step3';
import commonStyles from '../../assets/js/styles';
import MultiStepProgressBar from '../../components/multi_step_progress_bar/multiStepProgressBar';
const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function CreateActivity(props) {
  const { t } = props;
  const classes = useStyles();
  const common_classes = useCommonStyles();
  const stepComponentsMap = {
    1: props => <CreateActivityStep1 {...props} />,
    2: props => <CreateActivityStep2 {...props} />,
    3: props => <CreateActivityStep3 {...props} />,
  };
  const [step, setStep] = useState(1);
  const [verifiedStep, setVerifiedStep] = useState(1);
  const [newActivityObject, setNewActivityObject] = useState({
    media_upload: {
      upload_dialog: false,
      images_to_upload: [],
      videos_to_upload: [],
      upload_info: {},
      upload_percent: 0,
      uploaded_images_url: [],
      uploaded_videos_url: [],
    },
  });
  const [state, setState] = useState({
    step: 1,
    verifiedStep: 1,
    newActivity: {
      media_upload: {
        upload_dialog: false,
        images_to_upload: [],
        videos_to_upload: [],
        upload_info: {},
        upload_percent: 0,
        uploaded_images_url: [],
        uploaded_videos_url: [],
      },
    },
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };
  const handleSetNewActivity = obj => {
    if (obj) {
      //  Promise.resolve(obj).then(obj => {
      setState(state => ({
        ...state,
        newActivity: { ...state.newActivity, ...obj },
      }));
      //  });
    }
  };
  const requireFieldByStep = [
    ['title', 'motivation', 'learningGoals'],
    ['materialsUsed', 'facilitationTips'],
    [
      'creationSteps',
      'inspiringExemplesDescriptions',
      'inspiringExemplesCredits',
    ],
  ];
  const validateSteps = () => {
    let stepVerified = true;
    for (let i = 0; i < requireFieldByStep.length; i++) {
      stepVerified = true;
      requireFieldByStep[i].map(field => {
        if (!(props.touched[field] && !props.errors[field])) {
          stepVerified = false;
          setVerifiedStep(i + 1);
        }
      });
      if (stepVerified) {
        setVerifiedStep(i + 2);
      } else {
        break;
      }
    }
  };
  const formikProps = {
    formikValues: props.values,
    touched: props.touched,
    errors: props.errors,
    setFieldValue: props.setFieldValue,
    setFieldTouched: props.setFieldTouched,
    handleChange: props.handleChange,
    handleBlur: props.handleBlur,
  };
  props = {
    ...props,
    
    newActivity: state.newActivity,
    verifiedStep: verifiedStep,
    validateSteps: validateSteps,
    handleSetState: handleSetState,
    handleSetNewActivity: handleSetNewActivity,
  };

  const visitePrev = () => {
    setStep(step => step - 1);
  };
  const visiteNext = () => {
    setStep(step => step + 1);
  };
  // console.log('props', props);
  // console.log('neActivity', state.newActivity);
  console.log('newActivityObject', props, newActivityObject);
  return (
    <div className={classes.createActivityContainer}>
      <Box className={classes.createActivityBoxContainer}>
        <Typography
          variant="h3"
          component="h2"
          className={classes.createActivityContainerTitle}
        >
          {t('createActivity.welcomeMsg.primary')}
        </Typography>
        <MultiStepProgressBar step={verifiedStep} stepCount={4} />

        <Box className={classes.CreateActivityFormContainer}>
          <form>
            {stepComponentsMap[step]({
              ...props,
              formikProps: formikProps,
              validateSteps: validateSteps,
              newActivityObject: newActivityObject,
              setNewActivityObject: setNewActivityObject,
            })}
          </form>
          <Box className={clsx(common_classes.margin)}>
            <Grid
              item
              xs={12}
              spacing={5}
              className={clsx(
                common_classes.marginTop3em,
                common_classes.displayFlex,
                step === 1
                  ? common_classes.justifyRight
                  : common_classes.justifySpaceBetween,
              )}
            >
              {step > 1 ? (
                <CustomButton
                  variant="contained"
                  primaryButtonStyle
                  customButtonStyle
                  size="small"
                  onClick={visitePrev}
                >
                  {t('createActivity.buttons.Prev')}
                </CustomButton>
              ) : (
                ''
              )}
              {step < 3 ? (
                <CustomButton
                  variant="contained"
                  primaryButtonStyle
                  customButtonStyle
                  size="small"
                  onClick={visiteNext}
                >
                  {t('createActivity.buttons.Next')}
                </CustomButton>
              ) : (
                <Grid item xs={8} md={6} sm={6}>
                  <CustomButton
                    variant="contained"
                    primaryButtonStyle
                    customButtonStyle
                    disabled={verifiedStep > 2 ? false : true}
                    fullWidth
                    size="large"
                    type="submit"
                    onClick={e =>
                      initUpload(
                        e,
                        state.newActivity,
                        props,
                        handleSetNewActivity,
                      )
                    }
                  >
                    {t('createActivity.buttons.Submit')}
                  </CustomButton>
                </Grid>
              )}
            </Grid>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getSignature: args => {
      return dispatch(AuthActions.getSignature(args));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  withFormik({
    mapPropsToValue: () => ({
      title: '',
      motivation: '',
      learningGoals: '',
      facilitationTips: '',
      creationSteps: [],
      materialsUsed: [],
      materialsUsedImages: '',
      inspiringArtist: '',
      inspiringExemplesDescriptions: [],
      inspiringExemplesCredits: [],
      inspiringExemplesImages: '',
      activityImages: '',
      inspiringArtistImage: '',
    }),
    validationSchema,
  })(CreateActivity),
);
