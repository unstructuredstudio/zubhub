import React from 'react';
import clsx from 'clsx';
import { FormControl, OutlinedInput, FormHelperText } from '@material-ui/core';
import { handleTextFieldBlur } from '../../views/create_activity/createActivityScripts';
import { getFieldAndIndex } from '../../assets/js/utils/scripts';

function Input(props) {
  const { name, classes, formikProps, validateSteps, setNewActivityObject } =
    props;
  const { field, index } = getFieldAndIndex(name);

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
        <OutlinedInput
          className={classes.customInputStyle}
          id={`${name}_id`}
          name={name}
          type="text"
          defaultValue={
            formikProps.formikValues[field]
              ? index !== null
                ? formikProps.formikValues[field][index]
                : formikProps.formikValues[field]
              : ''
          }
          onBlur={
            e => {
              {
                formikProps.handleBlur(e);
                setNewActivityObject(newActivity => ({
                  ...newActivity,
                  [field]: formikProps.formikValues[field],
                }));
                validateSteps();
              }
            }
            // handleTextFieldBlur(
            //   e,
            //   setNewActivityObject,
            //   formikProps.handleBlur,
            //   formikProps.formikValues,
            //   validateSteps,
            // )
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

export default Input;
