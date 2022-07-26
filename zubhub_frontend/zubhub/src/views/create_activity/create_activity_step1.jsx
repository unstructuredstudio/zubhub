import React, {useState, useEffect} from 'react'
import clsx from 'clsx';
import 'react-toastify/dist/ReactToastify.css';
import { makeStyles } from '@material-ui/core/styles';
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
  ClickAwayListener,
} from '@material-ui/core';
import { vars, handleTextFieldChange, handleTextFieldBlur} from '../create_project/createProjectScripts';
import CustomButton from '../../components/button/Button';
import projectStyles from '../../assets/js/styles/views/create_project/createProjectStyles';
import { styles } from '../../assets/js/styles/views/create_activity/createActivityStyles'
import commonStyles from '../../assets/js/styles';
import InputText from '../../components/inputText/inputText';
import FormLabel from '../../components/form_labels/formLabel';
import Input from '../../components/input/input';
const useProjectStyles = makeStyles(projectStyles);
const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function CreateActivityStep1(props) {
    const classes = useProjectStyles()
    const activity_classes = useStyles()
    const common_classes = useCommonStyles()
    const [newActivity, setNewActivity] = useState(props.newActivity)
    const {t, validateStep} = {...props} 
    const setFieldValue = (value, field) => {
      const fieldObject = {}
      fieldObject[field] = value
      setNewActivity((prevactivity) => ({ ...prevactivity, ...fieldObject }))
    }
    
  return (
    <div className={activity_classes.createActivityStepContainer}>
          <Grid container spacing={3}>
            <Grid item xs={12} className={common_classes.marginTop1em}>
              
                <FormLabel 
                  label={"title"}
                  classes={classes}
                  common_classes={common_classes}
                  inputOrder={1}
                  fieldLabel={t('createActivity.inputs.title.label')}
                />
                <Input 
                  classes= {classes}
                  defaultValue={props.newActivity['title']? props.newActivity.title : ''}
                  label={'title'}
                  {...props}
                />
                
            </Grid>
            <Grid item xs={12} className={common_classes.marginTop1em}>
              <FormLabel 
                  label={'motivation'}
                  classes={classes}
                  common_classes={common_classes}
                  inputOrder={2}
                  fieldLabel={t('createActivity.inputs.motivation.label')}
                />
              <InputText
                label={'motivation'} 
                classes={classes} 
                common_classes={common_classes}
                activity_classes={activity_classes}
                helperText={t('createActivity.inputs.motivation.helperText')} 
                placeholder={t('createActivity.inputs.motivation.placeholder')} 
                vars={vars}
                {...props}
              />
            </Grid> 
            <Grid item xs={12} className={common_classes.marginTop1em}>
              <FormLabel 
                  label={'learningGoals'}
                  classes={classes}
                  common_classes={common_classes}
                  inputOrder={3}
                  fieldLabel={t('createActivity.inputs.learningGoals.label')}
                />
              <InputText 
                classes={classes} 
                common_classes={common_classes}
                activity_classes={activity_classes}
                //value={newActivity.learningGoals} 
                label={'learningGoals'} 
                helperText={t('createActivity.inputs.learningGoals.helperText')} 
                placeholder={t('createActivity.inputs.learningGoals.placeholder')} 
                // setValue={setNewActivity}
                vars={vars}
                {...props}
              />
            </Grid>
            
          </Grid>
    </div>
  )
}

export default CreateActivityStep1