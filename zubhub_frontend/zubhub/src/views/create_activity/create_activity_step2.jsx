import React, {useState} from 'react'
import clsx from 'clsx';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import 'react-toastify/dist/ReactToastify.css';
import {vars} from '../create_project/createProjectScripts'
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import ImageIcon from '@material-ui/icons/Image';
import VideoIcon from '@material-ui/icons/Movie';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import MovieIcon from '@material-ui/icons/Movie';
import InsertLinkIcon from '@material-ui/icons/InsertLink';
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
import CustomButton from '../../components/button/Button';
import projectStyles from '../../assets/js/styles/views/create_project/createProjectStyles';
import { styles } from '../../assets/js/styles/views/create_activity/createActivityStyles'
import commonStyles from '../../assets/js/styles';

const useProjectStyles = makeStyles(projectStyles);
const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function CreateActivityStep2(props) {
    const classes = useProjectStyles()
    const activity_classes = useStyles()
    const common_classes = useCommonStyles()
    const [newActivity, setNewActivity] = useState(props.newActivity) 
    const {t} = {...props}
    const handleSetCreateActivityState = props.handleSetState
    const setFieldValue = (value, field) => {
      const fieldObject = {}
      fieldObject[field] = value
      setNewActivity((prevactivity) => ({ ...prevactivity, ...fieldObject }))
    }
    const setMotivation = (value) => {
      setNewActivity((prevactivity) => ({ ...prevactivity, motivation: value}))
    }

    const setLearningGoals = (value) => {
      setNewActivity((prevactivity) => ({ ...prevactivity, learningGoals: value}))
    }
    const validateStep2 = () =>{
      props.handleSetState({step: 3, newActivity: newActivity})      
    }
  return (
    <div className={activity_classes.createActivityStepContainer}>
      <form>
                  <Grid container spacing={3}>

                    <Grid item xs={12} className={common_classes.marginTop1em}>
                      <FormControl
                        className={clsx(classes.margin, classes.textField)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        margin="small"
                      >
                        <label htmlFor="title">
                          <Typography
                            color="textSecondary"
                            className={clsx(
                              classes.customLabelStyle,
                              common_classes.marginBottom1em,
                            )}
                          >
                            <Box className={classes.fieldNumberStyle}>1</Box>
                            {t('createActivity.inputs.title.label')}
                          </Typography>
                        </label>
                        <OutlinedInput
                          className={classes.customInputStyle}
                          id="title"
                          name="title"
                          type="text"
                          onBlur={e => setFieldValue( e.target.value, 'title') }
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} className={common_classes.marginTop1em}>
                      <FormControl
                        className={clsx(classes.margin, classes.textField)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        margin="small"
                      >
                        <label htmlFor="motivation">
                          <Typography
                            color="textSecondary"
                            className={clsx(
                              classes.customLabelStyle,
                              common_classes.marginBottom1em,
                            )}
                          >
                            <Box className={classes.fieldNumberStyle}>2</Box>
                            {t('createActivity.inputs.motivation.label')}
                          </Typography>
                        </label>
                        <Typography
                          color="textSecondary"
                          variant="caption"
                          component="span"
                          className={clsx(
                            classes.fieldHelperTextStyle,
                            common_classes.marginBottom1em,
                          )}
                        >
                          {t('createActivity.inputs.motivation.helperText')}
                        </Typography>
                        <ClickAwayListener
                          // onClickAway={setNewActivity()}
                        >
                          <ReactQuill
                            className= {activity_classes.reactQuillStyle}
                            modules={vars.quill.modules}
                            formats={vars.quill.formats}
                            placeholder={
                              t('createActivity.inputs.motivation.placeholder')
                            }
                            value={ newActivity.motivation? newActivity.motivation : '' }
                            onChange={setMotivation}
                          />
                        </ClickAwayListener>
                      </FormControl>
                    </Grid> 

                    <Grid item xs={12} className={common_classes.marginTop1em}>
                      <FormControl
                        className={clsx(classes.margin, classes.textField)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        margin="small"
                      >
                        <label htmlFor="learningGoals">
                          <Typography
                            color="textSecondary"
                            className={clsx(
                              classes.customLabelStyle,
                              common_classes.marginBottom1em,
                            )}
                          >
                            <Box className={classes.fieldNumberStyle}>3</Box>
                            {t('createActivity.inputs.learningGoals.label')}
                          </Typography>
                        </label>
                        <Typography
                          color="textSecondary"
                          variant="caption"
                          component="span"
                          className={clsx(
                            classes.fieldHelperTextStyle,
                            common_classes.marginBottom1em,
                          )}
                        >
                          {t('createActivity.inputs.learningGoals.helperText')}
                        </Typography>
                          <ReactQuill
                            modules={vars.quill.modules}
                            formats={vars.quill.formats}
                            defaultValue={''}
                            placeholder={
                              t('createActivity.inputs.learningGoals.placeholder')
                            }
                            value={ newActivity.learningGoals? newActivity.learningGoals : '' }
                            onChange={setLearningGoals}
                          />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} 
                      className={common_classes.marginTop3em+' '
                                 +common_classes.marginBottom1em+' '
                                 +common_classes.displayFlex+' '
                                 +common_classes.justifyRight
                                 }>
                        <CustomButton
                        variant="contained"
                        primaryButtonStyle
                        customButtonStyle
                        size="small"
                        onClick= {validateStep2} 
                        >
                        {'Next ->'}
                        </CustomButton> 
                    </Grid>
                </Grid>
      </form>
    </div>
  )
}

export default CreateActivityStep2