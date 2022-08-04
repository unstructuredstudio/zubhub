import React from 'react'
import clsx from 'clsx'
import {  
    FormControl,  
    OutlinedInput,
    FormHelperText,
} from '@material-ui/core';
import { handleTextFieldBlur} from '../../views/create_activity/createActivityScripts';

function Input(props) {
    const {
      name,
      classes,
      formikProps,
      validateSteps,
      setNewActivityObject,
    } = props;
  return (
    <div>
      <FormControl
        className={clsx(classes.margin, classes.textField)}
        variant="outlined"
        size="small"
        fullWidth
        margin="none"
        error={props.errors[name] ? true : false}
      >
        <OutlinedInput
          className={classes.customInputStyle}
          id={`${name}_id`}
          name={name}
          type="text"
          defaultValue={
            formikProps.formikValues[name] ? formikProps.formikValues[name] : ''
          }
          onBlur={e =>
            handleTextFieldBlur(e, setNewActivityObject, formikProps.handleBlur, validateSteps)
          }
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

export default Input