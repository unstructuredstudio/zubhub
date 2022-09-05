import React from 'react';
import clsx from 'clsx';
import {
  FormControl,
  OutlinedInput,
  FormHelperText,
  InputLabel,
  TextField,
} from '@material-ui/core';
import { handleInputBlur, handleInputChange } from './inputScripts';
import { getRouteFieldIndex } from '../../assets/js/utils/scripts';
import { getValue } from '../../views/create_activity/createActivityScripts';

function Input(props) {
  const {
    label,
    multiline,
    name,
    classes,
    fieldType,
    formikProps,
    validateSteps,
  } = props;
  const { route, field, index } = getRouteFieldIndex(name);

  return (
    <div>
      <FormControl
        className={clsx(classes.margin, classes.textField)}
        variant="outlined"
        size="small"
        fullWidth
        margin="none"
        error={
          formikProps.touched[name] && formikProps.errors[field] ? true : false
        }
      >
        <InputLabel htmlFor={label}>{label}</InputLabel>
        <OutlinedInput
          className={classes.customInputStyle}
          id={`${name}_id`}
          label={label ? label : ''}
          name={name}
          multiline={multiline ? multiline : false}
          type="text"
          value={getValue(
            route,
            field,
            index,
            fieldType,
            formikProps.formikValues,
          )}
          onBlur={e => handleInputBlur(e, formikProps, validateSteps)}
          onChange={e => formikProps.handleChange(e)}
        />

        <FormHelperText error className={classes.fieldHelperTextStyle}>
          {formikProps.touched[name] &&
            formikProps.errors[name] &&
            props.t(
              `createActivity.inputs.${name}.errors.${formikProps.errors[name]}`,
            )}
        </FormHelperText>
      </FormControl>
    </div>
  );
}

export default Input;
