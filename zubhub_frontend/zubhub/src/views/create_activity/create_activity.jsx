import React from 'react'
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

const useStyles = makeStyles(styles)

function CreateActivity() {
    const classes = useStyles()
  return (
    <div className={classes.createActivityContainer} >
      <Box className={classes.createActivityBoxContainer}>
        <Typography
          variant="h2"
          component="h2"
          className={classes.createActivityContainerTitle}
        >
          Create Activity
        </Typography>
        <Box 
          className={classes.CreateActivityFormContainer}>
          <CreateActivityStep1 />
        </Box>
      </Box>
    </div>
  )
}

export default CreateActivity