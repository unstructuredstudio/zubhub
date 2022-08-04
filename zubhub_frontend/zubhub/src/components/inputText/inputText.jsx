import React, { useState } from 'react';
import clsx from 'clsx';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';
import {
  handleInputTextFieldChange,
  handleInputTextFieldBlur,
} from '../../views/create_activity/createActivityScripts';
import {
  Box,
  Typography,
  FormControl,
  FormHelperText,
  ClickAwayListener,
} from '@material-ui/core';

function InputText(props) {
  const {
    classes,
    common_classes,
    activity_classes,
    name,
    helperText,
    placeholder,
    formikProps,
    vars,
  } = props;
  const [inputTextFieldFocused, setInputTextFieldFocused] = useState(false);
  props = { ...props, inputTextFieldFocused, setInputTextFieldFocused };
  return (
    <div>
      <Typography
        color="textSecondary"
        variant="caption"
        component="span"
        className={clsx(
          classes.fieldHelperTextStyle,
          common_classes.marginBottom1em,
        )}
      >
        {helperText ? helperText : ''}
      </Typography>
      <FormControl
        className={clsx(classes.margin, classes.textField)}
        variant="outlined"
        size="small"
        fullWidth
        margin="none"
      >
        <ClickAwayListener
          onClickAway={() => {
            if (inputTextFieldFocused) {
              console.log('blur event from :', name);
              handleInputTextFieldBlur(
                name,
                formikProps.formikValues,
                props.setNewActivityObject,
                setInputTextFieldFocused,
                props.validateSteps,
              );
            }
          }}
        >
          <ReactQuill
            name={name}
            id={`${name}_id`}
            className={activity_classes.reactQuillStyle}
            modules={vars.quill.modules}
            formats={vars.quill.formats}
            placeholder={placeholder ? placeholder : ''}
            defaultValue={
              formikProps.formikValues[name]
                ? formikProps.formikValues[name]
                : ''
            }
            onChange={value =>
              handleInputTextFieldChange(
                name,
                value,
                setInputTextFieldFocused,
                formikProps.setFieldValue,
                formikProps.setFieldTouched,
              )
            }
          />
        </ClickAwayListener>
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

export default InputText;
