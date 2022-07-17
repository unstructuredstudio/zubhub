import React, {useState} from 'react';
import AddMore from '../../components/addMore/addMore';
import clsx from 'clsx';
import ImageIcon from '@material-ui/icons/Image';
import AddIcon from '@material-ui/icons/Add';
import CustomButton from '../../components/button/Button';
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

function MaterialsUsed(props) {
  const {
        classes, 
        common_classes, 
        label,  
        fieldLabel, 
        addMoreLabel,
        imagesLabel, 
        inputOrder,
        encouragingText,
        setValue,
        materialsUsedList,
        setNewActivity
        } = props;
  const [materials, setMaterials] = useState(materialsUsedList)      
  const handleMaterialsUsedFieldBlur = () => {
    setNewActivity(prev => ({...prev, materialsUsed: materials}))
  }
  const handleMaterialsUsedFieldChange = (index, value) => {
    console.log('onchange', index, value)
    const mt = materials
    mt[index] = value
    setMaterials(mt)
  } 
  
  return (
    <div>
            <Grid container >
              <Grid item xs={12} md={6} >
                <FormControl
                  className={clsx(classes.margin, classes.textField)}
                  variant="outlined"
                  size="small"
                  fullWidth
                  margin="small"
                >
                  <label htmlFor={label}>
                    <Typography
                      color="textSecondary"
                      className={clsx(
                        classes.customLabelStyle,
                        common_classes.marginBottom1em,
                      )}
                    >
                      <Box className={classes.fieldNumberStyle}>{inputOrder}</Box>
                      {fieldLabel}
                    </Typography>
                  </label>
                  {materials.map((value,index) => (
                    <OutlinedInput
                    key={`${index}materialsUsed`}
                    className={clsx(
                        classes.customInputStyle,
                        common_classes.marginTop1em,
                    )}
                    type="text"
                    onBlur={e => handleMaterialsUsedFieldBlur()}
                    onChange={e => handleMaterialsUsedFieldChange(index, e.target.value)}
                    value={materials[index]}
                    placeholder={`${index + 1}.`}
                    />    
                    ))
                  }  
                </FormControl>
              </Grid>
              <Grid 
                item xs={12} 
                md={6}
                rowSpacing={3}
                container
                direction="row"
                alignItems="flex-end"
                justifyContent="center"
                >                        
                <AddMore 
                  setNodeList={setMaterials}
                  label={addMoreLabel}
                />
              </Grid>  
            </Grid>
            <Grid item xs={12} className={common_classes.marginTop1em}> 
              <FormControl>
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
                  <Grid item xs={12} sm={6} md={6}>
                    <CustomButton
                      variant="outlined"
                      size="large"
                      margin="normal"
                      id="image_upload_button"
                      startIcon={<ImageIcon />}
                      // onClick={e =>
                      //   handleImageButtonClick(e, props)
                      // }
                      secondaryButtonStyle
                      mediaUploadButtonStyle
                      customButtonStyle
                      fullWidth
                    >
                      {imagesLabel}
                    </CustomButton>
                  </Grid>
                </Grid>
                <input
                  className={classes.displayNone}
                  aria-hidden="true"
                  type="file"
                  accept="image/*"
                  id="activityMaterialsUsedImage"
                  name="activityMaterialsUsedImage"
                  multiple
                />
              </FormControl>
              </Grid>
    </div>
  )
};

export default MaterialsUsed