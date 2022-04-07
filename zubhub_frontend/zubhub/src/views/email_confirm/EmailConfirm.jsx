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

import { getUsernameAndKey, confirmEmail } from './emailConfirmScripts';

import * as AuthActions from '../../store/actions/authActions';
import CustomButton from '../../components/button/Button';
import styles from '../../assets/js/styles/views/email_confirm/emailConfirmStyles';

const useStyles = makeStyles(styles);

/**
 * @function EmailConfirm View
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function EmailConfirm(props) {
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
  const { t } = props;

  return (
    <Box className={classes.root}>
      <Container className={classes.containerStyle}>
        <Card className={classes.cardStyle}>
          <CardActionArea>
            <CardContent>
              <form
                className="auth-form"
                name="email_confirm"
                noValidate="noValidate"
                onSubmit={e => handleSetState(confirmEmail(e, props, state))}
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  color="textPrimary"
                  className={classes.titleStyle}
                >
                  {t('emailConfirm.welcomeMsg.primary')}
                </Typography>
                <Typography
                  className={classes.descStyle}
                  variant="body2"
                  color="textSecondary"
                  component="p"
                >
                  {t('emailConfirm.welcomeMsg.secondary').replace(
                    '<>',
                    username,
                  )}
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
                    <CustomButton
                      variant="contained"
                      size="large"
                      type="submit"
                      fullWidth
                      primaryButtonStyle
                      customButtonStyle
                    >
                      {t('emailConfirm.inputs.submit')}
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

EmailConfirm.propTypes = {
  auth: PropTypes.object.isRequired,
  sendEmailConfirmation: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    sendEmailConfirmation: args => {
      return dispatch(AuthActions.sendEmailConfirmation(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailConfirm);
