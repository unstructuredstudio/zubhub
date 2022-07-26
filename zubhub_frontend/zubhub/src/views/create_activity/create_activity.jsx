import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { styles } from '../../assets/js/styles/views/create_activity/createActivityStyles'
import { withFormik } from 'formik';
import clsx from 'clsx';
import CustomButton from '../../components/button/Button';
import { validationSchema } from './createActivityScripts'
import {
  Grid,
  Box,
  Typography,
} from '@material-ui/core';
import CreateActivityStep1 from './create_activity_step1';
import CreateActivityStep2 from './create_activity_step2';
import CreateActivityStep3 from './create_activity_step3';
import commonStyles from '../../assets/js/styles';
import MultiStepProgressBar from '../../components/multi_step_progress_bar/multiStepProgressBar';
const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);


function CreateActivity(props) {
  const { t } = props
  const classes = useStyles()
  const common_classes = useCommonStyles()
  const stepComponentsMap = {
    1: (props) => <CreateActivityStep1 {...props}/>,
    2: (props) => <CreateActivityStep2 {...props}/>,
    3: (props) => <CreateActivityStep3 {...props}/>,
  }
  const [state, setState] = useState(
    {
      step: 1,
      verifiedStep: 1,
      newActivity: {},
    }
    )

  const handleSetState = obj => {
      if (obj) {
        Promise.resolve(obj).then(obj => {
          setState(state => ({ ...state, ...obj }));
        });
    }
  };
 
  const requireFieldByStep = [['title', 'motivation', 'learningGoals'], 
    ['materialsUsed', 'facilitationTips'], 
    ['creationSteps', 'inspiringExemplesDescriptions', 'inspiringExemplesCredits']
    ]
  const validateSteps = () => {
    let stepVerified = true
    for(let i = 0; i < requireFieldByStep.length ; i++){
      stepVerified = true
      requireFieldByStep[i].map(field => {
        if(!(props.touched[field] && !props.errors[field])){
          stepVerified = false
          state.verifiedStep = i + 1
        }  
      })
      if(stepVerified){
        handleSetState({verifiedStep: i + 2})
      }else {
        break;
      }   
    }
  }
  props= {...props, 
    'newActivity': state.newActivity, 
    'verifiedStep': state.verifiedStep, 
    'validateSteps': validateSteps,
    'handleSetState': handleSetState 
  }

  const visitePrev = () => {
    handleSetState({step: state.step - 1})
  }
  const visiteNext = () => {
    handleSetState({step: state.step + 1})
  }
  const submitValues = () => {
    console.log('from submit props',props)
    handleSetState({newActivity: 
      {'title': props.values.title, 
      'motivation': props.values.motivation,
      'materialsUsed': props.values.materialsUsed,
      'learningGoals': props.values.learningGoals,
      'facilitationTips': props.values.facilitationTips,
      'creationSteps': props.values.creationSteps,
      'inspiringArtist': props.values.inspiringArtist,
      'inspiringExemplesDescriptions': props.values.inspiringExemplesDescriptions,
      'inspiringExemplesCredits': props.values.inspiringExemplesCredits
    }})
  } 
  console.log('newActivity', state.newActivity)
  return (
    <div className={classes.createActivityContainer} >
      <Box 
        className={classes.createActivityBoxContainer}
        >
        <Typography
          variant="h3"
          component="h2"
          className={classes.createActivityContainerTitle
        }
        >
          {t('createActivity.welcomeMsg.primary')}
        </Typography>
        <MultiStepProgressBar step={state.verifiedStep} stepCount={4} />
        
          <Box 
            className={classes.CreateActivityFormContainer}>
           <form>   
            { stepComponentsMap[state.step]({...props})}
          </form> 
          <Box className={clsx(common_classes.margin)}>
          <Grid item xs={12}
              spacing={5} 
              className={clsx(
                common_classes.marginTop3em, 
                common_classes.displayFlex, 
                state.step === 1? common_classes.justifyRight : common_classes.justifySpaceBetween
                )}>
                {state.step > 1?
                <CustomButton
                  variant="contained"
                  primaryButtonStyle
                  customButtonStyle
                  size="small"
                  onClick={visitePrev}
                  >
                  {t('createActivity.buttons.Prev')}
                </CustomButton> 
              : ''}
              { state.step < 3?
                <CustomButton
                  variant="contained"
                  primaryButtonStyle
                  customButtonStyle
                  size="small"
                  onClick= {visiteNext} 
                  >
                  {t('createActivity.buttons.Next')}
                </CustomButton>
                :
                <Grid item  xs={8} md={6} sm={6}>
                  <CustomButton
                    variant="contained"
                    primaryButtonStyle
                    customButtonStyle
                    disabled={state.verifiedStep > 3? false : true}
                    fullWidth
                    size="large"
                    onClick={submitValues}
                    >
                    {t('createActivity.buttons.Submit')}
                  </CustomButton> 
                </Grid>  
               }
          </Grid>
         </Box>
      </Box>
      </Box>
    </div>
  )
}

export default withFormik({
    mapPropsToValue: () => ({
      title: '',
      motivation: '',
      learningGoals: '',
      facilitationTips: '',
      creationSteps: [],
      materialsUsed: [],
      inspiringArtist: '',
      inspiringExemplesDescriptions: [],
      inspiringExemplesCredits: []
    }),
    validationSchema,
  })(CreateActivity);