import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import 'react-toastify/dist/ReactToastify.css';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import {
  vars,
  handleTextFieldChange,
  handleTextFieldBlur,
} from '../create_project/createProjectScripts';
import CustomButton from '../../components/button/Button';
import projectStyles from '../../assets/js/styles/views/create_project/createProjectStyles';
import { styles } from '../../assets/js/styles/views/create_activity/createActivityStyles';
import commonStyles from '../../assets/js/styles';
import InputText from '../../components/inputText/inputText';
import FormLabel from '../../components/form_labels/formLabel';
import Input from '../../components/input/input';
const useProjectStyles = makeStyles(projectStyles);
const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function CreateTeam1(props) {
  const classes = useProjectStyles();
  const activity_classes = useStyles();
  const common_classes = useCommonStyles();
  const { t, formikProps, validateSteps } = props;

  return (
    <div className={activity_classes.createActivityStepContainer}>
      <Grid container spacing={3}>
        <Grid item xs={12} className={common_classes.marginTop1em}>
          <FormLabel
            label={'title'}
            required={true}
            classes={classes}
            common_classes={common_classes}
            inputOrder={1}
            fieldLabel={t('createTeam.inputs.title.label')}
          />
          <Input
            label={'Choose a name that best suites your team'}
            classes={classes}
            name={'title'}
            fieldType={{ simple: true, nested: false, array: false }}
            formikProps={formikProps}
            validateSteps={validateSteps}
            t={t}
          />
        </Grid>
        
        <Grid item xs={12} className={common_classes.marginTop1em}>
          <FormLabel
            label={'motivation'}
            required={true}
            classes={classes}
            common_classes={common_classes}
            inputOrder={2}
            fieldLabel={t('createTeam.inputs.bio.label')}
          />
          <InputText
            name={'motivation'}
            classes={classes}
            common_classes={common_classes}
            activity_classes={activity_classes}
            fieldType={{ simple: true, nested: false, array: false }}
            placeholder={t('Tell us a little about your team')}
            formikProps={props.formikProps}
            validateSteps={props.validateSteps}
            vars={vars}
            t={props.t}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default  CreateTeam1;
