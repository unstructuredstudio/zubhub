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
import classNames from 'classnames';
import { makeStyles } from '@mui/styles';
import { mainStyles, step3Styles } from '../../signupStyles';

const useMainStyles = makeStyles(mainStyles);
const useStyles = makeStyles(step3Styles);

const Step3 = props => {
  const mainClasses = useMainStyles();
  const classes = useStyles();

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
          <Grid position="absolute" mt={5} ml={5}>
            <IconButton className={classes.backContainer}>
              <TfiArrowLeft className={classes.backIcon} />
            </IconButton>
          </Grid>
          <Grid>
            <img src={SpaceBackground} alt="" className={classes.spaceBackground} />
          </Grid>
        </Grid>
        <Grid item>
          <Typography maxWidth="342px" align="center" className={mainClasses.header2}>
            What country do you live in?
          </Typography>
        </Grid>
        <Grid item width="100%">
          <FormControl fullWidth>
            <Select
              labelId="select-label"
              name="location"
              input={<OutlinedInput />}
              className={mainClasses.outlinedInput}
              IconComponent={TfiAngleDown}
              startAdornment={
                <InputAdornment>
                  <TfiLocationPin />
                </InputAdornment>
              }
            >
              <MenuItem value="">
                <em>Select a location</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            <CustomErrorMessage name="location" {...props} />
          </FormControl>
        </Grid>
        <Grid item width="100%">
          <CustomButton primaryButtonStyle fullWidth className={mainClasses.button}>
            Next
          </CustomButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Step3;
