import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { withFormik } from 'formik';

import { makeStyles } from '@mui/styles';
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
} from '@mui/material';

import { sendPasswordResetLink, validationSchema } from './passwordResetScripts';

import * as AuthActions from '../../store/actions/authActions';
import CustomButton from '../../components/button/Button';
import styles from '../../assets/js/styles/views/password_reset/passwordResetStyles';

const useStyles = makeStyles(styles);

/**
 * @function PasswordReset View
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function PasswordReset(props) {
  const classes = useStyles();
  const { t } = props;

  return (
    <Box className={classes.root}>
      <Container className={classes.containerStyle}>
        <Card className={classes.cardStyle}>
          <CardActionArea>
            <CardContent>
              <form
                className="auth-form"
                name="password_reset"
                noValidate="noValidate"
                onSubmit={e => sendPasswordResetLink(e, props)}
              >
                <Typography gutterBottom variant="h5" component="h2" color="textPrimary" className={classes.titleStyle}>
                  {t('passwordReset.welcomeMsg.primary')}
                </Typography>
                <Typography className={classes.descStyle} variant="body2" color="textSecondary" component="p">
                  {t('passwordReset.welcomeMsg.secondary')}
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box component="p" className={props.status && props.status['non_field_errors'] && classes.errorBox}>
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
                      margin="normal"
                      error={
                        (props.status && props.status['email']) || (props.touched['email'] && props.errors['email'])
                      }
                    >
                      <InputLabel className={classes.customLabelStyle} htmlFor="email">
                        {t('passwordReset.inputs.email.label')}
                      </InputLabel>
                      <OutlinedInput
                        className={classes.customInputStyle}
                        id="email"
                        name="email"
                        type="text"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        label={t('passwordReset.inputs.email.label')}
                      />
                      <FormHelperText className={classes.fieldHelperTextStyle} error>
                        {(props.status && props.status['email']) ||
                          (props.touched['email'] &&
                            props.errors['email'] &&
                            t(`passwordReset.inputs.email.errors.${props.errors['email']}`))}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <CustomButton
                      variant="contained"
                      size="large"
                      primaryButtonStyle
                      customButtonStyle
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
  sendPasswordResetLink: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    sendPasswordResetLink: props => {
      return dispatch(AuthActions.sendPasswordResetLink(props));
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
    validationSchema,
  })(PasswordReset),
);
