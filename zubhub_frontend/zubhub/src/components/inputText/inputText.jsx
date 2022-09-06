import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';
import {
  getValue,
  getErrors
} from '../../views/create_activity/createActivityScripts';
import { handleInputTextFieldChange,
  handleInputTextFieldBlur,} from './inputTextScripts'
import {
  Box,
  Typography,
  FormControl,
  FormHelperText,
  ClickAwayListener,
} from '@material-ui/core';
import { getRouteFieldIndex } from '../../assets/js/utils/scripts';

function InputText(props) {
  const {
    classes,
    common_classes,
    activity_classes,
    fieldType,
    name,
    helperText,
    placeholder,
    formikProps,
    vars,
    t,
  } = props;
  const [inputTextFieldFocused, setInputTextFieldFocused] = useState(false);
  const { route, field, index } = getRouteFieldIndex(name);
  let fieldErrors = getErrors(
    route,
    field,
    index,
    formikProps.errors,
    formikProps.touched,
  );
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
            defaultValue={getValue(
              route,
              field,
              index,
              fieldType,
              formikProps.formikValues,
            )}
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
          {fieldErrors
            ? t(`createActivity.inputs.activityImages.errors.${fieldErrors}`)
            : ''}
        </FormHelperText>
      </FormControl>
    </div>
  );
}

export default InputText;
