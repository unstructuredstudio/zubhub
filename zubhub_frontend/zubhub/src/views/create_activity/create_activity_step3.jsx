import React, { useState } from 'react';
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
import FormLabel from '../../components/form_labels/formLabel';
import AddMore from '../../components/addMore/addMore';
import Input from '../../components/input/input';
const useProjectStyles = makeStyles(projectStyles);
const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function CreateActivityStep3(props) {
  const {
    t,
    newActivityObject,
    setNewActivityObject,
    formikProps,
    validateSteps,
  } = props;
  const classes = useProjectStyles();
  const activity_classes = useStyles();
  const common_classes = useCommonStyles();
  const [newActivity, setNewActivity] = useState(props.newActivity);
  const [creationSteps, setCreationSteps] = useState(
    newActivityObject.creationSteps ? newActivityObject.creationSteps : [''],
  );
  const [inspiringExemples, setInspiringExemples] = useState(
    newActivityObject.inspiringExemples
      ? newActivityObject.inspiringExemples
      : [''],
  );

  return (
    <div className={activity_classes.createActivityStepContainer}>
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          md={12}
          sm={12}
          className={common_classes.marginTop1em}
        >
          <FormLabel
            label={'creationSteps'}
            classes={classes}
            common_classes={common_classes}
            inputOrder={7}
            fieldLabel={t('createActivity.inputs.creationSteps.label')}
          />
          {creationSteps.map((creationStep, index) => (
            <Grid
              item
              xs={12}
              md={12}
              sm={12}
              className={clsx(
                common_classes.marginTop1em,
                common_classes.outlined,
              )}
            >
              <InputText
                name={`creationSteps[${index}]`}
                classes={classes}
                common_classes={common_classes}
                activity_classes={activity_classes}
                helperText={''}
                placeholder={`${t(
                  'createActivity.inputs.creationSteps.placeholder',
                )} ${index + 1}`}
                formikProps={props.formikProps}
                newActivityObject={props.newActivityObject}
                setNewActivityObject={props.setNewActivityObject}
                validateSteps={props.validateSteps}
                vars={vars}
                t={props.t}
              />
              <Grid
                item
                xs={12}
                md={3}
                sm={6}
                className={common_classes.marginTop1em}
              >
                <UploadFile
                  key={`makingStepsImagesKey[${index}]`}
                  name={`makingStepsImages[${index}]`}
                  fileType={'image/*'}
                  uploadButtonLabel={t(
                    'createActivity.inputs.creationSteps.image.label',
                  )}
                  classes={classes}
                  newActivityObject={newActivityObject}
                  setNewActivityObject={setNewActivityObject}
                  formikProps={formikProps}
                  validateSteps={validateSteps}
                  t={t}
                  multiple={false}
                  countFilesText={[
                    props.t('createActivity.inputs.image'),
                    props.t('createActivity.inputs.images'),
                  ]}
                />
              </Grid>
            </Grid>
          ))}
          <Grid
            item
            spacing={3}
            container
            direction="row"
            alignItems="flex-end"
            justifyContent="flex-end"
          >
            <AddMore
              setNodeList={setCreationSteps}
              label={t('createActivity.inputs.creationSteps.addMore')}
            />
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          sm={12}
          className={common_classes.marginTop1em}
        >
          <FormLabel
            label={'InspiringArtist'}
            classes={classes}
            common_classes={common_classes}
            inputOrder={8}
            fieldLabel={t('createActivity.inputs.inspiringArtist.label')}
          />
          <Grid
            item
            xs={12}
            md={12}
            sm={12}
            className={clsx(
              common_classes.marginTop1em,
              common_classes.outlined,
            )}
          >
            <Input
              label={'ArtistFullName'}
              key={`inspiringArtistFullNameKey`}
              name={`inspiringArtistFullName`}
              classes={classes}
              formikProps={formikProps}
              validateSteps={validateSteps}
              t={t}
              newActivityObject={newActivityObject}
              setNewActivityObject={setNewActivityObject}
            />
            <InputText
              name={`inspiringArtist`}
              classes={classes}
              common_classes={common_classes}
              activity_classes={activity_classes}
              helperText={''}
              placeholder={t(
                'createActivity.inputs.inspiringArtist.placeholder',
              )}
              formikProps={props.formikProps}
              newActivityObject={props.newActivityObject}
              setNewActivityObject={props.setNewActivityObject}
              validateSteps={props.validateSteps}
              vars={vars}
              t={props.t}
            />

            <Grid
              item
              xs={12}
              md={3}
              sm={6}
              className={common_classes.marginTop1em}
            >
              <UploadFile
                key={`inspiringArtistImageKey`}
                name={`inspiringArtistImage`}
                fileType={'image/*'}
                uploadButtonLabel={t(
                  'createActivity.inputs.inspiringArtist.image.label',
                )}
                classes={classes}
                newActivityObject={newActivityObject}
                setNewActivityObject={setNewActivityObject}
                formikProps={formikProps}
                validateSteps={validateSteps}
                t={t}
                multiple={false}
                countFilesText={[
                  props.t('createActivity.inputs.image'),
                  props.t('createActivity.inputs.images'),
                ]}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          sm={12}
          className={clsx(
            common_classes.marginTop3em,
            common_classes.marginBottom1em,
          )}
        >
          <FormLabel
            label={'inspiringExemples'}
            classes={classes}
            common_classes={common_classes}
            inputOrder={9}
            fieldLabel={t('createActivity.inputs.inspiringExemples.label')}
          />
          <Grid
            className={clsx(
              common_classes.marginTop1em,
              common_classes.outlined,
            )}
          >
            {inspiringExemples.map((inspiringExemple, index) => (
              <Grid container direction="row" spacing={3}>
                <Grid item xs={12} md={4} sm={6}>
                  <Input
                    label={`Img-${index + 1} desc`}
                    multiline={true}
                    key={`inspiringExemplesDescriptionsKey[${index}]`}
                    name={`inspiringExemplesDescriptions[${index}]`}
                    classes={classes}
                    formikProps={formikProps}
                    validateSteps={validateSteps}
                    t={t}
                    newActivityObject={newActivityObject}
                    setNewActivityObject={setNewActivityObject}
                  />
                </Grid>
                <Grid item xs={12} md={3} sm={6}>
                  <Input
                    label={`Img-${index + 1} credit`}
                    key={`inspiringExemplesCreditsKey[${index}]`}
                    name={`inspiringExemplesCredits[${index}]`}
                    classes={classes}
                    formikProps={formikProps}
                    validateSteps={validateSteps}
                    t={t}
                    newActivityObject={newActivityObject}
                    setNewActivityObject={setNewActivityObject}
                  />
                </Grid>
                <Grid item xs={12} md={3} sm={6}>
                  <UploadFile
                    key={`inspiringExemplesImagesKey[${index}]`}
                    name={`inspiringExemplesImages[${index}]`}
                    fileType={'image/*'}
                    uploadButtonLabel={t(
                      'createActivity.inputs.inspiringExemples.image.label',
                    )}
                    classes={classes}
                    newActivityObject={newActivityObject}
                    setNewActivityObject={setNewActivityObject}
                    formikProps={formikProps}
                    validateSteps={validateSteps}
                    t={t}
                    multiple={false}
                    countFilesText={[
                      props.t('createActivity.inputs.image'),
                      props.t('createActivity.inputs.images'),
                    ]}
                  />
                </Grid>
              </Grid>
            ))}
          </Grid>
          <Grid
            item
            spacing={3}
            container
            direction="row"
            alignItems="flex-end"
            justifyContent="flex-end"
          >
            <AddMore
              setNodeList={setInspiringExemples}
              label={t('createActivity.inputs.inspiringExemples.addMore')}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default CreateActivityStep3;
