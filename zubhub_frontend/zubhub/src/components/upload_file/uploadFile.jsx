import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import ImageIcon from '@material-ui/icons/Image';
import CustomButton from '../button/Button';
import {
  handleFileButtonClick,
  handleImageFieldChange,
} from './uploadFileScripts.js';
import { Typography, FormControl, FormHelperText } from '@material-ui/core';
import { getFieldAndIndex } from '../../assets/js/utils/scripts';

function UploadFile(props) {
  const {
    id,
    fileType,
    uploadButtonLabel,
    classes,
    countFilesText,
    multiple,
    wraperState,
  } = props;

  const { field, index } = getFieldAndIndex(id);
  const uploadFileRefs = {
    fileInput: React.useRef(null),
  };

  const [state, setState] = useState({
    media_upload: {
      upload_dialog: false,
      images_to_upload: [],
      videos_to_upload: [],
      upload_info: {},
      upload_percent: 0,
      uploaded_images_url: [],
      uploaded_videos_url: [],
    },
  });

  const handleSetUploadFileState = obj => {
    if (obj) {
      //  Promise.resolve(obj).then(obj => {
      setState(state => ({ ...state, ...obj }));
      //  });
    }
  };

  props = {
    ...props,
    UploadFilestate: state,
    handleSetUploadFileState: handleSetUploadFileState,
    setState1: setState,
  };
  return (
    <div>
      <CustomButton
        variant="outlined"
        size="large"
        margin="normal"
        id={[id, 'Button'].join('')}
        startIcon={<ImageIcon />}
        onClick={() => handleFileButtonClick(uploadFileRefs, id)}
        secondaryButtonStyle
        mediaUploadButtonStyle
        customButtonStyle
        fullWidth
      >
        {uploadButtonLabel}
      </CustomButton>
      <FormControl
        className={clsx(classes.margin, classes.textField)}
        variant="outlined"
        size="small"
        fullWidth
        margin="none"
      >
        <input
          ref={uploadFileRefs.fileInput}
          className={classes.displayNone}
          aria-hidden="true"
          type="file"
          accept={fileType}
          id={id}
          name={id}
          multiple={multiple ? multiple : ''}
          onChange={() => handleImageFieldChange(id, uploadFileRefs, props)}
        />
        <Typography
          color="textSecondary"
          variant="caption"
          component="span"
          id={[id, 'file_count_el'].join('')}
        >
          {index !== null
            ? wraperState[field] &&
              wraperState[field].media_upload?.images_to_upload &&
              wraperState[field].media_upload.images_to_upload[index]
              ? `1 image added`
              : ''
            : wraperState[id] &&
              wraperState[id].media_upload?.images_to_upload.length > 0
            ? `${wraperState[id].media_upload.images_to_upload.length}
              ${
                wraperState[id].media_upload.images_to_upload.length < 2
                  ? countFilesText[0]
                  : countFilesText[1]
              }`
            : ''}
        </Typography>
        <FormHelperText error className={classes.fieldHelperTextStyle}>
          {index !== null
            ? props.touched[field] &&
              props.touched[field][index] &&
              props.errors[field] &&
              props.errors[field][index] &&
              props.t(
                `createActivity.inputs.activityImages.errors.${props.errors[field][index]}`,
              )
            : props.touched[id] &&
              props.errors[id] &&
              props.t(
                `createActivity.inputs.activityImages.errors.${props.errors[id]}`,
              )}
        </FormHelperText>
      </FormControl>
    </div>
  );
}

export default UploadFile;
