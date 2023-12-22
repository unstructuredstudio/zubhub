import {
  Box,
  Grid,
  FormControl,
  FormLabel,
  OutlinedInput,
  InputAdornment,
  Typography,
  IconButton,
} from '@mui/material';
import { CustomButton, CustomErrorMessage } from '../../../../components';
import { TfiLock, TfiArrowLeft } from 'react-icons/tfi';
import { SlEye, SlUser } from 'react-icons/sl';
import { BsEyeSlash } from 'react-icons/bs';
import { makeStyles } from '@mui/styles';
import { useState } from 'react';
import { mainStyles, step2Styles } from '../../signupStyles';
import EducatorsForm from '../../EducatorsForm';

const useMainStyles = makeStyles(mainStyles);
const useStyles = makeStyles(step2Styles);
const Step2 = props => {
  console.log(props, 'afafadh');
  const [{ password, confirmPassword }, setShowPassword] = useState({ password: false, confirmPassword: false });
  const classes = useStyles();
  const mainClasses = useMainStyles();
  const {
    errors,
    handleChange,
    handleBlur,
    goAction,
    touched,
    values: { role },
  } = props;

  const errorsAvailable = errors['username'] || errors['password'] || errors['confirmPassword'];

  if (role === 'educator') {
    return <EducatorsForm {...props} />;
  }

  return (
    <Box width={'100%'}>
      <Grid
        container
        direction="column"
        maxWidth={'600px'}
        margin={'auto'}
        rowSpacing={{ xs: 2, sm: 3, md: 5 }}
        className={classes.container}
      >
        <Grid alignSelf="flex-start">
          <IconButton onClick={() => goAction('prev', false)} className={mainClasses.backContainer}>
            <TfiArrowLeft className={mainClasses.backIcon} />
          </IconButton>
        </Grid>
        <Grid item>
          <Typography align="center" className={mainClasses.header2}>
            Welcome to ZubHub !
          </Typography>
          <Typography align="center" className={mainClasses.text2}>
            Create projects, share ideas, make friends. It’s free{' '}
          </Typography>
        </Grid>
        <Grid item>
          <FormControl fullWidth className={mainClasses.formControl} error={touched['username'] && errors['username']}>
            <FormLabel className={mainClasses.subHeader2}>Username</FormLabel>
            <OutlinedInput
              id="username"
              name="username"
              type="text"
              placeholder="Enter a username"
              onChange={handleChange}
              onBlur={handleBlur}
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
          <CustomButton
            onClick={() => goAction('next', !!errorsAvailable)}
            className={mainClasses.button}
            primaryButtonStyle
            fullWidth
          >
            NEXT
          </CustomButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Step2;
