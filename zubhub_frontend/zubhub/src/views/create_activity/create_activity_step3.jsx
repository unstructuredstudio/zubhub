import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import InputText from '../../components/inputText/inputText';
import CancelIcon from '@material-ui/icons/Cancel';
import 'react-toastify/dist/ReactToastify.css';
import { vars } from '../create_project/createProjectScripts';
import {
  getMakingStepsRequiredError,
  getStepError,
} from './createActivityScripts';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, FormControl, Box, Typography } from '@material-ui/core';
import CustomButton from '../../components/button/Button';
import AddIcon from '@material-ui/icons/Add';
import projectStyles from '../../assets/js/styles/views/create_project/createProjectStyles';
import { styles } from '../../assets/js/styles/views/create_activity/createActivityStyles';
import commonStyles from '../../assets/js/styles';
import MaterialsUsed from '../../components/materialsUsed/materialsUsed';
import UploadFile from '../../components/upload_file/uploadFile';
import FormLabel from '../../components/form_labels/formLabel';
import AddMore from '../../components/addMore/addMore';
import Input from '../../components/input/input';
import { Field, FieldArray } from 'formik';
const useProjectStyles = makeStyles(projectStyles);
const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function CreateActivityStep3(props) {
  const { t, formikProps, validateSteps } = props;
  const classes = useProjectStyles();
  const activity_classes = useStyles();
  const common_classes = useCommonStyles();
  const [makingSteps, setMakingSteps] = useState([]);
  const [inspiringExamples, setInspiringExamples] = useState([]);
  useEffect(() => {
    setMakingSteps(
      formikProps.formikValues.making_steps
        ? formikProps.formikValues.making_steps
        : [
            {
              description: '',
              image: null,
            },
          ],
    );
    setInspiringExamples(
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
  }, [formikProps.formikValues]);

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
            required={true}
            fieldLabel={t('createActivity.inputs.making_steps.label')}
          />

          <FieldArray
            name="making_steps"
            validateOnChange={false}
            render={arrayHelpers => (
              <div>
                {makingSteps &&
                  makingSteps.length > 0 &&
                  makingSteps.map((step, key) => (
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
                      {key > 0 && (
                        <CancelIcon
                          className={activity_classes.closeIcon}
                          fontSize="small"
                          onClick={() => arrayHelpers.remove(key)}
                        />
                      )}

                      <InputText
                        key={`makingSteps[${key}].descriptionKey`}
                        name={`making_steps[${key}].description`}
                        classes={classes}
                        common_classes={common_classes}
                        activity_classes={activity_classes}
                        fieldType={{
                          simple: false,
                          nested: true,
                          array: true,
                        }}
                        helperText={''}
                        placeholder={`${t(
                          'createActivity.inputs.making_steps.placeholder',
                        )} ${parseInt(key, 10) + 1}`}
                        formikProps={props.formikProps}
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
                            'createActivity.inputs.making_steps.image.label',
                          )}
                          classes={classes}
                          activity_classes={activity_classes}
                          fieldType={{
                            simple: false,
                            nested: true,
                            array: true,
                          }}
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
                      {/* <button
                        type="button"
                        onClick={() =>
                          arrayHelpers.insert(key, {
                            description: '',
                            image: '',
                          })
                        } // insert an empty string at a position
                      >
                        +
                      </button> */}

                      {/* <Typography
                        variant="h10"
                        className={clsx(
                          classes.fieldHelperTextStyle,
                          classes.errorMessage,
                        )}
                      >
                        {getStepError(
                          'making_steps',
                          key,
                          formikProps.errors,
                          formikProps.touched,
                        )
                          ? t(
                              `createActivity.inputs.making_steps.errors.${getStepError(
                                'making_steps',
                                key,
                                formikProps.errors,
                                formikProps.touched,
                              )}`,
                            )
                          : ''}
                      </Typography> */}
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
                  <CustomButton
                    variant="outlined"
                    size="large"
                    onClick={() => arrayHelpers.push({})}
                    secondaryButtonStyle
                    customButtonStyle
                  >
                    <AddIcon />{' '}
                    {t('createActivity.inputs.making_steps.addMore')}
                  </CustomButton>
                </Grid>
              </div>
            )}
          />
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
            fieldLabel={t('createActivity.inputs.inspiring_artist.label')}
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
            />
            <InputText
              name={`inspiring_artist.short_biography`}
              classes={classes}
              common_classes={common_classes}
              activity_classes={activity_classes}
              helperText={''}
              fieldType={{ simple: false, nested: true, array: false }}
              placeholder={t(
                'createActivity.inputs.inspiring_artist.placeholder',
              )}
              formikProps={props.formikProps}
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
                  'createActivity.inputs.inspiring_artist.image.label',
                )}
                classes={classes}
                activity_classes={activity_classes}
                fieldType={{ simple: false, nested: true, array: false }}
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
            fieldLabel={t('createActivity.inputs.inspiring_examples.label')}
          />

          <FieldArray
            name="inspiring_examples"
            validateOnChange={false}
            render={arrayHelpers => (
              <div>
                {inspiringExamples &&
                  inspiringExamples.length > 0 &&
                  inspiringExamples.map((step, key) => (
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
                      {key > 0 && (
                        <CancelIcon
                          className={activity_classes.closeIcon}
                          fontSize="small"
                          onClick={() => arrayHelpers.remove(key)}
                        />
                      )}
                      <Grid container direction="row" spacing={3}>
                        <Grid item xs={12} md={4} sm={6}>
                          <Input
                            label={`Img-${key + 1} desc`}
                            multiline={true}
                            key={`inspiringExamples[${key}].descriptionKey`}
                            name={`inspiring_examples[${key}].description`}
                            fieldType={{
                              simple: false,
                              nested: true,
                              array: true,
                            }}
                            classes={classes}
                            formikProps={formikProps}
                            validateSteps={validateSteps}
                            t={t}
                          />
                        </Grid>
                        <Grid item xs={12} md={3} sm={6}>
                          <Input
                            label={`Img-${key + 1} credit`}
                            key={`inspiringExamples[${key}].creditKey`}
                            name={`inspiring_examples[${key}].credit`}
                            fieldType={{
                              simple: false,
                              nested: true,
                              array: true,
                            }}
                            classes={classes}
                            formikProps={formikProps}
                            validateSteps={validateSteps}
                            t={t}
                          />
                        </Grid>
                        <Grid item xs={12} md={3} sm={6}>
                          <UploadFile
                            key={`inspiringExamples[${key}].imageKey`}
                            name={`inspiring_examples[${key}].image`}
                            fileType={'image/*'}
                            uploadButtonLabel={t(
                              'createActivity.inputs.inspiring_examples.image.label',
                            )}
                            classes={classes}
                            activity_classes={activity_classes}
                            fieldType={{
                              simple: false,
                              nested: true,
                              array: true,
                            }}
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
                  ))}
                <Grid
                  item
                  spacing={3}
                  container
                  direction="row"
                  alignItems="flex-end"
                  justifyContent="flex-end"
                >
                  <CustomButton
                    variant="outlined"
                    size="large"
                    onClick={() => arrayHelpers.push({})}
                    secondaryButtonStyle
                    customButtonStyle
                  >
                    <AddIcon />{' '}
                    {t('createActivity.inputs.inspiring_examples.addMore')}
                  </CustomButton>
                </Grid>
              </div>
            )}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default CreateActivityStep3;
