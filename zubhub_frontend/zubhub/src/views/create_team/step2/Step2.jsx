import React, { useState, useEffect } from 'react';
import { Box, Paper, Grid, InputBase, Typography, FormControl, TextField, makeStyles } from '@material-ui/core';
import styles from '../../../assets/js/styles';
// import { step2Style } from './step2.styles';
// import { ImageInput, VideoInput } from '../../../components';


export default function Step2({ formik }) {
  const commonClasses = makeStyles(styles)();

  return (
    <Box marginY={6}>
    <FormControl fullWidth>
          <label className={commonClasses.commonClasses}>
           Invite Team Members <span className={commonClasses.colorRed}>*</span>
          </label>
          <Grid item xs={12} className={commonClasses.commonClasses}>
            <Paper className={commonClasses.commonClasses}>
                <Typography
                gutterBottom
                component="h3"
                variant="p"
                color="textPrimary"
                className={commonClasses.commonClasses}
                >
                {('Admin')}
                </Typography>
                {('Admins can assign admin status to other team members, add and remove team members, add team to a project, delete team profile')}
            </Paper><br></br></Grid>
          <TextField
            variant="outlined"
            name="title"
            placeholder="Enter team members Username"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && formik.errors.title ? true : false}
            helperText={formik.touched.title && formik.errors.title}
          />
          <Grid item xs={12}> <br></br><br></br> </Grid>
          <Grid item xs={12} className={commonClasses.commonClasses}>
            <Paper className={commonClasses.commonClasses}>
                <Typography
                gutterBottom
                component="h3"
                variant="p"
                color="textPrimary"
                className={commonClasses.commonClasses}
                >
                {('Member')}
                </Typography>
                {('Members can add team to a project, view team members and leave at their convenience')}
            </Paper><br></br></Grid>
          <TextField
            variant="outlined"
            name="title"
            placeholder="Enter team members Username"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && formik.errors.title ? true : false}
            helperText={formik.touched.title && formik.errors.title}
          />
    </FormControl>
    </Box>
  );
}