import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import InputText from '../../components/inputText/inputText';
import CancelIcon from '@material-ui/icons/Cancel';
import 'react-toastify/dist/ReactToastify.css';
import { vars } from '../create_project/createProjectScripts';
import {
  getMakingStepsRequiredError,
  deleteItem,
} from './createActivityScripts';
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
  const [makingSteps, setMakingSteps] = useState([]);
  //   formikProps.formikValues.making_steps
  //     ? formikProps.formikValues.making_steps
  //     : [
  //         {
  //           description: '',
  //           image: null,
  //         },
  //       ],
  // );
  const [inspiringExamples, setInspiringExamples] = useState(
    formikProps.formikValues.inspiring_examples
      ? formikProps.formikValues.inspiring_examples
      : [
          {
            description: '',
            credit: '',
            image: null,
          },
        ],
  );
  const newObject = values => {
    let newValues = { ...values };
    delete newValues['length'];
    return newValues;
  };
  useEffect(() => {
    setMakingSteps(
      formikProps.formikValues.making_steps
        ? newObject(formikProps.formikValues.making_steps)
        : [
            {
              description: '',
              image: null,
            },
          ],
    );
  }, [props]);
  Object.entries(makingSteps).map(([key, item]) => {
    console.log('making steps', key);
  });

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
          {Object.keys(makingSteps).map(key => (
            <Grid
              item
              xs={12}
              md={12}
              sm={12}
              className={clsx(
                activity_classes.itemContainer,
                common_classes.marginTop1em,
                common_classes.outlined,
              )}
            >
              <CancelIcon
                className={activity_classes.closeIcon}
                fontSize="small"
                onClick={e => {
                  deleteItem(formikProps.setFieldValue, `making_steps[${key}]`);
                }}
              />
              <InputText
                key={`makingSteps[${key}].descriptionKey`}
                name={`making_steps[${key}].description`}
                classes={classes}
                common_classes={common_classes}
                activity_classes={activity_classes}
                fieldType={{ simple: false, nested: true, array: true }}
                helperText={''}
                placeholder={`${t(
                  'createActivity.inputs.creationSteps.placeholder',
                )} ${key + 1}`}
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
                  key={`makingSteps[${key}].imageKey`}
                  name={`making_steps[${key}].image`}
                  fileType={'image/*'}
                  uploadButtonLabel={t(
                    'createActivity.inputs.creationSteps.image.label',
                  )}
                  classes={classes}
                  activity_classes={activity_classes}
                  fieldType={{ simple: false, nested: true, array: true }}
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
              setNodeList={setMakingSteps}
              label={t('createActivity.inputs.creationSteps.addMore')}
            />
          </Grid>
          <Typography
            variant="h10"
            className={clsx(classes.fieldHelperTextStyle, classes.errorMessage)}
          >
            {getMakingStepsRequiredError(
              'making_steps',
              formikProps.errors,
              formikProps.touched,
            )
              ? t(
                  `createActivity.inputs.making_steps.errors.${getMakingStepsRequiredError(
                    'making_steps',
                    formikProps.errors,
                    formikProps.touched,
                  )}`,
                )
              : ''}
          </Typography>
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
              key={`inspiringArtist.nameKey`}
              name={`inspiring_artist.name`}
              fieldType={{ simple: false, nested: true, array: false }}
              classes={classes}
              formikProps={formikProps}
              validateSteps={validateSteps}
              t={t}
              newActivityObject={newActivityObject}
              setNewActivityObject={setNewActivityObject}
            />
            <InputText
              name={`inspiring_artist.short_biography`}
              classes={classes}
              common_classes={common_classes}
              activity_classes={activity_classes}
              helperText={''}
              fieldType={{ simple: false, nested: true, array: false }}
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
                key={`inspiringArtist.imageKey`}
                name={`inspiring_artist.image`}
                fileType={'image/*'}
                uploadButtonLabel={t(
                  'createActivity.inputs.inspiringArtist.image.label',
                )}
                classes={classes}
                activity_classes={activity_classes}
                fieldType={{ simple: false, nested: true, array: false }}
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
            label={'inspiringExamples'}
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
            {inspiringExamples.map((inspiringExample, index) => (
              <Grid container direction="row" spacing={3}>
                <Grid item xs={12} md={4} sm={6}>
                  <Input
                    label={`Img-${index + 1} desc`}
                    multiline={true}
                    key={`inspiringExamples[${index}].descriptionKey`}
                    name={`inspiring_examples[${index}].description`}
                    fieldType={{ simple: false, nested: true, array: true }}
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
                    key={`inspiringExamples[${index}].creditKey`}
                    name={`inspiring_examples[${index}].credit`}
                    fieldType={{ simple: false, nested: true, array: true }}
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
                    key={`inspiringExamples[${index}].imageKey`}
                    name={`inspiring_examples[${index}].image`}
                    fileType={'image/*'}
                    uploadButtonLabel={t(
                      'createActivity.inputs.inspiringExemples.image.label',
                    )}
                    classes={classes}
                    activity_classes={activity_classes}
                    fieldType={{ simple: false, nested: true, array: true }}
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
              setNodeList={setInspiringExamples}
              label={t('createActivity.inputs.inspiringExemples.addMore')}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default CreateActivityStep3;
