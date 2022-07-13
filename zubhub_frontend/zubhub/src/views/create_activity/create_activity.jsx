import React, { useState } from 'react'
import {connect} from 'react-redux'
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
//import DoneIcon from '@mui/icons-material/Done';
import CreateActivityStep1 from './create_activity_step1';
import CreateActivityStep2 from './create_activity_step2';
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);


function CreateActivity(props) {
  const classes = useStyles()
  const common_classes = useCommonStyles()
  const [state, setState] = useState(
    {
      step: 0,
      newActivity: {},
    }
    )
  console.log('state:::', state)  
  const handleSetState = obj => {
      if (obj) {
        Promise.resolve(obj).then(obj => {
          setState(state => ({ ...state, ...obj }));
        });
    }
  };

  const isCompleted = (step) => {
    if(step === 1){
      return (state.step === 1 || state.step === 2) ? true : false 
    }
    if(step === 2){
      return (state.step === 3) ? true : false 
    }
    if(step === 3){
      return (state.step === 4) ? true : false 
    }
  }
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

        <Box className={classes.activityCreationProgressBar} >
          <Box className={classes.activityCreationProgressBarScroller}
              style={{width: state.step === 0? '1%' : state.step === 1? '25%' : '50%'}}
          />
          <Box className={classes.progressNumberStyle+' '+common_classes.Left} 
               style={{backgroundColor: isCompleted(1)? '#00B8C4' : 'white', 
                       color: isCompleted(1)? 'white' :'#00B8C4'} }
              >{isCompleted(1)? `\u2713` : 1}</Box>
          <Box className={classes.progressNumberStyle+' '+common_classes.selfCenter} 
               style={{}}
              >2</Box>
          <Box className={classes.progressNumberStyle+' '+common_classes.Right} 
               style={{}}
              >3</Box>
        </Box>
        <Box 
          className={classes.CreateActivityFormContainer}>
          {state.step === 0? 
            <CreateActivityStep1 handleSetState= {handleSetState} newActivity= {state.newActivity} /> :
            <CreateActivityStep2 handleSetState={handleSetState}/>
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