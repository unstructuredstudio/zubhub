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

function CreateActivityStep1(props) {
    const project_classes = useProjectStyles()
    const classes = useStyles()
    const common_classes = useCommonStyles()
    const {id} = {...props}
  return (
    <div className={classes.createActivityStepContainer}>
      <form>
                  <Grid container spacing={3}>

                    <Grid item xs={12} className={common_classes.marginTop1em}>
                      <FormControl
                        className={clsx(project_classes.margin, project_classes.textField)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        margin="small"
                      >
                        <label htmlFor="title">
                          <Typography
                            color="textSecondary"
                            className={clsx(
                              project_classes.customLabelStyle,
                              common_classes.marginBottom1em,
                            )}
                          >
                            <Box className={project_classes.fieldNumberStyle}>1</Box>
                            {'createActivity.inputs.title.label'}
                          </Typography>
                        </label>
                        <OutlinedInput
                          //ref={refs.title_el}
                          className={project_classes.customInputStyle}
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
                    
                </Grid>
      </form>
    </div>
  )
}

export default CreateActivityStep1