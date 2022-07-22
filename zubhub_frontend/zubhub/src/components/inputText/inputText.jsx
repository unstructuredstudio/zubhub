import React from 'react';
import clsx from 'clsx';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';
import {handleInputTextFieldChange} from '../../views/create_activity/createActivityScripts'
import {
  Box,
  Typography,
  FormControl,
  FormHelperText
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
    console.log('text input props', props)        
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
            margin="small"
            >
            <ReactQuill
              name={label}
              id={`${label}_id`}
              className= {activity_classes.reactQuillStyle}
              modules={vars.quill.modules}
              formats={vars.quill.formats}
              placeholder={placeholder? placeholder : ''}
              //defaultValue={''}
              onChange={value => handleInputTextFieldChange(label, value, props)}
            />
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