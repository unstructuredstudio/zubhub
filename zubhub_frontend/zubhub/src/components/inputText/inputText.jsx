import React, { useState, useEffect } from 'react';
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
import { getRouteFieldIndex } from '../../assets/js/utils/scripts';
import { getErrors } from '../upload_file/uploadFileScripts';
function InputText(props) {
  const {
    classes,
    common_classes,
    activity_classes,
    name,
    helperText,
    placeholder,
    formikProps,
    newActivityObject,
    vars,
    t,
  } = props;
  const [inputTextFieldFocused, setInputTextFieldFocused] = useState(false);
  const { route, field, index } = getRouteFieldIndex(name);
  let fieldErrors = '';
  // useEffect(() => {
  //     fieldErrors = getErrors(
  //     route,
  //     field,
  //     index,
  //     formikProps.errors,
  //     formikProps.touched,
  //   );
  //   console.log('input text getErrors', fieldErrors);
  // }, []);

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
                field,
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
            id={`${field}_id`}
            className={activity_classes.reactQuillStyle}
            modules={vars.quill.modules}
            formats={vars.quill.formats}
            placeholder={placeholder ? placeholder : ''}
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
          {
            (fieldErrors = getErrors(
              route,
              field,
              index,
              formikProps.errors,
              formikProps.touched,
            ))
          }
          {fieldErrors
            ? t(`createActivity.inputs.activityImages.errors.${fieldErrors}`)
            : ''}
          {/* {index >= null
            ? formikProps.touched[field] &&
              formikProps.touched[field][index] &&
              formikProps.errors[field] &&
              formikProps.errors[field][index] &&
              props.t(
                `createActivity.inputs.${field}.errors.${formikProps.errors[field][index]}`,
              )
            : formikProps.touched[field] &&
              formikProps.errors[field] &&
              props.t(
                `createActivity.inputs.${field}.errors.${formikProps.errors[field]}`,
              )} */}
        </FormHelperText>
      </FormControl>
    </div>
  );
}

export default InputText;
