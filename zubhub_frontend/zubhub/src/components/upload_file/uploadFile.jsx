import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import ImageIcon from '@material-ui/icons/Image';
import MovieIcon from '@material-ui/icons/Movie';
import CancelIcon from '@material-ui/icons/Cancel';
import CustomButton from '../button/Button';
import {
  handleFileButtonClick,
  handleFileFieldChange,
  selectedFilesCount,
  imagesToPreview,
  deleteImageAtIndex,
  deleteImage,
  getErrors,
} from './uploadFileScripts.js';
import { getValue } from '../../views/create_activity/createActivityScripts';
import {
  Typography,
  FormControl,
  FormHelperText,
  Grid,
  Paper,
} from '@material-ui/core';
import { getRouteFieldIndex } from '../../assets/js/utils/scripts';

function UploadFile(props) {
  const {
    name,
    fileType,
    fieldType,
    uploadButtonLabel,
    classes,
    activity_classes,
    countFilesText,
    multiple,
    newActivityObject,
    setNewActivityObject,
    formikProps,
    validateSteps,
    t,
  } = props;

  const { route, field, index } = getRouteFieldIndex(name);
  const fileInputRef = React.useRef(null);
  const [filesUploaded, setFilesUploaded] = useState(false);
  let fieldErrors = null;
  let fieldValue = getValue(
    route,
    field,
    index,
    fieldType,
    formikProps.formikValues,
  );
  // const handleFileInputChange = () => {
  //   //if (fileType === 'image/*'){
  //   handleFileFieldChange(
  //     name,
  //     fileInputRef,
  //     formikProps,
  //     newActivityObject,
  //     setFilesUploaded,
  //     setNewActivityObject,
  //     validateSteps
  //   );
  //   // }
  // };
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
          onChange={() =>
            handleFileFieldChange(
              name,
              route,
              field,
              index,
              fileInputRef,
              formikProps,
              newActivityObject,
              setFilesUploaded,
              setNewActivityObject,
              validateSteps,
            )
          }
        />
        <Typography
          color="textSecondary"
          variant="caption"
          component="span"
          id={`${name}_file_count_el`}
        >
          {fieldValue
            ? fieldValue.length &&
              `${fieldValue.length} ${
                fieldValue.length > 1 ? countFilesText[1] : countFilesText[0]
              }`
            : ''}
        </Typography>
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
        </FormHelperText>

        <Grid container spacing={2}>
          {Object.entries(imagesToPreview(fieldValue)).map(([index, image]) => (
            <Grid item key={`imagePreview${index}`} md={4} xs={4} sm={4}>
              <Paper
                key={`imagePaper${index}`}
                className={activity_classes.imagePreviewContainer}
              >
                <img
                  className={activity_classes.imagePreview}
                  src={
                    image.type === 'file'
                      ? window.URL.createObjectURL(image.image)
                      : image.image.file_url
                  }
                  alt={`imageAlt${index}`}
                />
                <CancelIcon
                  className={activity_classes.closeIcon}
                  fontSize="small"
                  onClick={e => {
                    fieldType.simple
                      ? deleteImageAtIndex(formikProps, field, index)
                      : deleteImage(formikProps.setFieldValue, name);
                  }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </FormControl>
    </div>
  );
}

export default UploadFile;
