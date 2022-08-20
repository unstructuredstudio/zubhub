import React from 'react';
import clsx from 'clsx';
import {
  FormControl,
  OutlinedInput,
  FormHelperText,
  InputLabel,
  TextField,
} from '@material-ui/core';
import { handleInputBlur } from './inputScripts';
import { getFieldAndIndex } from '../../assets/js/utils/scripts';

function Input(props) {
  const {
    label,
    multiline,
    name,
    classes,
    formikProps,
    validateSteps,
    newActivityObject,
    setNewActivityObject,
  } = props;
  const { field, index } = getFieldAndIndex(name);
  console.log(
    'from input field',
    field,
    newActivityObject[field]
      ? index >= 0
        ? newActivityObject[field][index]
        : newActivityObject[field]
      : '',
  );
  return (
    <div>
      <FormControl
        className={clsx(classes.margin, classes.textField)}
        variant="outlined"
        size="small"
        fullWidth
        margin="none"
        error={formikProps.errors[field] ? true : false}
      >
        <InputLabel htmlFor={label}>{label}</InputLabel>
        <OutlinedInput
          className={classes.customInputStyle}
          id={`${name}_id`}
          label={label ? label : ''}
          name={name}
          multiline={multiline ? multiline : false}
          type="text"
          value={
            newActivityObject[field]
              ? index >= 0
                ? newActivityObject[field][index]
                : newActivityObject[field]
              : ''
          }
          onBlur={e =>
            handleInputBlur(
              e,
              formikProps,
              field,
              setNewActivityObject,
              validateSteps,
            )
          }
          onChange={e => formikProps.handleChange(e)}
        />

        {/* <TextField
          id={`outlined-${name}`}
          label={label}
          className={classes.customInputStyle}
          name={name}
          multiline={multiline ? multiline : false}
          type="text"
          value={
            newActivityObject[field]
              ? index >= 0
                ? newActivityObject[field][index]
                : newActivityObject[field]
              : ''
          }
          onBlur={e =>
            handleInputBlur(
              e,
              formikProps,
              field,
              setNewActivityObject,
              validateSteps,
            )
          }
          onChange={e => formikProps.handleChange(e)}
        /> */}
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
