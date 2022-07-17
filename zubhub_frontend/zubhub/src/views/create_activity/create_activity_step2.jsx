import React, {useState} from 'react'
import clsx from 'clsx';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import InputText from '../../components/inputText/inputText'
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
import AddMore from '../../components/addMore/addMore'
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
import MaterialsUsed from '../../components/materialsUsed/materialsUsed'

const useProjectStyles = makeStyles(projectStyles);
const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

// const buildMaterialUsedNodes = ( materialsUsedList, classes, common_classes, setMaterialsUsedList ) => {
//   const handleMaterialsUsedFieldBlur = (value) => {
//     setMaterialsUsedList((prevValues) => [...prevValues, value])
//   }
//   const handleAddMaterialFieldChange = (index, value) => {
    
//   }
//   return materialsUsedList.map((material, index) => (
//     <OutlinedInput
//       key={index}
//       className={clsx(
//         classes.customInputStyle,
//         common_classes.marginTop1em,
//       )}
//       type="text"
//       onBlur={(e) => handleMaterialsUsedFieldBlur(e.target.value)}
//       //onChange={e => handleAddMaterialFieldChange(index, e.target.value)}
//       value={material}
//       placeholder={`${index + 1}.`}
//     />    
//   ));
// };

function CreateActivityStep2(props) {
    const classes = useProjectStyles()
    const activity_classes = useStyles()
    const common_classes = useCommonStyles()
    const [newActivity, setNewActivity] = useState(props.newActivity)
    const [materialsUsedList, setMaterialsUsedList] = useState(newActivity.materialsUsed? newActivity.materialsUsed : ['','',''] ) 
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
    console.log('newActivity 2', newActivity)
  return (
    <div className={activity_classes.createActivityStepContainer}>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12} className={common_classes.marginTop1em}>
            <MaterialsUsed 
              classes={classes}
              common_classes={common_classes} 
              label={"materialsUsed"}
              fieldLabel={t('createActivity.inputs.materialsUsed.label')}
              addMoreLabel={t('createProject.inputs.materialsUsed.addMore')}
              encouragingText={t('createActivity.inputs.materialsUsed.encouragingText')}
              imagesLabel={t('createActivity.inputs.materialsUsed.images.label')} 
              inputOrder={4}
              materialsUsedList={materialsUsedList}
              setNewActivity={setNewActivity}
            />
          </Grid>
          <Grid item xs={12} className={common_classes.marginTop1em}>
              <InputText 
                classes={classes} 
                common_classes={common_classes}
                activity_classes={activity_classes}
                value={newActivity.FacilitationTips} 
                label={'FacilitationTips'}
                fieldLabel={t('createActivity.inputs.FacilitationTips.label')} 
                helperText={t('createActivity.inputs.FacilitationTips.helperText')} 
                placeholder={t('createActivity.inputs.FacilitationTips.placeholder')} 
                inputOrder={2}
                setValue={setNewActivity}
                vars={vars}
              />
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