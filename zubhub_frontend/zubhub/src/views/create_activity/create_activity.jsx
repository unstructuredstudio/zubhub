import { Box, CircularProgress, Dialog, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import clsx from 'clsx';
import { withFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import commonStyles from '../../assets/js/styles';
import { styles } from '../../assets/js/styles/views/create_activity/createActivityStyles';
import projectStyles from '../../assets/js/styles/views/create_project/createProjectStyles';
import CustomButton from '../../components/button/Button';
import MultiStepProgressBar from '../../components/multi_step_progress_bar/multiStepProgressBar';
import * as activityActions from '../../store/actions/activityActions';
import * as AuthActions from '../../store/actions/authActions';
import LoadingPage from '../loading/LoadingPage';
import { deserialize, initUpload, validationSchema } from './createActivityScripts';
import CreateActivityStep1 from './create_activity_step1';
import CreateActivityStep2 from './create_activity_step2';
import CreateActivityStep3 from './create_activity_step3';
const useStyles = makeStyles(styles);
const useProjectStyles = makeStyles(projectStyles);
const useCommonStyles = makeStyles(commonStyles);

function CreateActivity(props) {
  const { t, navigate } = props;
  const { id } = props.params;
  const classes = useStyles();
  const project_classes = useProjectStyles();
  const common_classes = useCommonStyles();
  const stepComponentsMap = {
    1: props => <CreateActivityStep1 {...props} />,
    2: props => <CreateActivityStep2 {...props} />,
    3: props => <CreateActivityStep3 {...props} />,
  };

  const [step, setStep] = useState(1);
  const [verifiedStep, setVerifiedStep] = useState(1);
  const [newActivityObject, setNewActivityObject] = useState({
    submitting: false,
    countFiles: 0,
    loadedPercent: {},
    loadProgress: 0,
  });
  const formikProps = {
    formikValues: props.values,
    touched: props.touched,
    errors: props.errors,
    setFieldValue: props.setFieldValue,
    setFieldTouched: props.setFieldTouched,
    handleChange: props.handleChange,
    handleBlur: props.handleBlur,
    handleReset: props.handleReset,
  };

  const requiredFieldsByStep = [
    ['title', 'motivation', 'learning_goals'],
    ['materials_used', 'facilitation_tips', 'activity_images'],
    ['making_steps'],
  ];
  const validateSteps = () => {
    let stepVerified = true;
    for (let i = 0; i < requiredFieldsByStep.length; i++) {
      stepVerified = true;
      requiredFieldsByStep[i].map(field => {
        if (props.errors[field]) {
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
  const [deserializingForEdit, setDeserializingForEdit] = useState(id ? true : false);

  const submitButtonRef = React.useRef(null);
  const [readyForSubmit, setReadyForSubmit] = useState(false);
  useEffect(() => {
    if (id) {
      const activityToUpdate = props.activities?.all_activities.filter(item => item.id === id)[0];
      if (activityToUpdate) {
        deserialize(activityToUpdate, props.setFieldValue);
        setDeserializingForEdit(false);
      } else {
        navigate('/activities');
      }
    }
  }, []);

  const visitePrev = () => {
    setStep(step => step - 1);
    window.scrollTo(0, 0);
  };
  const visiteNext = () => {
    //validateSteps();
    setStep(step => {
      if (step === 1) {
        requiredFieldsByStep[0].map(item => props.setFieldTouched(item, true, true));
      } else {
        requiredFieldsByStep[1].map(item => props.setFieldTouched(item, true, false));
        props.setFieldTouched('making_steps', true, false);
      }
      return step + 1;
    });
    validateSteps();
    window.scrollTo(0, 0);
  };

  return (
    <>
      {deserializingForEdit ? (
        <LoadingPage />
      ) : (
        <div className={classes.createActivityContainer}>
          <Box className={classes.createActivityBoxContainer}>
            <Typography variant="h3" component="h2" className={classes.createActivityContainerTitle}>
              {t(`createActivity.welcomeMsg.${id ? 'edit' : 'primary'}`)}
            </Typography>
            <MultiStepProgressBar step={verifiedStep} stepCount={4} />

            <Box className={classes.CreateActivityFormContainer}>
              <form>
                {stepComponentsMap[step]({
                  formikProps: formikProps,
                  validateSteps: validateSteps,
                  newActivityObject: newActivityObject,
                  setNewActivityObject: setNewActivityObject,
                  t: props.t,
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
                    step === 1 ? common_classes.justifyRight : common_classes.justifySpaceBetween,
                  )}
                >
                  {step > 1 ? (
                    <CustomButton
                      variant="contained"
                      primaryButtonStyle
                      customButtonStyle
                      startIcon={<NavigateBeforeIcon />}
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
                      endIcon={<NavigateNextIcon />}
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
                        disabled={verifiedStep > 3 ? false : true}
                        fullWidth
                        size="large"
                        //type="submit"
                        onClick={e => {
                          initUpload(
                            e,
                            newActivityObject,
                            props,
                            setNewActivityObject,
                            navigate,
                            formikProps,
                            setReadyForSubmit,
                          );
                        }}
                      >
                        {t(`createActivity.buttons.${id ? 'Edit' : 'Submit'}`)}
                      </CustomButton>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Box>
          </Box>

          <Dialog
            PaperProps={{
              style: {
                backgroundColor: 'transparent',
                boxShadow: 'none',
              },
            }}
            className={project_classes.uploadProgressDialogStyle}
            open={newActivityObject.submitting}
            aria-labelledby="upload progress dialog"
          >
            <Box className={project_classes.uploadProgressIndicatorContainerStyle}>
              <CircularProgress
                className={project_classes.uploadProgressStyle}
                variant="determinate"
                size={70}
                thickness={6}
                value={newActivityObject.loadProgress}
              />
              <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography
                  className={project_classes.uploadProgressLabelStyle}
                  variant="caption"
                  component="div"
                >{`${newActivityObject.loadProgress}%`}</Typography>
              </Box>
            </Box>
          </Dialog>
        </div>
      )}
    </>
  );
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    activities: state.activities,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getSignature: args => {
      return dispatch(AuthActions.getSignature(args));
    },
    setActivity: args => {
      return dispatch(activityActions.setActivity(args));
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
      learning_goals: '',
      facilitation_tips: '',
      video: '',
      making_steps: [
        {
          description: '',
          image: '',
        },
      ],
      materials_used: [],
      materials_used_image: '',
      inspiring_examples: [
        {
          description: '',
          credit: '',
          image: '',
        },
      ],
      activity_images: '',
      inspiring_artist: {
        image: '',
        name: '',
        short_biography: '',
      },
    }),
    validationSchema,
  })(CreateActivity),
);
