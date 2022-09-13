import React, { useState } from 'react';
import AddMore from '../../components/addMore/addMore';
import clsx from 'clsx';
import ImageIcon from '@material-ui/icons/Image';
import AddIcon from '@material-ui/icons/Add';
import CustomButton from '../../components/button/Button';
import Input from '../input/input';
import {
  Grid,
  Box,
  Container,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Dialog,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  OutlinedInput,
  FormHelperText,
  FormControl,
  InputLabel,
  ClickAwayListener,
} from '@material-ui/core';
import { handleImageFieldChange } from '../../views/create_activity/createActivityScripts';
import UploadFile from '../../components/upload_file/uploadFile';

function MaterialsUsed(props) {
  const refs = {
    imageInput: React.useRef(null),
    image_count_el: React.useRef(null),
  };
  const {
    classes,
    activity_classes,
    common_classes,
    addMoreLabel,
    imagesButtonLabel,
    encouragingText,
    formikProps,
    setNewActivityObject,
    t,
    newActivityObject,
    validateSteps,
  } = props;
  const [materialsUsedList, setMaterialsUsedList] = useState(
    formikProps.formikValues.materials_used
      ? formikProps.formikValues.materials_used
      : ['', '', ''],
  );
  return (
    <div>
      <Grid container>
        <Grid item xs={12} md={6}>
          {materialsUsedList.map((value, index) => (
            <Input
              label={`${index + 1}-`}
              key={`materialsUsedKey[${index}]`}
              classes={classes}
              formikProps={formikProps}
              fieldType={{ simple: true, nested: false, array: true }}
              validateSteps={validateSteps}
              t={t}
              newActivityObject={newActivityObject}
              setNewActivityObject={setNewActivityObject}
              name={`materials_used[${index}]`}
            />
          ))}
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          spacing={3}
          container
          direction="row"
          alignItems="flex-end"
          justifyContent="center"
        >
          <AddMore setNodeList={setMaterialsUsedList} label={addMoreLabel} />
        </Grid>
      </Grid>
      <p className={clsx(classes.fieldHelperTextStyle, classes.errorMessage)}>
        {formikProps.touched['materials_used'] &&
          formikProps.errors['materials_used'] === 'required1' &&
          t(`createActivity.inputs.materialsUsed.errors.required1`)}
      </p>
      <Grid item xs={12} className={common_classes.marginTop3em}>
        <Typography
          color="textSecondary"
          variant="caption"
          component="span"
          className={clsx(
            classes.fieldHelperTextStyle,
            common_classes.marginBottom1em,
            common_classes.marginTop1em,
          )}
        >
          {encouragingText}
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6} md={4}>
            <UploadFile
              name={'materials_used_image'}
              fileType={'image/*'}
              uploadButtonLabel={imagesButtonLabel}
              classes={classes}
              fieldType={{ simple: true, nested: false, array: false }}
              activity_classes={activity_classes}
              newActivityObject={newActivityObject}
              setNewActivityObject={setNewActivityObject}
              formikProps={formikProps}
              validateSteps={validateSteps}
              t={t}
              countFilesText={[
                props.t('createActivity.inputs.image'),
                props.t('createActivity.inputs.images'),
              ]}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default MaterialsUsed;
