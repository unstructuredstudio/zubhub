import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as AuthActions from '../../store/actions/authActions';
import {
  Box,
  Grid,
  FormControl,
  FormLabel,
  OutlinedInput,
  InputAdornment,
  Typography,
  IconButton,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { CustomButton, CustomErrorMessage } from '../../components';
import { TfiLock, TfiArrowLeft } from 'react-icons/tfi';
import { SlEye, SlUser } from 'react-icons/sl';
import { BsEyeSlash } from 'react-icons/bs';
import { makeStyles } from '@mui/styles';
import { useState } from 'react';
import { mainStyles, step2Styles } from '../../assets/js/styles/views/login/loginStyles';
import { handleLogin, validationSchema } from './loginScripts';
import { useFormik } from 'formik';

const useMainStyles = makeStyles(mainStyles);
const useStyles = makeStyles(step2Styles);

const Login = props => {
  const [{ password }, setShowPassword] = useState({ password: false });
  const classes = useStyles();
  const mainClasses = useMainStyles();
  const {
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    touched,
  } = useFormik({
    initialValues: {
      username: '',
      password: '',
      remember: false
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => await handleLogin(props, values)
  })

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
        <form onSubmit={handleSubmit}>
        <Grid item>
          <Typography align="center" className={mainClasses.header2}>
            Welcome to ZubHub !
          </Typography>
          <Typography align="center" className={mainClasses.text2}>
          Log Into your ZubHub account to share ideas
          </Typography>
        </Grid>
        <Grid item>
          <FormControl fullWidth className={mainClasses.formControl} error={touched['username'] && errors['username']}>
            <FormLabel className={mainClasses.subHeader2}>Username or Email address</FormLabel>
            <OutlinedInput
              id="username"
              name="username"
              type="text"
              placeholder="Enter username or email address"
              onChange={handleChange}
              onBlur={handleBlur}
              className={mainClasses.outlinedInput}
              startAdornment={
                <InputAdornment>
                  <SlUser className={mainClasses.inputIcon} />
                </InputAdornment>
              }
            />
           <CustomErrorMessage name="username" errors={errors} touched={touched} />
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
              placeholder="Enter password"
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
            <CustomErrorMessage name="password" errors={errors} touched={touched} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl>
            <FormControlLabel
              name="remember"
              id="remember"
              onChange={handleChange}
              onBlur={handleBlur}
              label="Remember me"
              control={<Checkbox />}
            />
          </FormControl>
        </Grid>
        <Grid item>
          <CustomButton
          type='submit'
            className={mainClasses.button}
            primaryButtonStyle
            fullWidth
          >
            Login
          </CustomButton>
        </Grid>
        </form>
      </Grid>
    </Box>
  );
};

Login.propTypes = {
  auth: PropTypes.object.isRequired,
  setAuthUser: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setAuthUser: auth_user => {
      dispatch(AuthActions.setAuthUser(auth_user));
    },
    login: args => {
      return dispatch(AuthActions.login(args));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);
