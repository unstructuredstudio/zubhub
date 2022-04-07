import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import { Box, Container, Typography } from '@material-ui/core';

import CustomButton from '../../components/button/Button';
import * as AuthActions from '../../store/actions/authActions';
import LoadingPage from '../loading/LoadingPage';

import styles from '../../assets/js/styles/views/account_status/accountStatusStyles';
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

/**
 * @function AccountStatus View
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function AccountStatus(props) {
  const classes = useStyles();
  const common_classes = useCommonStyles();

  const [state, setState] = React.useState({
    message: '',
    loading: true,
  });

  React.useEffect(() => {
    props
      .AccountStatus({ token: props.auth.token, t: props.t })
      .then(res => {
        if (res.detail) {
          handleSetState({ message: res.detail });
        }
      })
      .finally(() => {
        handleSetState({ loading: false });
      });
  }, [props.auth.token]);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { message, loading } = state;

  const { t } = props;

  if (loading) {
    return <LoadingPage />;
  } else {
    return (
      <Box className={classes.rootStyle}>
        <Container className={classes.mainContainerStyle}>
          <Box className={classes.messageBoxStyle}>
            <Typography className={classes.messageStyle} variant="h3">
              {message}
            </Typography>
            <Typography className={classes.messageStyle} variant="h6">
              {t('accountStatus.contactAdmin')}
            </Typography>
            <CustomButton
              className={common_classes.marginTop1em}
              variant="contained"
              margin="normal"
              primaryButtonStyle
              onClick={() => props.history.push('/')}
            >
              {t('accountStatus.backToHome')}
            </CustomButton>
          </Box>
        </Container>
      </Box>
    );
  }
}

AccountStatus.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    AccountStatus: args => {
      return dispatch(AuthActions.AccountStatus(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountStatus);
