import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import 'react-toastify/dist/ReactToastify.css';

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Box,
  Container,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@material-ui/core';

import { getUsernameAndKey, confirmPhone } from './phoneConfirmScripts';

import * as AuthActions from '../../store/actions/authActions';
import CustomButton from '../../components/button/Button';
import styles from '../../assets/js/styles/views/email_confirm/emailConfirmStyles';

const useStyles = makeStyles(styles);

/**
* @function PhoneConfirm View
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
function PhoneConfirm(props) {
  const classes = useStyles();

  let { username, key } = getUsernameAndKey(props.location.search);

  const [state, setState] = React.useState({
    username: username ?? null,
    key: key ?? null,
    errors: null,
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  username = state.username;
  let errors = state.errors;
  const { t } = props;

  return (
    <Box className={classes.root}>
      <Container className={classes.containerStyle}>
        <Card className={classes.cardStyle}>
          <CardActionArea>
            <CardContent>
              <form
                className="auth-form"
                name="phone_confirm"
                noValidate="noValidate"
                onSubmit={e => handleSetState(confirmPhone(e, props, state))}
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  color="textPrimary"
                  className={classes.titleStyle}
                >
                  {t('phoneConfirm.welcomeMsg.primary')}
                </Typography>
                <Typography
                  className={classes.descStyle}
                  variant="body2"
                  color="textSecondary"
                  component="p"
                >
                  {t('phoneConfirm.welcomeMsg.secondary').replace(
                    '<>',
                    username,
                  )}
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box component="p" className={errors && classes.errorBox}>
                      {errors && (
                        <Box component="span" className={classes.error}>
                          {errors}
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <CustomButton
                      variant="contained"
                      size="large"
                      type="submit"
                      fullWidth
                      primaryButtonStyle
                      customButtonStyle
                    >
                      {t('phoneConfirm.inputs.submit')}
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

PhoneConfirm.propTypes = {
  auth: PropTypes.object.isRequired,
  sendPhoneConfirmation: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    sendPhoneConfirmation: args => {
      return dispatch(AuthActions.sendPhoneConfirmation(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PhoneConfirm);
