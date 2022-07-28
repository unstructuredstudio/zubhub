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
import AddMore from '../../components/addMore/addMore';
import Input from '../../components/input/input'
const useProjectStyles = makeStyles(projectStyles);
const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function CreateActivityStep3(props) {
    const classes = useProjectStyles()
    const activity_classes = useStyles()
    const common_classes = useCommonStyles()
    const [newActivity, setNewActivity] = useState(props.newActivity)
    const [creationSteps, setCreationSteps] = useState(newActivity.creationSteps? newActivity.creationSteps : [''] ) 
    const [inspiringExemples, setInspiringExemples] = useState(newActivity.inspiringExemples? newActivity.inspiringExemples : [''])
    const {t} = {...props}
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
                classes={classes}
                common_classes={common_classes}
                activity_classes={activity_classes}
                label={`creationSteps[${index}]`}
                placeholder={`${t(
                  'createActivity.inputs.creationSteps.placeholder',
                )} ${index + 1}`}
                vars={vars}
                {...props}
              />
              <Grid
                item
                xs={12}
                md={3}
                sm={6}
                className={common_classes.marginTop1em}
              >
                <UploadFile
                  id={'ActivityStepsImages'}
                  fileType={'image/*'}
                  uploadButtonLabel={t(
                    'createActivity.inputs.creationSteps.image.label',
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
            <InputText
              classes={classes}
              common_classes={common_classes}
              activity_classes={activity_classes}
              label={`inspiringArtist`}
              placeholder={t(
                'createActivity.inputs.inspiringArtist.placeholder',
              )}
              vars={vars}
              {...props}
            />
            <Grid
              item
              xs={12}
              md={3}
              sm={6}
              className={common_classes.marginTop1em}
            >
              <UploadFile
                id={'inspiringArtistImage'}
                fileType={'image/*'}
                uploadButtonLabel={t(
                  'createActivity.inputs.inspiringArtist.image.label',
                )}
                classes={classes}
                common_classes={common_classes}
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
                    label={`inspiringExemplesDescriptions[${index}]`}
                    classes={classes}
                    {...props}
                  />
                </Grid>
                <Grid item xs={12} md={3} sm={6}>
                  <Input
                    label={`inspiringExemplesCredits[${index}]`}
                    classes={classes}
                    {...props}
                  />
                </Grid>
                <Grid item xs={12} md={3} sm={6}>
                  <UploadFile
                    id={'inspiringExempleImage'}
                    fileType={'image/*'}
                    uploadButtonLabel={t(
                      'createActivity.inputs.inspiringExemples.image.label',
                    )}
                    classes={classes}
                    common_classes={common_classes}
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

export default CreateActivityStep3