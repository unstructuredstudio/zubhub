import React, {useState} from 'react'
import clsx from 'clsx';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import 'react-toastify/dist/ReactToastify.css';
import {vars} from '../create_project/createProjectScripts'
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import ImageIcon from '@material-ui/icons/Image';
import VideoIcon from '@material-ui/icons/Movie';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import MovieIcon from '@material-ui/icons/Movie';
import InsertLinkIcon from '@material-ui/icons/InsertLink';
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
import CustomButton from '../../components/button/Button';
import projectStyles from '../../assets/js/styles/views/create_project/createProjectStyles';
import { styles } from '../../assets/js/styles/views/create_activity/createActivityStyles'
import commonStyles from '../../assets/js/styles';

const useProjectStyles = makeStyles(projectStyles);
const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

const buildMaterialUsedNodes = ( materialsUsedList, classes, common_classes ) => {
  return materialsUsedList.map((material, index) => (
    <OutlinedInput
      key={index}
      className={clsx(
        classes.customInputStyle,
        common_classes.marginTop1em,
      )}
      type="text"
      // onBlur={() => handleMaterialsUsedFieldBlur(props)}
      // onChange={e => handleAddMaterialFieldChange(e, props, refs)}
      value={material}
      placeholder={`${index + 1}.`}
    />    
  ));
};


function CreateActivityStep2(props) {
    const classes = useProjectStyles()
    const activity_classes = useStyles()
    const common_classes = useCommonStyles()
    const [newActivity, setNewActivity] = useState(props.newActivity)
    const [materialsUsedList, setMaterialsUsedList] = useState() 
    const {t} = {...props}
    const setFieldValue = (value, field) => {
      const fieldObject = {}
      fieldObject[field] = value
      setNewActivity((prevactivity) => ({ ...prevactivity, ...fieldObject }))
    }
    const setFacilitationTips = (value) => {
      setNewActivity((prevactivity) => ({ ...prevactivity, facilitationTips: value}))
    }

    const validateStep2 = () =>{
      props.handleSetState({step: 3, newActivity: newActivity})      
    }
  return (
    <div className={activity_classes.createActivityStepContainer}>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12} className={common_classes.marginTop1em}>
            <Grid container >
              <Grid item xs={12} md={6} >
                <FormControl
                  className={clsx(classes.margin, classes.textField)}
                  variant="outlined"
                  size="small"
                  fullWidth
                  margin="small"
                >
                  <label htmlFor="materialsUsed">
                    <Typography
                      color="textSecondary"
                      className={clsx(
                        classes.customLabelStyle,
                        common_classes.marginBottom1em,
                      )}
                    >
                      <Box className={classes.fieldNumberStyle}>4</Box>
                      {t('createActivity.inputs.materialsUsed.label')}
                    </Typography>
                  </label>
                  {buildMaterialUsedNodes(['','',''], classes, common_classes)}  
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
                  <CustomButton
                    variant="outlined"
                    size="large"
                    //onClick={e => addMaterialsUsedNode(e, props)}
                    secondaryButtonStyle
                    customButtonStyle
                      
                  >
                    <AddIcon />{' '}
                    {t('createProject.inputs.materialsUsed.addMore')}
                  </CustomButton>  
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
                {t('createActivity.inputs.materialsUsed.encouragingText')}
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
                      {t('createActivity.inputs.materialsUsed.images.label')}
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
          </Grid>
        
          <Grid item xs={12} className={common_classes.marginTop1em}>
            <FormControl
              className={clsx(classes.margin, classes.textField)}
              variant="outlined"
              size="small"
              fullWidth
              margin="small"
            >
              <label htmlFor="FacilitationTips">
                <Typography
                  color="textSecondary"
                  className={clsx(
                    classes.customLabelStyle,
                    common_classes.marginBottom1em,
                  )}
                >
                  <Box className={classes.fieldNumberStyle}>5</Box>
                  {t('createActivity.inputs.FacilitationTips.label')}
                </Typography>
              </label>
              <Typography
                color="textSecondary"
                variant="caption"
                component="span"
                className={clsx(
                  classes.fieldHelperTextStyle,
                  common_classes.marginBottom1em,
                )}
              >
                {t('createActivity.inputs.FacilitationTips.helperText')}
              </Typography>
              <ReactQuill
                  className= {activity_classes.reactQuillStyle}
                  modules={vars.quill.modules}
                  formats={vars.quill.formats}
                  placeholder={
                    t('createActivity.inputs.FacilitationTips.placeholder')
                  }
                  value={ newActivity.facilitationTips? newActivity.facilitationTips : '' }
                  onChange={setFacilitationTips}
              />
            </FormControl>
          </Grid> 

          <Grid item xs={12} 
            className={common_classes.marginTop3em+' '
                        +common_classes.marginBottom1em+' '
                        +common_classes.displayFlex+' '
                        +common_classes.justifyRight
                        }>
              <CustomButton
              variant="contained"
              primaryButtonStyle
              customButtonStyle
              size="small"
              onClick= {validateStep2} 
              >
              {t('createActivity.buttons.Next')}
              </CustomButton> 
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default CreateActivityStep2