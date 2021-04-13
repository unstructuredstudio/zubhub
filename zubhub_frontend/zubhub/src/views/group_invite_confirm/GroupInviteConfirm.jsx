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

import * as UserActions from '../../store/actions/userActions';
import CustomButton from '../../components/button/Button';
import styles from '../../assets/js/styles/views/email_confirm/emailConfirmStyles';

const useStyles = makeStyles(styles);

const getUsernameAndKey = queryString => {
  let username = queryString.split('&&');
  const key = username[1].split('=')[1];
  username = username[0].split('=')[1];
  return { username, key };
};

const confirmGroupInvite = (e, props, state) => {
  e.preventDefault();
  return props
    .send_group_invite_confirmation({
      key: state.key,
      t: props.t,
      history: props.history,
    })
    .catch(error => {
      if (error.message.startsWith('Unexpected')) {
        return { errors: props.t('groupInviteConfirm.errors.unexpected') };
      } else {
        return { errors: error.message };
      }
    });
};

function GroupInviteConfirm(props) {
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
        setState({ ...state, ...obj });
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
                onSubmit={e =>
                  handleSetState(confirmGroupInvite(e, props, state))
                }
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  color="textPrimary"
                  className={classes.titleStyle}
                >
                  {t('groupInviteConfirm.welcomeMsg.primary')}
                </Typography>
                <Typography
                  className={classes.descStyle}
                  variant="body2"
                  color="textSecondary"
                  component="p"
                >
                  {t('groupInviteConfirm.welcomeMsg.secondary').replace(
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
                      {t('groupInviteConfirm.inputs.submit')}
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

GroupInviteConfirm.propTypes = {
  auth: PropTypes.object.isRequired,
  send_group_invite_confirmation: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    send_group_invite_confirmation: args => {
      return dispatch(UserActions.send_group_invite_confirmation(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupInviteConfirm);
