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
      classes, 
    }=props
  return (
    <div>
        <FormControl
                  className={clsx(classes.margin, classes.textField)}
                  variant="outlined"
                  size="small"
                  fullWidth
                  margin="small"
                  error={props.status && props.status[label]  && 
                     props.errors[label]}
                >  
                  <OutlinedInput
                    className={classes.customInputStyle}
                    id={`${label}_id`}
                    name={label}
                    type="text"
                    onBlur={e => handleTextFieldBlur( e, props) }
                    onChange= {(e) => handleTextFieldChange(e, props)}
                  />
                  <FormHelperText
                    error
                    className={classes.fieldHelperTextStyle}
                  >
                            { (props.status && props.status[label]) || 
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