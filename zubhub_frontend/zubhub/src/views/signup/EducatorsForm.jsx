import {
  Box,
  Grid,
  FormControl,
  FormLabel,
  OutlinedInput,
  InputAdornment,
  Typography,
  MenuItem,
  Select,
  FormControlLabel,
  Checkbox,
  IconButton,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CustomErrorMessage, CustomButton } from '../../components';
import { SlEnvolope, SlUser, SlEye } from 'react-icons/sl';
import { BsEyeSlash } from 'react-icons/bs';
import { TfiLocationPin, TfiLock, TfiAngleDown, TfiControlRecord } from 'react-icons/tfi';
import { makeStyles } from '@mui/styles';
import { mainStyles } from './signupStyles';
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import { useState } from 'react';

const useMainStyles = makeStyles(mainStyles);

const EducatorsForm = props => {
  const [{ password, confirmPassword }, setShowPassword] = useState({ password: false, confirmPassword: false });
  const mainClasses = useMainStyles();
  const {
    setFieldValue,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    touched,
    values: { dateOfBirth },
  } = props;

  const getMaxDate = () => {
    const currentDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(currentDate.getFullYear() - 12);
    return dayjs(maxDate);
  };

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
          <FormControl fullWidth className={mainClasses.formControl} error={touched['username'] && errors['username']}>
            <FormLabel className={mainClasses.subHeader2}>Username</FormLabel>
            <OutlinedInput
              name="username"
              id="username"
              onChange={handleChange}
              onBlur={handleBlur}
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
          <FormControl fullWidth className={mainClasses.formControl} error={touched['email'] && errors['email']}>
            <FormLabel className={mainClasses.subHeader2}>Email Address</FormLabel>
            <OutlinedInput
              name="email"
              id="email"
              onChange={handleChange}
              onBlur={handleBlur}
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
          <FormControl
            fullWidth
            className={mainClasses.formControl}
            error={touched['dateOfBirth'] && errors['dateOfBirth']}
          >
            <FormLabel className={mainClasses.subHeader2}>When were you born?</FormLabel>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
              <DatePicker
                defaultValue={getMaxDate()}
                value={dayjs(dateOfBirth)}
                maxDate={getMaxDate()}
                name="dateOfBirth"
                onChange={date => setFieldValue('dateOfBirth', date)}
                onBlur={handleBlur}
                slotProps={{
                  inputAdornment: { position: 'start' },
                  textField: {
                    placeholder: 'dd/mm/yyyy',
                  },
                }}
              />
            </LocalizationProvider>
            <CustomErrorMessage name="dateOfBirth" {...props} />
          </FormControl>
        </Grid>
        <Grid item width="100%">
          <FormControl fullWidth className={mainClasses.formControl} error={touched['location'] && errors['location']}>
            <FormLabel className={mainClasses.subHeader2}>Where do you live?</FormLabel>
            <Select
              labelId="select-label"
              name="location"
              id="location"
              onChange={handleChange}
              onBlur={handleBlur}
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
              <MenuItem value={'testing'}>Test location</MenuItem>
            </Select>
            <CustomErrorMessage name="location" {...props} />
          </FormControl>
        </Grid>
        <Grid item width="100%">
          <FormControl fullWidth className={mainClasses.formControl} error={touched['gender'] && errors['gender']}>
            <FormLabel className={mainClasses.subHeader2}>What's your gender?</FormLabel>
            <Select
              labelId="gender-select-label"
              name="gender"
              id="gender"
              onChange={handleChange}
              onBlur={handleBlur}
              defaultValue="none"
              input={<OutlinedInput />}
              className={mainClasses.outlinedInput}
              IconComponent={() => <TfiAngleDown style={{ fontSize: '24px', fill: '#bdbdbd', marginLeft: '24px' }} />}
              startAdornment={
                <InputAdornment>
                  <TfiControlRecord className={mainClasses.inputIcon} />
                </InputAdornment>
              }
            >
              <MenuItem value="none" disabled>
                <Typography color="dimgrey">Select a gender</Typography>
              </MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
              <MenuItem value="unspecified">Prefer not to say</MenuItem>
            </Select>
            <CustomErrorMessage name="gender" {...props} />
          </FormControl>
        </Grid>
        <Grid item width={'100%'}>
          <FormControl fullWidth className={mainClasses.formControl} error={touched['password'] && errors['password']}>
            <FormLabel className={mainClasses.subHeader2}>Password</FormLabel>
            <OutlinedInput
              name="password"
              id="password"
              type={password ? 'text' : 'password'}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your password"
              className={mainClasses.outlinedInput}
              startAdornment={
                <InputAdornment>
                  <TfiLock className={mainClasses.inputIcon} />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment>
                  <IconButton onClick={() => setShowPassword({ password: !password })}>
                    {password ? (
                      <BsEyeSlash className={mainClasses.inputIcon} />
                    ) : (
                      <SlEye className={mainClasses.inputIcon} />
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
            <CustomErrorMessage name="password" {...props} />
          </FormControl>
        </Grid>
        <Grid item width={'100%'}>
          <FormControl
            fullWidth
            className={mainClasses.formControl}
            error={touched['confirmPassword'] && errors['confirmPassword']}
          >
            <FormLabel className={mainClasses.subHeader2}>Confirm Password</FormLabel>
            <OutlinedInput
              name="confirmPassword"
              id="confirmPassword"
              type={confirmPassword ? 'text' : 'password'}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter password again"
              className={mainClasses.outlinedInput}
              startAdornment={
                <InputAdornment>
                  <TfiLock className={mainClasses.inputIcon} />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment>
                  <IconButton onClick={() => setShowPassword({ confirmPassword: !confirmPassword })}>
                    {confirmPassword ? (
                      <BsEyeSlash className={mainClasses.inputIcon} />
                    ) : (
                      <SlEye className={mainClasses.inputIcon} />
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
            <CustomErrorMessage name="confirmPassword" {...props} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl>
            <FormControlLabel
              name="sendTips"
              id="sendTips"
              onChange={handleChange}
              onBlur={handleBlur}
              label="Send me personalised recommendations and learning tips."
              control={<Checkbox />}
            />
          </FormControl>
        </Grid>
        <Grid item width={'100%'}>
          <CustomButton onClick={handleSubmit} className={mainClasses.button} primaryButtonStyle fullWidth>
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
