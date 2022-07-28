import React, {useState} from 'react';
import clsx from 'clsx';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';
import { handleInputTextFieldChange, handleInputTextFieldBlur } from '../../views/create_activity/createActivityScripts'
import {
  Box,
  Typography,
  FormControl,
  FormHelperText,
  ClickAwayListener
} from '@material-ui/core';

function InputText(props) {
    const { classes, 
            common_classes,
            activity_classes, 
            label, 
            helperText, 
            placeholder, 
            vars
            } = props 
    const [inputTextFieldFocused, setInputTextFieldFocused] = useState(false)
    props = {...props, inputTextFieldFocused, setInputTextFieldFocused}         
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
            {helperText? helperText : ''}
          </Typography>
          <FormControl
            className={clsx(classes.margin, classes.textField)}
            variant="outlined"
            size="small"
            fullWidth
            margin="none"
            >
            <ClickAwayListener
              onClickAway={() =>
                {if (inputTextFieldFocused){
                  console.log('blur event from :', label)
                  handleInputTextFieldBlur( label, props )
                }}
              }
            >  
            <ReactQuill
              name={label}
              id={`${label}_id`}
              className= {activity_classes.reactQuillStyle}
              modules={vars.quill.modules}
              formats={vars.quill.formats}
              placeholder={placeholder? placeholder : ''}
              defaultValue={props.values[label]? props.values[label] : ''}
              onChange={value => handleInputTextFieldChange(label, value, props)}
            />
            </ClickAwayListener>
            <FormHelperText
              error
              className={classes.fieldHelperTextStyle}
            >
              {(props.status && props.status[label] ) ||
                (props.touched[label] && props.errors[label]) &&
                (props.t(
                  `createActivity.inputs.${label}.errors.${props.errors[label]}`,
                ))}
            </FormHelperText>
        </FormControl>
      </div>
    )
}

export default InputText