import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { withFormik } from 'formik';
import * as Yup from 'yup';

import { makeStyles } from '@material-ui/core/styles';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {
  Grid,
  Box,
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

import * as AuthActions from '../../store/actions/authActions';
import CustomButton from '../../components/button/Button';
import styles from '../../assets/js/styles/views/password_reset_confirm/passwordResetConfirmStyles';

const useStyles = makeStyles(styles);

const getUidAndToken = queryString => {
  let uid = queryString.split('&&');
  const token = uid[1].split('=')[1];
  uid = uid[0].split('=')[1];
  return { uid, token };
};

const resetPassword = (e, props) => {
  e.preventDefault();
  const { uid, token } = getUidAndToken(props.location.search);
  return props
    .password_reset_confirm({
      ...props.values,
      uid,
      token,
      t: props.t,
      history: props.history,
    })
    .catch(error => {
      const messages = JSON.parse(error.message);
      if (typeof messages === 'object') {
        const server_errors = {};
        Object.keys(messages).forEach(key => {
          if (key !== 'new_password1' && key !== 'new_password2') {
            server_errors['non_field_errors'] = messages[key][0];
          } else {
            server_errors[key] = messages[key][0];
          }
        });

        props.setStatus({ ...server_errors });
      } else {
        props.setStatus({
          non_field_errors: props.t('passwordResetConfirm.errors.unexpected'),
        });
      }
    });
};

const handleClickShowPassword = (field, state) => {
  if (field === 1) {
    const { showPassword1 } = state;
    return { showPassword1: !showPassword1 };
  } else if (field === 2) {
    const { showPassword2 } = state;
    return { showPassword2: !showPassword2 };
  }
};

const handleMouseDownPassword = e => {
  e.preventDefault();
};

function PasswordResetConfirm(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    showPassword1: false,
    showPassword2: false,
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { showPassword1, showPassword2 } = state;
  const { t } = props;

  return (
    <Box className={classes.root}>
      <Container className={classes.containerStyle}>
        <Card className={classes.cardStyle}>
          <CardActionArea>
            <CardContent>
              <form
                className="auth-form"
                name="password_reset_confirm"
                noValidate="noValidate"
                onSubmit={e => resetPassword(e, props)}
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  color="textPrimary"
                  className={classes.titleStyle}
                >
                  {t('passwordResetConfirm.welcomeMsg.primary')}
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
                        (props.status && props.status['new_password1']) ||
                        (props.touched['new_password1'] &&
                          props.errors['new_password1'])
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="new_password1"
                      >
                        {t('passwordResetConfirm.inputs.newPassword1.label')}
                      </InputLabel>
                      <OutlinedInput
                        className={classes.customInputStyle}
                        id="new_password1"
                        name="new_password1"
                        type={showPassword1 ? 'text' : 'password'}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={(e, field = 1) =>
                                handleSetState(
                                  handleClickShowPassword(field, state),
                                )
                              }
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword1 ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        labelWidth={70}
                      />
                      <FormHelperText
                        className={classes.fieldHelperTextStyle}
                        error
                      >
                        {(props.status && props.status['new_password1']) ||
                          (props.touched['new_password1'] &&
                            props.errors['new_password1'] &&
                            t(
                              `passwordResetConfirm.inputs.newPassword1.errors.${props.errors['new_password1']}`,
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
                        (props.status && props.status['new_password2']) ||
                        (props.touched['new_password2'] &&
                          props.errors['new_password2'])
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="new_password2"
                      >
                        {t('passwordResetConfirm.inputs.newPassword2.label')}
                      </InputLabel>
                      <OutlinedInput
                        className={classes.customInputStyle}
                        id="new_password2"
                        name="new_password2"
                        type={showPassword2 ? 'text' : 'password'}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={(e, field = 2) =>
                                handleSetState(
                                  handleClickShowPassword(field, state),
                                )
                              }
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword2 ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        labelWidth={150}
                      />
                      <FormHelperText
                        className={classes.fieldHelperTextStyle}
                        error
                      >
                        {(props.status && props.status['new_password2']) ||
                          (props.touched['new_password2'] &&
                            props.errors['new_password2'] &&
                            t(
                              `passwordResetConfirm.inputs.newPassword2.errors.${props.errors['new_password2']}`,
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
                      {t('passwordResetConfirm.inputs.submit')}
                    </CustomButton>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </CardActionArea>
        </Card>
      </Container>
    </Box>
  );
}

PasswordResetConfirm.propTypes = {
  auth: PropTypes.object.isRequired,
  password_reset_confirm: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    password_reset_confirm: args => {
      return dispatch(AuthActions.password_reset_confirm(args));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  withFormik({
    mapPropsToValue: () => ({
      new_password1: '',
      new_password2: '',
    }),
    validationSchema: Yup.object().shape({
      new_password1: Yup.string().min(8, 'min').required('required'),
      new_password2: Yup.string()
        .oneOf([Yup.ref('new_password1'), null], 'noMatch')
        .required('required'),
    }),
  })(PasswordResetConfirm),
);
