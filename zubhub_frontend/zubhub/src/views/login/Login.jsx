import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {
  Grid,
  Box,
  Divider,
  Container,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  InputAdornment,
  IconButton,
  OutlinedInput,
  InputLabel,
  FormHelperText,
  FormControl,
} from '@material-ui/core';

import { withFormik } from 'formik';
import * as Yup from 'yup';

import CustomButton from '../../components/button/Button';
import * as AuthActions from '../../store/actions/authActions';
import styles from '../../assets/js/styles/views/login/loginStyles';

const useStyles = makeStyles(styles);

const handleClickShowPassword = state => {
  const { showPassword } = state;
  return { showPassword: !showPassword };
};

const handleMouseDownPassword = e => {
  e.preventDefault();
};

const login = (e, props) => {
  e.preventDefault();
  return props.login(props).catch(error => {
    const messages = JSON.parse(error.message);
    if (typeof messages === 'object') {
      let non_field_errors;
      Object.keys(messages).forEach(key => {
        if (key === 'non_field_errors') {
          non_field_errors = { error: messages[key][0] };
        } else {
          props.setFieldTouched(key, true, false);
          props.setFieldError(key, messages[key][0]);
        }
      });
      return non_field_errors;
    } else {
      return {
        error: props.t('login.others.errors.unexpected'),
      };
    }
  });
};

function Login(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    error: null,
    showPassword: false,
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState({ ...state, ...obj });
      });
    }
  };

  const { error, showPassword } = state;
  const { t } = props;

  return (
    <Box className={classes.root}>
      <Container maxWidth="sm">
        <Card className={classes.cardStyle}>
          <CardActionArea>
            <CardContent>
              <form
                className="auth-form"
                name="login"
                noValidate="noValidate"
                onSubmit={e => handleSetState(login(e, props))}
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  color="textPrimary"
                  className={classes.titleStyle}
                >
                  {t('login.welcome.primary')}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {t('login.welcome.secondary')}
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box component="p" className={error && classes.errorBox}>
                      {error && (
                        <Box component="span" className={classes.error}>
                          {error}
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl
                      className={clsx(classes.margin, classes.textField)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      margin="normal"
                      error={
                        props.touched['username'] && props.errors['username']
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="username"
                      >
                        {t('login.inputs.username.label')}
                      </InputLabel>
                      <OutlinedInput
                        className={classes.customInputStyle}
                        id="username"
                        name="username"
                        type="text"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        labelWidth={150}
                      />
                      <FormHelperText error>
                        {props.touched['username'] &&
                          props.errors['username'] &&
                          t(
                            `login.inputs.username.errors.${props.errors['username']}`,
                          )}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl
                      className={clsx(classes.margin, classes.textField)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      margin="normal"
                      error={
                        props.touched['password'] && props.errors['password']
                      }
                    >
                      <InputLabel htmlFor="password">
                        {t('login.inputs.password.label')}
                      </InputLabel>
                      <OutlinedInput
                        className={classes.customInputStyle}
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() =>
                                handleSetState(handleClickShowPassword(state))
                              }
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        labelWidth={70}
                      />
                      <FormHelperText error>
                        {props.touched['password'] &&
                          props.errors['password'] &&
                          t(
                            `login.inputs.password.errors.${props.errors['password']}`,
                          )}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <CustomButton
                      variant="contained"
                      size="large"
                      type="submit"
                      primaryButtonStyle
                      fullWidth
                    >
                      {t('login.submit')}
                    </CustomButton>
                  </Grid>
                </Grid>
              </form>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box className={classes.center}>
                    <Divider className={classes.divider} />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {t('login.others.notAMember')}
                    </Typography>
                    <Divider className={classes.divider} />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Link to="/signup" className={classes.textDecorationNone}>
                    <CustomButton
                      variant="outlined"
                      size="large"
                      secondaryButtonStyle
                      fullWidth
                    >
                      {t('login.others.signup')}
                    </CustomButton>
                  </Link>
                </Grid>
                <Grid item xs={12}>
                  <Box className={classes.center}>
                    <Link
                      to="/password-reset"
                      className={classes.secondaryLink}
                    >
                      {t('login.others.forgotPassword')}
                    </Link>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </CardActionArea>
        </Card>
      </Container>
    </Box>
  );
}

Login.propTypes = {
  auth: PropTypes.object.isRequired,
  set_auth_user: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    set_auth_user: auth_user => {
      dispatch(AuthActions.setAuthUser(auth_user));
    },
    login: props => {
      return dispatch(AuthActions.login(props));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  withFormik({
    mapPropsToValue: () => ({
      password: '',
    }),
    validationSchema: Yup.object().shape({
      username: Yup.string().required('required'),
      password: Yup.string().min(8, 'min').required('required'),
    }),
  })(Login),
);
