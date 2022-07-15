import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { styles } from '../../assets/js/styles/views/create_activity/createActivityStyles'
import {
  Grid,
  Box,
} from '@material-ui/core';
import commonStyles from '../../assets/js/styles';
import { calcAlignLeft, isCompleted, widthToColorPercent, arrayFromStepCount } from './multiStepProgressBarScripts'
const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function MultiStepProgressBar(props) {
  const [state, setState] = useState({...props})
  useEffect(() => {
    setState({...props})
  }, [props])
    
  const classes = useStyles()
  const common_classes = useCommonStyles()

  return (
    <div>
        <Box className={classes.activityCreationProgressBar} >
          <Box className={classes.activityCreationProgressBarScroller}
              style={{width:  widthToColorPercent(state.step, state.stepCount)}}
          />
          {arrayFromStepCount(state.stepCount).map((step,index) => (
              
              <Box className={classes.progressNumberStyle}
                key={index}
                style={{backgroundColor: isCompleted(step, state.step)? '#00B8C4' : 'white', 
                       color: isCompleted(step, state.step)? 'white' : '#00B8C4',
                       left: `calc(${calcAlignLeft(step - 1, state.stepCount)} - 15px) `
                    }}
              >  
                {isCompleted(step, state.step)? `\u2713` : step}
              </Box>
          ))} 
        </Box>
    </div>
  )
}

export default MultiStepProgressBar