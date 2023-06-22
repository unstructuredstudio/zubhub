import React from 'react';
import { dropdownStyle } from './dropdown.style';
import { Box, FormControl, TextField, Typography, makeStyles } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import styles from '../../../assets/js/styles';

export default function Dropdown({ label, data = [], value, placeholder, required, handleChange, error, description }) {
  const classes = makeStyles(dropdownStyle)();
  const commonClasses = makeStyles(styles)();

  const labelView = props => (
    <Box component="li" sx={{ '& > *': { mr: 2 } }} {...props}>
      <Typography>{props.label}</Typography>
    </Box>
  );

  const inputView = params => (
    <TextField
      {...params}
      variant="outlined"
      error={error}
      helperText={error}
      placeholder={placeholder}
      inputProps={{
        ...params.inputProps,
        autoComplete: 'new-password', // disable autocomplete and autofill
      }}
    />
  );

  return (
    <FormControl fullWidth>
      <label htmlFor="" className={commonClasses.title2}>
        {label} {required && <span className={commonClasses.colorRed}>*</span>}
      </label>
      {description && <Typography style={{ marginBottom: 10 }}>{description}</Typography>}

      <Autocomplete
        sx={{ width: 300 }}
        options={data}
        autoHighlight
        multiple
        onChange={handleChange}
        getOptionLabel={option => option?.label}
        renderOption={labelView}
        renderInput={inputView}
      />
    </FormControl>
  );
}
