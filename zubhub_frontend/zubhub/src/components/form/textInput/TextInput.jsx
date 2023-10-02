import { FormControl, FormHelperText, TextField, Typography, makeStyles } from '@material-ui/core';
import React, { memo, useState } from 'react';
import styles from '../../../assets/js/styles';
import { textInputStyles } from './TextInput.styles';
import clsx from 'clsx';
import FormLabel from '../../form_labels/formLabel';

function TextInput({
  label,
  required,
  placeholder,
  id,
  onBlur = () => {},
  name,
  error,
  value = '',
  onChange = () => {},
  helperText,
  description,
  defaultValue,
  variant = 'outlined',
}) {
  const commonClasses = makeStyles(styles)();
  const classes = makeStyles(textInputStyles)();

  return (
    <FormControl fullWidth error={error}>
      <FormLabel required={required} htmlFor={name}>
        {label}{' '}
      </FormLabel>
      <FormHelperText>
        {description && (
          <Typography className={commonClasses.textSmall} style={{ marginBottom: 10 }}>
            {description}
          </Typography>
        )}
      </FormHelperText>
      <input
        name={name}
        id={id}
        placeholder={placeholder}
        onChange={onChange}
        className={clsx(classes.inputContainer, commonClasses.inputText, error && commonClasses.borderRed)}
        error={error}
        defaultValue={defaultValue}
        // value={value}
        onBlur={onBlur}
      />

      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}

export default memo(TextInput);
