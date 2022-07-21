import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { styles } from '../../assets/js/styles/views/create_activity/createActivityStyles'
import { withFormik } from 'formik';
import { validationSchema } from './createActivityScripts'
import {
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
  const [state, setState] = useState(
    {
      step: 1,
      newActivity: {},
    }
    )
  console.log('create activity state:::', state)  
  const handleSetState = obj => {
      if (obj) {
        Promise.resolve(obj).then(obj => {
          setState(state => ({ ...state, ...obj }));
        });
    }
  };
  const validateStep = (step, newActivity) =>{
      handleSetState({step: step, newActivity: newActivity})      
    }
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
        <MultiStepProgressBar step={state.step} stepCount={4} />
        <form>
          <Box 
            className={classes.CreateActivityFormContainer}>
            {state.step === 1?
              <CreateActivityStep1 
                handleSetState= {handleSetState} 
                newActivity= {state.newActivity}
                validateStep= {validateStep} 
                t= {t}
                {...props}
                /> :state.step === 2?
              <CreateActivityStep2 
                handleSetState= {handleSetState} 
                newActivity= {state.newActivity} 
                t= {t}
                />
                :
              <CreateActivityStep3
                handleSetState= {handleSetState} 
                newActivity= {state.newActivity} 
                t= {t}
                />  
            }
            
          </Box>
        </form>
      </Box>
      
    </div>
  )
}

export default withFormik({
    mapPropsToValue: () => ({
      title: '',
      motivation: '',
    }),
    validationSchema,
  })(CreateActivity);