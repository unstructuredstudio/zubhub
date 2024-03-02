import React from 'react';
import { makeStyles } from '@mui/styles';
import { styles } from '../../assets/js/styles/views/create_activity/createActivityStyles';
import { Grid, Box } from '@mui/material';
import commonStyles from '../../assets/js/styles';
import {
  calcAlignLeft,
  isCompleted,
  widthToColorPercent,
  arrayFromStepCount,
} from './multiStepProgressBarScripts';
const useStyles = makeStyles(styles);

function MultiStepProgressBar(props) {
  // const [state, setState] = useState({...props})
  // useEffect(() => {
  //   setState({...props})
  // }, [props])
  
  const classes = useStyles();

  return (
    <div>
      <Box className={classes.activityCreationProgressBar}>
        <Box
          className={classes.activityCreationProgressBarScroller}
          style={{ width: widthToColorPercent(props.step, props.stepCount) }}
        />
        {arrayFromStepCount(props.stepCount).map((step, index) => (
          <Box
            className={classes.progressNumberStyle}
            key={index}
            style={{
              backgroundColor: isCompleted(step, props.step)
                ? 'var(--primary-color3)'
                : 'white',
              color: isCompleted(step, props.step) ? 'white' : 'var(--primary-color3)',
              left: `calc(${calcAlignLeft(step - 1, props.stepCount)} - 15px) `,
            }}
          >
            {isCompleted(step, props.step) ? `\u2713` : step}
          </Box>
        ))}
      </Box>
    </div>
  );
}

export default MultiStepProgressBar;
