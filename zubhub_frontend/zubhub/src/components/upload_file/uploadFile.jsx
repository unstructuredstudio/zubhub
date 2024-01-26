import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import ImageIcon from '@mui/icons-material/Image';
import MovieIcon from '@mui/icons-material/Movie';
import CancelIcon from '@mui/icons-material/Cancel';
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
import { Typography, FormControl, FormHelperText, Grid, Paper, CardMedia } from '@mui/material';
import { getRouteFieldIndex, buildVideoThumbnailURL } from '../../assets/js/utils/scripts';

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
    formikProps,
    validateSteps,
    disabled,
    t,
  } = props;

  const { route, field, index } = getRouteFieldIndex(name);
  const fileInputRef = React.useRef(null);
  const [filesUploaded, setFilesUploaded] = useState(false);
  let fieldErrors = getErrors(route, field, index, formikProps.errors, formikProps.touched);
  let fieldValue = getValue(route, field, index, fieldType, formikProps.formikValues);

  return (
    <div>
      <CustomButton
        variant="outlined"
        size="large"
        margin="normal"
        disabled={disabled ? disabled : false}
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
          onChange={() => handleFileFieldChange(name, route, field, index, fileInputRef, formikProps, validateSteps)}
        />
        <Typography color="textSecondary" variant="caption" component="span" id={`${name}_file_count_el`}>
          {fieldValue && typeof fieldValue !== 'string'
            ? fieldValue.length &&
              `${fieldValue.length} ${fieldValue.length > 1 ? countFilesText[1] : countFilesText[0]}`
            : ''}
        </Typography>
        <FormHelperText error className={classes.fieldHelperTextStyle}>
          {fieldErrors && field !== 'video' ? t(`createActivity.inputs.activityImages.errors.${fieldErrors}`) : ''}
        </FormHelperText>

        <Grid container spacing={2}>
          {Object.entries(imagesToPreview(fieldValue)).map(([index, image]) => {
            return (
              <Grid item key={`imagePreview${index}`} md={4} xs={4} sm={4}>
                <Paper key={`imagePaper${index}`} className={activity_classes.imagePreviewContainer}>
                  {field === 'video' ? (
                    <CardMedia
                      className={clsx(activity_classes.imagePreview)}
                      component={image.type === 'file' ? 'video' : 'iframe'}
                      image={image.type === 'file' ? window.URL.createObjectURL(image.image) : image.image}
                    />
                  ) : (
                    <img
                      className={activity_classes.imagePreview}
                      // src={image.type === 'file' ? window.URL.createObjectURL(image.image) : image.image.file_url}
                      alt={`imageAlt${index}`}
                    />
                  )}
                  <CancelIcon
                    className={activity_classes.closeIcon}
                    fontSize="small"
                    onClick={e => {
                      fieldType.simple
                        ? deleteImageAtIndex(formikProps, field, index, validateSteps)
                        : deleteImage(formikProps.setFieldValue, name, validateSteps);
                    }}
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </FormControl>
    </div>
  );
}

export default UploadFile;
