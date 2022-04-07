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

import {
  validationSchema,
  handleClickShowPassword,
  handleMouseDownPassword,
  login,
} from './loginScripts';

import { withFormik } from 'formik';

import CustomButton from '../../components/button/Button';
import * as AuthActions from '../../store/actions/authActions';
import styles from '../../assets/js/styles/views/login/loginStyles';
import { calculateLabelWidth } from '../../assets/js/utils/scripts';

const useStyles = makeStyles(styles);

/**
 * @function Login View
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function Login(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    show_password: false,
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { show_password } = state;
  const { t } = props;

  return (
    <Box className={classes.root}>
      <Container className={classes.containerStyle}>
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
                  {t('login.welcomeMsg.primary')}
                </Typography>
                <Typography
                  className={classes.descStyle}
                  variant="body2"
                  color="textSecondary"
                  component="p"
                >
                  {t('login.welcomeMsg.secondary')}
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box
                      component="p"
                      className={
                        props.status &&
                        props.status['non_field_errors'] &&
                        classes.errorBox
                      }
                    >
                      {props.status && props.status['non_field_errors'] && (
                        <Box component="span" className={classes.error}>
                          {props.status['non_field_errors']}
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
                        (props.status && props.status['username']) ||
                        (props.touched['username'] && props.errors['username'])
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
                        labelWidth={calculateLabelWidth(
                          t('login.inputs.username.label'),
                          document,
                        )}
                      />
                      <FormHelperText
                        className={classes.fieldHelperTextStyle}
                        error
                      >
                        {(props.status && props.status['username']) ||
                          (props.touched['username'] &&
                            props.errors['username'] &&
                            t(
                              `login.inputs.username.errors.${props.errors['username']}`,
                            ))}
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
                        (props.status && props.status['password']) ||
                        (props.touched['password'] && props.errors['password'])
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="password"
                      >
                        {t('login.inputs.password.label')}
                      </InputLabel>
                      <OutlinedInput
                        className={classes.customInputStyle}
                        id="password"
                        name="password"
                        type={show_password ? 'text' : 'password'}
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
                              {show_password ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        labelWidth={calculateLabelWidth(
                          t('login.inputs.password.label'),
                          document,
                        )}
                      />
                      <FormHelperText
                        className={classes.fieldHelperTextStyle}
                        error
                      >
                        {(props.status && props.status['password']) ||
                          (props.touched['password'] &&
                            props.errors['password'] &&
                            t(
                              `login.inputs.password.errors.${props.errors['password']}`,
                            ))}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <CustomButton
                      variant="contained"
                      size="large"
                      type="submit"
                      primaryButtonStyle
                      customButtonStyle
                      fullWidth
                    >
                      {t('login.inputs.submit')}
                    </CustomButton>
                  </Grid>
                </Grid>
              </form>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box className={classes.center}>
                    <Divider className={classes.divider} />
                    <Typography
                      className={classes.dividerText}
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {t('login.notAMember')}
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
                      customButtonStyle
                      fullWidth
                    >
                      {t('login.signup')}
                    </CustomButton>
                  </Link>
                </Grid>
                <Grid item xs={12}>
                  <Box className={classes.center}>
                    <Link
                      to="/password-reset"
                      className={classes.secondaryLink}
                    >
                      {t('login.forgotPassword')}
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
)(
  withFormik({
    mapPropsToValue: () => ({
      password: '',
    }),
    validationSchema,
  })(Login),
);
