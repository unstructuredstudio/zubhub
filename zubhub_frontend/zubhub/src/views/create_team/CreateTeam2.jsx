import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import InputText from '../../components/inputText/inputText';
import 'react-toastify/dist/ReactToastify.css';
import { vars } from '../create_project/createProjectScripts';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, FormControl, Box, Paper, Typography } from '@material-ui/core';
import CustomButton from '../../components/button/Button';
import projectStyles from '../../assets/js/styles/views/create_project/createProjectStyles';
import { styles } from '../../assets/js/styles/views/create_activity/createActivityStyles';
import commonStyles from '../../assets/js/styles';
import MaterialsUsed from '../../components/materialsUsed/materialsUsed';
import UploadFile from '../../components/upload_file/uploadFile';
import Input from '../../components/input/input';
import FormLabel from '../../components/form_labels/formLabel';
import {
  getValue,
  getErrors,
} from '../../views/create_activity/createActivityScripts';
const useProjectStyles = makeStyles(projectStyles);
const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function CreateTeam2(props) {
  const classes = useProjectStyles();
  const activity_classes = useStyles();
  const common_classes = useCommonStyles();
  const [disableVideo, setDisableVideo] = useState(false);
  const { t, formikProps, validateSteps } = props;

  useEffect(() => {
    setDisableVideo(props.formikProps.formikValues['video'] ? true : false);
  }, [props.formikProps.formikValues]);

  let fieldErrors = getErrors(
    undefined,
    'video',
    -1,
    formikProps.errors,
    formikProps.touched,
  );
  return (
    <div className={activity_classes.createActivityStepContainer}>
      <Grid container spacing={3}>
        <Grid item xs={12} className={common_classes.marginTop1em}>
          <FormLabel
            label={'materialsUsed'}
            required={true}
            classes={classes}
            common_classes={common_classes}
            inputOrder={3}
            fieldLabel={t('createTeam.2ndpage.title')}
          />
        </Grid>
        <Grid item xs={12} className={common_classes.marginTop1em}>
            <Paper className={classes.aboutMeBox}>
                <Typography
                gutterBottom
                component="h3"
                variant="h6"
                color="textPrimary"
                className={classes}
                >
                {t('createTeam.2ndpage.members')}
                </Typography>
                { t('createTeam.2ndpage.member-placeholder')}
            </Paper><br></br>
            <Input
                label={t('createTeam.2ndpage.member-input-placeholder')}
                classes={classes}
                name={'memebers-list'}
                fieldType={{ simple: true, nested: false, array: false }}
                formikProps={formikProps}
                validateSteps={validateSteps}
                t={t}
            />
        </Grid>
        <Grid item xs={12} className={common_classes.marginTop1em}>
            <Paper className={classes.aboutMeBox}>
                <Typography
                gutterBottom
                component="h3"
                variant="h6"
                color="textPrimary"
                className={classes}
                >
                {t('createTeam.2ndpage.admins')}
                </Typography>
                { t('createTeam.2ndpage.admin-placeholder')}
            </Paper><br></br>
            <Input
                label={t('createTeam.2ndpage.admin-input-placeholder')}
                classes={classes}
                name={'admins-list'}
                fieldType={{ simple: true, nested: false, array: false }}
                formikProps={formikProps}
                validateSteps={validateSteps}
                t={t}
            />
        </Grid>
      </Grid>
    </div>
  );
}

export default CreateTeam2;
