import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { styles } from '../../assets/js/styles/views/create_activity/createActivityStyles';
import { withFormik } from 'formik';
import clsx from 'clsx';
import CustomButton from '../../components/button/Button';
import {
  validationSchema,
  initUpload,
  refactorNewActivityObject,
  deserializeFieldsData,
} from './createActivityScripts';

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
  const { id } = props.match.params;
  const classes = useStyles();
  const common_classes = useCommonStyles();
  const stepComponentsMap = {
    1: props => <CreateActivityStep1 {...props} />,
    2: props => <CreateActivityStep2 {...props} />,
    3: props => <CreateActivityStep3 {...props} />,
  };

  const [step, setStep] = useState(1);
  const [verifiedStep, setVerifiedStep] = useState(1);
  const [newActivityObject, setNewActivityObject] = useState({});
  const formikProps = {
    formikValues: props.values,
    touched: props.touched,
    errors: props.errors,
    setFieldValue: props.setFieldValue,
    setFieldTouched: props.setFieldTouched,
    handleChange: props.handleChange,
    handleBlur: props.handleBlur,
  };
  useEffect(() => {
    if (id) {
      const activityToUpdate = props.activities?.all_activities.filter(
        item => item.id === id,
      )[0];
      setNewActivityObject(state => {
        const args = deserializeFieldsData(
          activityToUpdate,
          formikProps.setFieldValue,
          formikProps.setFieldTouched,
        );
        return {
          ...state,
          id: id,
          ...args,
        };
      });
    }
  }, []);

  const submitButtonRef = React.useRef(null);
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

  const visitePrev = () => {
    setStep(step => step - 1);
  };
  const visiteNext = () => {
    setStep(step => step + 1);
  };
  console.log('newActivityObject', props, newActivityObject);
  return (
    <div className={classes.createActivityContainer}>
      <Box className={classes.createActivityBoxContainer}>
        <Typography
          variant="h3"
          component="h2"
          className={classes.createActivityContainerTitle}
        >
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
                      );
                    }}
                  >
                    {t(`createActivity.buttons.${id ? 'Edit' : 'Submit'}`)}
                  </CustomButton>
                  <button
                    type="submit"
                    style={{ display: 'none' }}
                    ref={submitButtonRef}
                    onClick={e =>
                      initUpload(
                        e,
                        newActivityObject,
                        props,
                        setNewActivityObject,
                        formikProps,
                      )
                    }
                  ></button>
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
    activities: state.activities,
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
      materialsUsedImage: '',
      inspiringArtist: '',
      inspiringExemplesDescriptions: [],
      inspiringExemplesCredits: [],
      inspiringExemplesImages: '',
      activityImages: '',
      inspiringArtistImage: '',
      inspiringArtistFullName: '',
    }),
    validationSchema,
  })(CreateActivity),
);
