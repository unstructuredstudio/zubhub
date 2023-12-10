import React from 'react';
import clsx from 'clsx';
import { FormControl, OutlinedInput, FormHelperText, InputLabel, TextField } from '@mui/material';
import { handleInputBlur, handleInputChange } from './inputScripts';
import { getRouteFieldIndex } from '../../assets/js/utils/scripts';
import { getValue, getErrors } from '../../views/create_activity/createActivityScripts';

function Input(props) {
  const { label, multiline, name, classes, fieldType, formikProps, validateSteps, disabled } = props;
  const { route, field, index } = getRouteFieldIndex(name);
  let fieldErrors = getErrors(route, field, index, formikProps.errors, formikProps.touched);
  let fieldValue = getValue(route, field, index, fieldType, formikProps.formikValues);

  return (
    <div>
      <FormControl
        className={clsx(classes.margin, classes.textField)}
        variant="outlined"
        size="small"
        fullWidth
        margin="none"
        // error={
        //   formikProps.touched[name] && formikProps.errors[field] ? true : false
        // }
      >
        <InputLabel htmlFor={label}>{label}</InputLabel>
        <OutlinedInput
          className={classes.customInputStyle}
          id={`${name}_id`}
          label={label ? label : ''}
          name={name}
          multiline={multiline ? multiline : false}
          disabled={disabled ? disabled : false}
          type="text"
          value={name === 'video' ? fieldValue && fieldValue['file_url'] && fieldValue['file_url'] : fieldValue}
          onBlur={e => handleInputBlur(e, name, formikProps, validateSteps)}
          onChange={e =>
            handleInputChange(name, e.target.value, formikProps.setFieldValue, formikProps.setFieldTouched)
          }
        />

        <FormHelperText error className={classes.fieldHelperTextStyle}>
          {fieldErrors &&
            fieldErrors !== 'required1' &&
            field !== 'video' &&
            props.t(`createActivity.inputs.${route ? route : field}.errors.${fieldErrors}`)}
        </FormHelperText>
      </FormControl>
    </div>
  );
}

export default Input;
