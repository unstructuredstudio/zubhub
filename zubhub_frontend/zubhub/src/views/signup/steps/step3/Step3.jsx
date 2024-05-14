// import { ArrowBackOutlined, LocationOnOutlined } from '@mui/icons-material';
import { TfiLocationPin, TfiArrowLeft, TfiAngleDown, TfiAngleUp } from 'react-icons/tfi';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from '@mui/material';
import { CustomButton, CustomErrorMessage } from '../../../../components';
import SpaceBackground from '../../../../assets/images/space.png';
import { makeStyles } from '@mui/styles';
import { mainStyles, step3Styles } from '../../signupStyles';

const useMainStyles = makeStyles(mainStyles);
const useStyles = makeStyles(step3Styles);

const Step3 = props => {
  const mainClasses = useMainStyles();
  const { locations, errors, handleChange, handleBlur, goAction, touched } = props;

  return (
    <Box width="100%">
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        maxWidth="600px"
        margin="0 auto"
        rowSpacing={{ xs: 2, sm: 3, md: 5 }}
      >
        <Grid item>
          <Grid>
            <div style={{ position: 'absolute', marginLeft: '40px', marginTop: '40px' }}>
              <IconButton onClick={() => goAction('prev', false)} className={mainClasses.backContainer}>
                <TfiArrowLeft className={mainClasses.backIcon} />
              </IconButton>
            </div>
          </Grid>
          <Grid>
            <img src={SpaceBackground} alt="" className={mainClasses.spaceBackground} />
          </Grid>
        </Grid>
        <Grid
          item
          container
          direction="column"
          alignItems="center"
          rowSpacing={{ xs: 2, sm: 3, md: 5 }}
          className={mainClasses.gridControl}
        >
          <Grid item>
            <Typography maxWidth="342px" align="center" className={mainClasses.header2}>
              What country do you live in?
            </Typography>
          </Grid>
          <Grid item width="100%">
            <FormControl fullWidth error={touched['location'] && errors['location']}>
              <Select
                id="location"
                labelId="select-label"
                name="location"
                defaultValue="none"
                onChange={handleChange}
                onBlur={handleBlur}
                input={<OutlinedInput />}
                className={mainClasses.outlinedInput}
                IconComponent={() => <TfiAngleDown style={{ fontSize: '24px', fill: '#bdbdbd', marginLeft: '24px' }} />}
                startAdornment={
                  <InputAdornment>
                    <TfiLocationPin className={mainClasses.inputIcon} />
                  </InputAdornment>
                }
              >
                <MenuItem value="none" disabled>
                  <Typography color="dimgrey">Select a location</Typography>
                </MenuItem>
                <MenuItem value="testing">
                  <Typography color="black">Testing</Typography>
                </MenuItem>
                {Array.isArray(locations) &&
                  locations?.map((location, index) => (
                    <MenuItem key={index} value={location.name}>
                      {location.name}
                    </MenuItem>
                  ))}
              </Select>
              <CustomErrorMessage name="location" {...props} />
            </FormControl>
          </Grid>
          <Grid item width="100%">
            <CustomButton
              onClick={() => goAction('next', !!errors['location'])}
              primaryButtonStyle
              fullWidth
              className={mainClasses.button}
            >
              Next
            </CustomButton>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Step3;
