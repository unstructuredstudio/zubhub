import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { withFormik } from 'formik';
import * as Yup from 'yup';

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Box,
  Container,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  OutlinedInput,
  InputLabel,
  FormHelperText,
  FormControl,
} from '@material-ui/core';

import * as AuthActions from '../../store/actions/authActions';
import CustomButton from '../../components/button/Button';
import styles from '../../assets/js/styles/views/password_reset/passwordResetStyles';

const useStyles = makeStyles(styles);

const sendPasswordResetLink = (e, props) => {
  e.preventDefault();
  return props
    .send_password_reset_link({
      email: props.values.email,
      t: props.t,
      history: props.history,
    })
    .catch(error => {
      const messages = JSON.parse(error.message);
      if (typeof messages === 'object') {
        const server_errors = {};
        Object.keys(messages).forEach(key => {
          if (key !== 'email') {
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

function PasswordReset(props) {
  const classes = useStyles();
  const { t } = props;

  return (
    <Box className={classes.root}>
      <Container maxWidth="sm">
        <Card className={classes.cardStyle}>
          <CardActionArea>
            <CardContent>
              <form
                className="auth-form"
                name="password_reset"
                noValidate="noValidate"
                onSubmit={e => sendPasswordResetLink(e, props)}
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  color="textPrimary"
                  className={classes.titleStyle}
                >
                  {t('passwordReset.welcomeMsg.primary')}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {t('passwordReset.welcomeMsg.secondary')}
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
                  <Grid item xs={12}>
                    <FormControl
                      className={clsx(classes.margin, classes.textField)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                      error={
                        (props.status && props.status['email']) ||
                        (props.touched['email'] && props.errors['email'])
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="email"
                      >
                        {t('passwordReset.inputs.email.label')}
                      </InputLabel>
                      <OutlinedInput
                        className={classes.customInputStyle}
                        id="email"
                        name="email"
                        type="text"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        labelWidth={70}
                      />
                      <FormHelperText error>
                        {(props.status && props.status['email']) ||
                          (props.touched['email'] &&
                            props.errors['email'] &&
                            t(
                              `passwordReset.inputs.email.errors.${props.errors['email']}`,
                            ))}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <CustomButton
                      variant="contained"
                      size="large"
                      primaryButtonStyle
                      type="submit"
                      fullWidth
                    >
                      {t('passwordReset.inputs.submit')}
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

PasswordReset.propTypes = {
  auth: PropTypes.object.isRequired,
  send_password_reset_link: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    send_password_reset_link: props => {
      return dispatch(AuthActions.send_password_reset_link(props));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  withFormik({
    mapPropsToValue: () => ({
      email: '',
    }),
    validationSchema: Yup.object().shape({
      email: Yup.string().email('invalid').required('required'),
    }),
  })(PasswordReset),
);
