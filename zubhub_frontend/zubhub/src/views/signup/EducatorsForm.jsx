import {
  Box,
  Grid,
  FormControl,
  FormLabel,
  OutlinedInput,
  Button,
  InputAdornment,
  Typography,
  MenuItem,
  Select,
  FormControlLabel,
  Checkbox,
  IconButton,
} from '@mui/material';
import { CustomErrorMessage, CustomButton } from '../../components';
import { SlEnvolope, SlUser, SlEye } from 'react-icons/sl';
import { TfiLocationPin, TfiLock, TfiAngleDown } from 'react-icons/tfi';
import { makeStyles } from '@mui/styles';
import { mainStyles, step4Styles } from './signupStyles';

const useMainStyles = makeStyles(mainStyles);
const useStyles = makeStyles(step4Styles);

const EducatorsForm = props => {
  const mainClasses = useMainStyles();
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
        className={mainClasses.gridControl}
        borderRadius={1}
        pb={3}
      >
        <Grid item>
          <Typography align="center" className={mainClasses.header2}>
            Welcome to ZubHub !
          </Typography>
          <Typography align="center" className={mainClasses.text2}>
            Create projects, share ideas, make friends. It’s free{' '}
          </Typography>
        </Grid>
        <Grid item width={'100%'}>
          <FormControl fullWidth className={mainClasses.formControl}>
            <FormLabel className={mainClasses.subHeader2}>Username</FormLabel>
            <OutlinedInput
              placeholder="Enter a username"
              className={mainClasses.outlinedInput}
              startAdornment={
                <InputAdornment>
                  <SlUser className={mainClasses.inputIcon} />
                </InputAdornment>
              }
            />
            <CustomErrorMessage name="username" {...props} />
          </FormControl>
        </Grid>
        <Grid item width={'100%'}>
          <FormControl fullWidth className={mainClasses.formControl}>
            <FormLabel className={mainClasses.subHeader2}>Email Address</FormLabel>
            <OutlinedInput
              placeholder="Enter your email address"
              className={mainClasses.outlinedInput}
              startAdornment={
                <InputAdornment>
                  <SlEnvolope className={mainClasses.inputIcon} />
                </InputAdornment>
              }
            />
            <CustomErrorMessage name="email" {...props} />
          </FormControl>
        </Grid>
        <Grid item width="100%">
          <FormControl fullWidth>
            <FormLabel className={mainClasses.subHeader2}>Where do you live?</FormLabel>
            <Select
              labelId="select-label"
              name="location"
              defaultValue="none"
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
                <Typography color="dimgrey">Select country</Typography>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            <CustomErrorMessage name="location" {...props} />
          </FormControl>
        </Grid>
        <Grid item width={'100%'}>
          <FormControl fullWidth className={mainClasses.formControl}>
            <FormLabel className={mainClasses.subHeader2}>Password</FormLabel>
            <OutlinedInput
              placeholder="Enter your password"
              className={mainClasses.outlinedInput}
              startAdornment={
                <InputAdornment>
                  <TfiLock className={mainClasses.inputIcon} />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment>
                  <IconButton>
                    <SlEye className={mainClasses.inputIcon} />
                  </IconButton>
                </InputAdornment>
              }
            />
            <CustomErrorMessage name="password" {...props} />
          </FormControl>
        </Grid>
        <Grid item width={'100%'}>
          <FormControl fullWidth className={mainClasses.formControl}>
            <FormLabel className={mainClasses.subHeader2}>Confirm Password</FormLabel>
            <OutlinedInput
              placeholder="Enter password again"
              className={mainClasses.outlinedInput}
              startAdornment={
                <InputAdornment>
                  <TfiLock className={mainClasses.inputIcon} />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment>
                  <IconButton>
                    <SlEye className={mainClasses.inputIcon} />
                  </IconButton>
                </InputAdornment>
              }
            />
            <CustomErrorMessage name="confirmPassword" {...props} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl>
            <FormControlLabel label="Send me personalised recommendations and learning tips." control={<Checkbox />} />
          </FormControl>
        </Grid>
        <Grid item width={'100%'}>
          <CustomButton className={mainClasses.button} primaryButtonStyle fullWidth>
            Create Your Account
          </CustomButton>
        </Grid>
        <Grid item>
          <Typography align="center">By signing up you agree to our Terms and Services and Privacy Policy</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EducatorsForm;
