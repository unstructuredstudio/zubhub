import React from 'react'
import clsx from 'clsx'
import {  
    FormControl,  
    OutlinedInput,
    FormHelperText,
} from '@material-ui/core';
import { handleTextFieldChange, handleTextFieldBlur} from '../../views/create_activity/createActivityScripts';

function Input(props) {
    const {
      label,
      defaultValue,
      classes, 
    }=props
  return (
    <div>
      <FormControl
        className={clsx(classes.margin, classes.textField)}
        variant="outlined"
        size="small"
        fullWidth
        margin="none"
        error={props.errors[label]? true: false}
        >  
        <OutlinedInput
        className={classes.customInputStyle}
        id={label}
        name={label}
        type="text"
        defaultValue={defaultValue? defaultValue : ''}
        onBlur={(e) => handleTextFieldBlur(e, props) }
        onChange= {(e) => props.handleChange(e)}
        />
        <FormHelperText
        error
        className={classes.fieldHelperTextStyle}
        >
          {
          ( props.touched[label] && props.errors[label] ) &&
          
          (props.t(
              `createActivity.inputs.${label}.errors.${props.errors[label]}`,
          ))
          }
        </FormHelperText>  
      </FormControl>

    </div>
  )
}

export default Input