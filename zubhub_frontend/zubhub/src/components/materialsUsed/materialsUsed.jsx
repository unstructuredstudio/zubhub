import React, {useState} from 'react';
import AddMore from '../../components/addMore/addMore';
import clsx from 'clsx';
import ImageIcon from '@material-ui/icons/Image';
import AddIcon from '@material-ui/icons/Add';
import CustomButton from '../../components/button/Button';
import Input from '../input/input'
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
import {handleImageFieldChange} from '../../views/create_activity/createActivityScripts';
import UploadFile from '../../components/upload_file/uploadFile';

function MaterialsUsed(props) {
  const refs = {
    imageInput: React.useRef(null),
    image_count_el: React.useRef(null),
  }
  const {
        classes, 
        common_classes, 
        addMoreLabel,
        imagesLabel, 
        encouragingText,
        setValue,
        materialsUsedList,
        setNewActivity
        } = props;
  const [materials, setMaterials] = useState(materialsUsedList)     
  const handleImageButtonClick = (e) => {
    refs.imageInput.current.click()
  } 
  
  return (
    <div>
      <Grid container>
        <Grid item xs={12} md={6}>
          {materials.map((value, index) => (
            <Input
              label={`materialsUsed[${index}]`}
              defaultValue={
                props.newActivity['materialsUsed']
                  ? props.newActivity.materialsUsed[index]
                  : ''
              }
              classes={classes}
              {...props}
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
          <AddMore setNodeList={setMaterials} label={addMoreLabel} />
        </Grid>
      </Grid>
      <p className={clsx(classes.fieldHelperTextStyle, classes.errorMessage)}>
        {props.touched['materialsUsed'] &&
          props.errors['materialsUsed'] === 'required1' &&
          props.t(`createActivity.inputs.materialsUsed.errors.required1`)}
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
              id={'ActivityMaterialsUsedImages'}
              fileType={'image/*'}
              uploadButtonLabel={props.t(
                'createActivity.inputs.materialsUsed.images.label',
              )}
              classes={classes}
              wraperState={props.newActivity}
              setWraperState={props.handleSetNewActivity}
              t={props.t}
              setFieldValue={props.setFieldValue}
              setFieldTouched={props.setFieldTouched}
              touched={props.touched}
              errors={props.errors}
              setStatus={props.setStatus}
              countFilesText={[
                props.t('createProject.inputs.image'),
                props.t('createProject.inputs.images'),
              ]}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default MaterialsUsed