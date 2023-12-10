import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import 'react-toastify/dist/ReactToastify.css';

import { makeStyles } from '@mui/styles';
import { Grid, Box, Container, Card, CardActionArea, CardContent, Typography } from '@mui/material';

import * as UserActions from '../../store/actions/userActions';
import CustomButton from '../../components/button/Button';
import styles from '../../assets/js/styles/views/email_confirm/emailConfirmStyles';
import { getUsernameAndKey, confirmGroupInvite } from './groupInviteConfirmScripts';

const useStyles = makeStyles(styles);

/**
 * @function GroupInviteConfirm
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
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
                onSubmit={e => handleSetState(confirmGroupInvite(e, props, state))}
              >
                <Typography gutterBottom variant="h5" component="h2" color="textPrimary" className={classes.titleStyle}>
                  {t('groupInviteConfirm.welcomeMsg.primary')}
                </Typography>
                <Typography className={classes.descStyle} variant="body2" color="textSecondary" component="p">
                  {t('groupInviteConfirm.welcomeMsg.secondary').replace('<>', username)}
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
  sendGroupInviteConfirmation: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    sendGroupInviteConfirmation: args => {
      return dispatch(UserActions.sendGroupInviteConfirmation(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupInviteConfirm);
