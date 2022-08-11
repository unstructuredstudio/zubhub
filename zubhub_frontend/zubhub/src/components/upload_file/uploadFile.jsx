import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import ImageIcon from '@material-ui/icons/Image';
import MovieIcon from '@material-ui/icons/Movie';
import CustomButton from '../button/Button';
import {
  handleFileButtonClick,
  handleImageFieldChange,
} from './uploadFileScripts.js';
import { Typography, FormControl, FormHelperText } from '@material-ui/core';
import { getFieldAndIndex } from '../../assets/js/utils/scripts';

function UploadFile(props) {
  const {
    name,
    fileType,
    uploadButtonLabel,
    classes,
    countFilesText,
    multiple,
    newActivityObject,
    setNewActivityObject,
    formikProps,
    validateSteps,
    t,
  } = props;

  const { field, index } = getFieldAndIndex(name);
  const fileInputRef = React.useRef(null);

  const [filesUploaded, setFilesUploaded] = useState(false);
  // useEffect(() => {
  //   if (filesUploaded) {
  //     console.log('useEffect uploadFile');
  //     let formik_files = [];
  //     //let media_upload_progress = newActivityObject['media_upload_progress'];
  //     if (index !== null) {
  //       Object.keys(formikProps.formikValues[field]).forEach((item, idx) => {
  //         if (formikProps.errors[field] && formikProps.errors[field][idx]) {
  //           formik_files.push(undefined);
  //         } else {
  //           formik_files.push(formikProps.formikValues[field][item][0]);
  //           // media_upload_progress['total'] +=
  //           //   formikProps.formikValues[field][item][0].size;
  //         }
  //       });
  //     } else {
  //       if (!formikProps.errors[field]) {
  //         // Object.keys(formikProps.formikValues[field]).forEach(
  //         //   key =>
  //         //     (media_upload_progress['total'] +=
  //         //       formikProps.formikValues[field][key].size),
  //         // );
  //         formik_files = formikProps.formikValues[field];
  //       }
  //     }
  //     setNewActivityObject(state => {
  //       const media_upload = {
  //         files_to_upload: [],
  //         files_to_upload_urls: [],
  //         upload_progress: { loaded_percent: 0 },
  //       };
  //       media_upload['files_to_upload'] = formik_files;
  //       return {
  //         ...state,
  //         [field]: { media_upload: media_upload },
  //         // media_upload_progress: media_upload_progress,
  //       };
  //     });
  //   }
  // }, [filesUploaded]);
  const handleFileInputChange = () => {
    //if (fileType === 'image/*'){
    handleImageFieldChange(
      name,
      fileInputRef,
      formikProps,
      newActivityObject,
      setFilesUploaded,
      setNewActivityObject,
    );
    // }
  };
  return (
    <div>
      <CustomButton
        variant="outlined"
        size="large"
        margin="normal"
        id={`${name}_button`}
        startIcon={fileType === 'image/*' ? <ImageIcon /> : <MovieIcon />}
        onClick={() => handleFileButtonClick(fileInputRef, name)}
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
          ref={fileInputRef}
          className={classes.displayNone}
          aria-hidden="true"
          type="file"
          accept={fileType}
          id={`${name}_id`}
          name={name}
          multiple={multiple ? multiple : ''}
          onChange={() => handleFileInputChange()}
        />
        <Typography
          color="textSecondary"
          variant="caption"
          component="span"
          id={`${name}_file_count_el`}
        >
          {/* //still need to handle when an index has an error */}
          {/* {index !== null
            ? newActivityObject[field] &&
              newActivityObject[field]['media_upload'] &&
              !formikProps.errors[field] &&
              newActivityObject[field].media_upload.files_to_upload &&
              newActivityObject[field].media_upload.files_to_upload[index] &&
              `1 ${countFilesText[0]}`
            : newActivityObject[field] &&
              newActivityObject[field]['media_upload'] &&
              !formikProps.errors[field] &&
              newActivityObject[field].media_upload.files_to_upload &&
              newActivityObject[field].media_upload.files_to_upload.length > 0
            ? `${newActivityObject[field].media_upload.files_to_upload.length}
                ${
                  newActivityObject[field].media_upload.files_to_upload.length <
                  2
                    ? countFilesText[0]
                    : countFilesText[1]
                }`
            : ''} */}
        </Typography>
        <FormHelperText error className={classes.fieldHelperTextStyle}>
          {index !== null
            ? formikProps.touched[field] &&
              formikProps.errors[field] &&
              formikProps.touched[field][index] &&
              formikProps.errors[field][index] &&
              t(
                `createActivity.inputs.activityImages.errors.${formikProps.errors[field][index]}`,
              )
            : formikProps.touched[field] &&
              formikProps.errors[field] &&
              t(
                `createActivity.inputs.activityImages.errors.${formikProps.errors[field]}`,
              )}
        </FormHelperText>
      </FormControl>
    </div>
  );
}

export default UploadFile;
