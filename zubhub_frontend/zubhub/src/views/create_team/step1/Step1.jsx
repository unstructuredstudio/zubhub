import React from 'react';
import { Box, FormControl, TextField, makeStyles } from '@material-ui/core';
import styles from '../../../assets/js/styles';

export default function Step1({ formik }) {
  const commonClasses = makeStyles(styles)();

  return (
    <div>
      <Box marginY={6}>
        <FormControl fullWidth>
          <label className={commonClasses.title2}>
           Team Name <span className={commonClasses.colorRed}>*</span>
          </label>
          <TextField
            variant="outlined"
            name="groupname"
            placeholder="Choose a name that best suites your team"
            value={formik.values.groupname}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={!!formik.errors.groupname}
            helperText={formik.errors.groupname}
          />
          <br />
          <label className={commonClasses.title2}>
           About Team <span className={commonClasses.colorRed}>*</span>
          </label>
          <TextField
            variant="outlined"
            name="description"
            multiline
            rows={4}
            placeholder="Tell us a little about your team"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={!!formik.errors.description}
            helperText={formik.errors.description}
          />
        </FormControl>
      </Box>   
    </div>
  );
}
