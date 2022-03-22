import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { withFormik } from 'formik';

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

import {
  validationSchema,
  resetPassword,
  handleClickShowPassword,
  handleMouseDownPassword,
} from './passwordResetConfirmScripts';

import * as AuthActions from '../../store/actions/authActions';
import CustomButton from '../../components/button/Button';
import styles from '../../assets/js/styles/views/password_reset_confirm/passwordResetConfirmStyles';
import { calculateLabelWidth } from '../../assets/js/utils/scripts';

const useStyles = makeStyles(styles);

/**
 * @function PasswordResetConfirm View
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function PasswordResetConfirm(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    show_password1: false,
    show_password2: false,
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { show_password1, show_password2 } = state;
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
                        type={show_password1 ? 'text' : 'password'}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={(_, field = 1) =>
                                handleSetState(
                                  handleClickShowPassword(field, state),
                                )
                              }
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {show_password1 ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        labelWidth={calculateLabelWidth(
                          t('passwordResetConfirm.inputs.newPassword1.label'),
                          document,
                        )}
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
                        type={show_password2 ? 'text' : 'password'}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={(_, field = 2) =>
                                handleSetState(
                                  handleClickShowPassword(field, state),
                                )
                              }
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {show_password2 ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        labelWidth={calculateLabelWidth(
                          t('passwordResetConfirm.inputs.newPassword2.label'),
                          document,
                        )}
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
  passwordResetConfirm: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    passwordResetConfirm: args => {
      return dispatch(AuthActions.passwordResetConfirm(args));
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
    validationSchema,
  })(PasswordResetConfirm),
);
