import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import InputText from '../../components/inputText/inputText';
import 'react-toastify/dist/ReactToastify.css';
import { vars } from '../create_project/createProjectScripts';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, FormControl, Box, Typography } from '@material-ui/core';
import CustomButton from '../../components/button/Button';
import projectStyles from '../../assets/js/styles/views/create_project/createProjectStyles';
import { styles } from '../../assets/js/styles/views/create_activity/createActivityStyles';
import commonStyles from '../../assets/js/styles';
import MaterialsUsed from '../../components/materialsUsed/materialsUsed';
import UploadFile from '../../components/upload_file/uploadFile';
import Input from '../../components/input/input';
import FormLabel from '../../components/form_labels/formLabel';
const useProjectStyles = makeStyles(projectStyles);
const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function CreateActivityStep2(props) {
  const classes = useProjectStyles();
  const activity_classes = useStyles();
  const common_classes = useCommonStyles();
  const [disableVideo, setDisableVideo] = useState(false);
  const { t, formikProps, validateSteps } = props;

  useEffect(() => {
    setDisableVideo(props.formikProps.formikValues['video'] ? true : false);
  }, [props.formikProps.formikValues]);

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
            activity_classes={activity_classes}
            common_classes={common_classes}
            addMoreLabel={t('createProject.inputs.materialsUsed.addMore')}
            encouragingText={t(
              'createActivity.inputs.materialsUsed.encouragingText',
            )}
            imagesButtonLabel={t(
              'createActivity.inputs.materialsUsed.images.label',
            )}
            formikProps={formikProps}
            validateSteps={validateSteps}
            t={t}
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
            name={'facilitation_tips'}
            classes={classes}
            common_classes={common_classes}
            activity_classes={activity_classes}
            fieldType={{ simple: true, nested: false, array: false }}
            helperText={t('createActivity.inputs.facilitationTips.helperText')}
            placeholder={t(
              'createActivity.inputs.facilitationTips.placeholder',
            )}
            formikProps={props.formikProps}
            validateSteps={props.validateSteps}
            vars={vars}
            t={props.t}
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
            name={'activity_images'}
            fileType={'image/*'}
            uploadButtonLabel={t(
              'createActivity.inputs.materialsUsed.images.label',
            )}
            classes={classes}
            activity_classes={activity_classes}
            fieldType={{ simple: true, nested: false, array: false }}
            formikProps={formikProps}
            validateSteps={validateSteps}
            t={t}
            multiple={true}
            countFilesText={[
              props.t('createActivity.inputs.image'),
              props.t('createActivity.inputs.images'),
            ]}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          sm={12}
          className={common_classes.marginTop1em}
        >
          <FormLabel
            label={'ActivityVideo'}
            required={true}
            classes={classes}
            common_classes={common_classes}
            inputOrder={6}
            fieldLabel={'Add a video if provided'}
          />
          <Input
            label={'video url'}
            classes={classes}
            name={'video'}
            fieldType={{ simple: true, nested: false, array: false }}
            formikProps={formikProps}
            validateSteps={validateSteps}
            disabled={disableVideo}
            t={t}
          />
          <Grid
            item
            xs={12}
            md={4}
            sm={4}
            // className={common_classes.marginTop1em}
          >
            <UploadFile
              name={'video'}
              fileType={'video/*'}
              uploadButtonLabel={'Upload Video'}
              classes={classes}
              fieldType={{ simple: true, nested: false, array: false }}
              activity_classes={activity_classes}
              formikProps={formikProps}
              validateSteps={validateSteps}
              disabled={disableVideo}
              t={t}
              multiple={true}
              countFilesText={['video added', 'videos added']}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default CreateActivityStep2;