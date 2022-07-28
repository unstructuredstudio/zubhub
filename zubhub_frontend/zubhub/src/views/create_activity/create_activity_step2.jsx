import React, {useState} from 'react'
import clsx from 'clsx';
import InputText from '../../components/inputText/inputText';
import 'react-toastify/dist/ReactToastify.css';
import {vars} from '../create_project/createProjectScripts';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, FormControl, Box, Typography } from '@material-ui/core';
import CustomButton from '../../components/button/Button';
import projectStyles from '../../assets/js/styles/views/create_project/createProjectStyles';
import { styles } from '../../assets/js/styles/views/create_activity/createActivityStyles';
import commonStyles from '../../assets/js/styles';
import MaterialsUsed from '../../components/materialsUsed/materialsUsed';
import UploadFile from '../../components/upload_file/uploadFile';
import FormLabel from '../../components/form_labels/formLabel';
const useProjectStyles = makeStyles(projectStyles);
const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function CreateActivityStep2(props) {
    const classes = useProjectStyles()
    const activity_classes = useStyles()
    const common_classes = useCommonStyles()
    const [newActivity, setNewActivity] = useState(props.newActivity)
    const [materialsUsedList, setMaterialsUsedList] = useState(newActivity.materialsUsed? newActivity.materialsUsed : ['','',''] ) 
    const {t} = {...props}
    //console.log('newActivity 2', newActivity)
  return (
    <div className={activity_classes.createActivityStepContainer}>
      <Grid container spacing={3}>
        <Grid item xs={12} className={common_classes.marginTop1em}>
          <FormLabel
            label={'materialsUsed'}
            required={true}
            classes={classes}
            common_classes={common_classes}
            inputOrder={4}
            fieldLabel={t('createActivity.inputs.materialsUsed.label')}
          />
          <MaterialsUsed
            classes={classes}
            common_classes={common_classes}
            addMoreLabel={t('createProject.inputs.materialsUsed.addMore')}
            encouragingText={t(
              'createActivity.inputs.materialsUsed.encouragingText',
            )}
            imagesLabel={t('createActivity.inputs.materialsUsed.images.label')}
            materialsUsedList={materialsUsedList}
            setNewActivity={setNewActivity}
            t={t}
            {...props}
          />
        </Grid>
        <Grid item xs={12} className={common_classes.marginTop1em}>
          <FormLabel
            label={'facilitationTips'}
            required={true}
            classes={classes}
            common_classes={common_classes}
            inputOrder={5}
            fieldLabel={t('createActivity.inputs.facilitationTips.label')}
          />
          <InputText
            classes={classes}
            common_classes={common_classes}
            activity_classes={activity_classes}
            label={'facilitationTips'}
            helperText={t('createActivity.inputs.facilitationTips.helperText')}
            placeholder={t(
              'createActivity.inputs.facilitationTips.placeholder',
            )}
            vars={vars}
            {...props}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sm={6}
          className={common_classes.marginTop1em}
        >
          <FormLabel
            label={'ActivityImages'}
            required={true}
            classes={classes}
            common_classes={common_classes}
            inputOrder={6}
            fieldLabel={t('createActivity.inputs.activityImages.label')}
          />
          <UploadFile
            id={'activityImages'}
            fileType={'image/*'}
            uploadButtonLabel={t(
              'createActivity.inputs.materialsUsed.images.label',
            )}
            classes={classes}
            wraperState={props.newActivity}
            setWraperState={props.handleSetNewActivity}
            t={props.t}
            setFieldValue={props.setFieldValue}
            setStatus={props.setStatus}
            countFilesText={[
              props.t('createActivity.inputs.image'),
              props.t('createActivity.inputs.images'),
            ]}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default CreateActivityStep2