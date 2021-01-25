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

import * as AuthActions from '../../store/actions/authActions';
import CustomButton from '../../components/button/Button';
import styles from '../../assets/js/styles/views/email_confirm/emailConfirmStyles';

const useStyles = makeStyles(styles);

const getUsernameAndKey = queryString => {
  let username = queryString.split('&&');
  const key = username[1].split('=')[1];
  username = username[0].split('=')[1];
  return { username, key };
};

const confirmEmail = (e, props, state) => {
  e.preventDefault();
  return props.send_email_confirmation(props, state.key).catch(error => {
    if (error.message.startsWith('Unexpected')) {
      return {
        error:
          'An error occured while performing this action. Please try again later',
      };
    } else {
      return { error: error.message };
    }
  });
};

function EmailConfirm(props) {
  const classes = useStyles();

  let { username, key } = getUsernameAndKey(props.location.search);

  const [state, setState] = React.useState({
    error: null,
    username: username ?? null,
    key: key ?? null,
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState({ ...state, ...obj });
      });
    }
  };

  const { error } = state;
  username = state.username;

  return (
    <Box className={classes.root}>
      <Container maxWidth="sm">
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
                  Email Confirmation
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Please Confirm that you are {username} and that the email
                  belongs to you:
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box
                      component="p"
                      className={error !== null && classes.errorBox}
                    >
                      {error !== null && (
                        <Box component="span" className={classes.error}>
                          {error}
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
                    >
                      Confirm
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
  send_email_confirmation: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    send_email_confirmation: (props, key) => {
      return dispatch(AuthActions.send_email_confirmation(props, key));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailConfirm);
