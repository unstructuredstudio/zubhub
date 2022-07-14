import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { styles } from '../../assets/js/styles/views/create_activity/createActivityStyles'
import {
  Grid,
  Box,
  Container,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Dialog,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  OutlinedInput,
  FormHelperText,
  FormControl,
  InputLabel,
  ClickAwayListener,
} from '@material-ui/core';
import CreateActivityStep1 from './create_activity_step1';
import CreateActivityStep2 from './create_activity_step2';
import commonStyles from '../../assets/js/styles';
import MultiStepProgressBar from '../../components/multi_step_progress_bar/multiStepProgressBar'
const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);


function CreateActivity(props) {
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

  return (
    <div className={classes.createActivityContainer} >
      <Box className={classes.createActivityBoxContainer}>
        <Typography
          variant="h3"
          component="h2"
          className={classes.createActivityContainerTitle
        }
        >
          Create Activity
        </Typography>
        <MultiStepProgressBar step={state.step} stepCount={4} />
        <Box 
        
          className={classes.CreateActivityFormContainer}>
          {state.step === 1?
            <CreateActivityStep1 handleSetState= {handleSetState} newActivity= {state.newActivity} /> :
            <CreateActivityStep2 handleSetState={handleSetState} />
          }
          
        </Box>
      </Box>
    </div>
  )
}

// const mapStateToProps = state => {
//   return {
//     activityCreationReducer: state.activity,
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     setStep1Status: () => {
//       return dispatch(setStep1Status());
//     },
//     setStep2Status: () => {
//       return dispatch(setStep2Status());
//     }
//   };
//};

export default CreateActivity;