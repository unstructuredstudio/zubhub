import React from 'react'
import ImageIcon from '@material-ui/icons/Image';
import CustomButton from '../button/Button';
import { handleFileButtonClick, handleFileFieldChange} from './uploadFileScripts'
import { Typography } from '@material-ui/core';

function UploadFile(props) {
  const {
    id, 
    fileType,
    uploadButtonLabel,
    classes,
    common_classes,
  } = props
  const refs = {
    file_count_el: React.useRef(null),
    fileInput: React.useRef(null) 
  }

  return (
    <div>
    <CustomButton
      variant="outlined"
      size="large"
      margin="normal"
      id="image_upload_button"
      startIcon={<ImageIcon />}
      onClick={() =>
        handleFileButtonClick(refs)
      }
      secondaryButtonStyle
      mediaUploadButtonStyle
      customButtonStyle
      fullWidth
    >
      {uploadButtonLabel}
    </CustomButton>
    <input
      ref={refs.fileInput}
      className={classes.displayNone}
      aria-hidden="true"
      type="file"
      accept={fileType}
      id={id}
      name={id}
      multiple
      onChange={() => handleFileFieldChange(refs, props)}
    />
    <Typography
      color="textSecondary"
      variant="caption"
      component="span"
      ref={refs.file_count_el}
    >
    </Typography>
  </div>
  )
}

export default UploadFile