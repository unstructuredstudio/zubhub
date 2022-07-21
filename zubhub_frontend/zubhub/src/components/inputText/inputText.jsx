import React from 'react';
import clsx from 'clsx';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Typography,
  FormControl,
} from '@material-ui/core';

function InputText(props) {
    const { classes, 
            common_classes,
            activity_classes, 
            value, 
            label, 
            helperText, 
            placeholder, 
            setValue,
            vars
            } = props 
    const setInputTextValue = (value) => {
        const newFieldObject = {}
        newFieldObject[label] = value
        setValue((prevalue) => ({ ...prevalue, ...newFieldObject}))
    }         
    return (
      <div>
              <FormControl
                className={clsx(classes.margin, classes.textField)}
                variant="outlined"
                size="small"
                fullWidth
                margin="small"
              >
                <Typography
                  color="textSecondary"
                  variant="caption"
                  component="span"
                  className={clsx(
                    classes.fieldHelperTextStyle,
                    common_classes.marginBottom1em,
                  )}
                >
                  {helperText}
                </Typography>
                  <ReactQuill
                    className= {activity_classes.reactQuillStyle}
                    modules={vars.quill.modules}
                    formats={vars.quill.formats}
                    placeholder={placeholder}
                    value={ value? value : '' }
                    onChange={setInputTextValue}
                  />
              </FormControl>
      </div>
    )
}

export default InputText