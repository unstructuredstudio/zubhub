import React from 'react'
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withFormik } from 'formik';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import 'react-toastify/dist/ReactToastify.css';

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
    const {id} = {...props}
    const handleSetCreateActivityState = props.handleSetState
    const validateStep2 = () => {
      handleSetCreateActivityState({step: 3})
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
                            {'createActivity.inputs.titleStep2.label'}
                          </Typography>
                        </label>
                        <OutlinedInput
                          //ref={refs.title_el}
                          className={classes.customInputStyle}
                          id="title"
                          name="title"
                          type="text"
                         // onChange={e => handleTextFieldChange(e, props)}
                         // onBlur={e => handleTextFieldBlur(e, props)}
                        />
                        {/* <FormHelperText
                          error
                          className={classes.fieldHelperTextStyle}
                        >
                          {(props.status && props.status['title']) ||
                            (props.touched['title'] &&
                              props.errors['title'] &&
                              t(
                                `createProject.inputs.title.errors.${props.errors['title']}`,
                              ))}
                        </FormHelperText> */}
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
                            {'createActivity.inputs.motivation.label'}
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
                          {'createActivity.inputs.motivation.helperText'}
                        </Typography>
                        <ClickAwayListener
                        //   onClickAway={() =>
                        //     handleSetState({ desc_input_is_focused: false })
                        //   }
                        >
                          <ReactQuill
                            // ref={refs.desc_el}
                            // className={clsx(
                            //   classes.descInputStyle,
                            //   {
                            //     [classes.descInputFocusStyle]:
                            //       desc_input_is_focused,
                            //   },
                            //   {
                            //     [classes.descInputErrorStyle]:
                            //       (props.status &&
                            //         props.status['description']) ||
                            //       (props.touched['description'] &&
                            //         props.errors['description']),
                            //   },
                            // )}
                            // modules={vars.quill.modules}
                            // formats={vars.quill.formats}
                            defaultValue={''}
                            placeholder={
                              'createActivity.inputs.motivation.placeholder'
                            }
                            // onChange={value =>
                            //   handleDescFieldChange(
                            //     value,
                            //     props,
                            //     handleSetState,
                            //   )
                            // }
                            // onFocus={() =>
                            //   handleDescFieldFocusChange(
                            //     null,
                            //     props,
                            //     handleSetState,
                            //   )
                            // }
                          />
                        </ClickAwayListener>
                        {/* <FormHelperText
                          error
                          className={classes.fieldHelperTextStyle}
                        >
                          {(props.status && props.status['description']) ||
                            (props.touched['description'] &&
                              props.errors['description'] &&
                              t(
                                `createProject.inputs.description.errors.${props.errors['description']}`,
                              ))}
                        </FormHelperText> */}
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
                            {'createActivity.inputs.learningGoals.label'}
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
                          {'createActivity.inputs.learningGoals.helperText'}
                        </Typography>
                        <ClickAwayListener
                        //   onClickAway={() =>
                        //     handleSetState({ desc_input_is_focused: false })
                        //   }
                        >
                          <ReactQuill
                            // ref={refs.desc_el}
                            // className={clsx(
                            //   classes.descInputStyle,
                            //   {
                            //     [classes.descInputFocusStyle]:
                            //       desc_input_is_focused,
                            //   },
                            //   {
                            //     [classes.descInputErrorStyle]:
                            //       (props.status &&
                            //         props.status['description']) ||
                            //       (props.touched['description'] &&
                            //         props.errors['description']),
                            //   },
                            // )}
                            // modules={vars.quill.modules}
                            // formats={vars.quill.formats}
                            defaultValue={''}
                            placeholder={
                              'createActivity.inputs.learningGoals.placeholder'
                            }
                            // onChange={value =>
                            //   handleDescFieldChange(
                            //     value,
                            //     props,
                            //     handleSetState,
                            //   )
                            // }
                            // onFocus={() =>
                            //   handleDescFieldFocusChange(
                            //     null,
                            //     props,
                            //     handleSetState,
                            //   )
                            // }
                          />
                        </ClickAwayListener>
                        {/* <FormHelperText
                          error
                          className={classes.fieldHelperTextStyle}
                        >
                          {(props.status && props.status['description']) ||
                            (props.touched['description'] &&
                              props.errors['description'] &&
                              t(
                                `createProject.inputs.description.errors.${props.errors['description']}`,
                              ))}
                        </FormHelperText> */}
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
                        onClick = { validateStep2 }
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