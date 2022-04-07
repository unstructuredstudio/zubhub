import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import 'react-toastify/dist/ReactToastify.css';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Container, Card, Typography } from '@material-ui/core';

import * as UserActions from '../../store/actions/userActions';
import LoadingPage from '../loading/LoadingPage';
import ErrorPage from '../error/ErrorPage';
import styles from '../../assets/js/styles/views/guidelines/guidelinesStyles';

const useStyles = makeStyles(styles);

/**
 * @function Guidelines View
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function Guidelines(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    loading: true,
    privacy: {},
  });

  React.useEffect(() => {
    handleSetState(props.getPrivacy({ t: props.t }));
  }, []);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { loading, privacy } = state;
  const { t } = props;

  if (loading) {
    return <LoadingPage />;
  } else if (Object.keys(privacy).length > 0 && privacy.privacy_policy) {
    return (
      <Box className={classes.root}>
        <Container className={classes.containerStyle}>
          <Card className={classes.cardStyle}>
            <Typography className={classes.guidelinesHeadingStyle}>
              {t('guidelines.title')}
            </Typography>
            <Box
              className={classes.guidelinesBodyStyle}
              dangerouslySetInnerHTML={{
                __html: privacy.privacy_policy,
              }}
            ></Box>
          </Card>
        </Container>
      </Box>
    );
  } else {
    return <ErrorPage error={t('guidelines.errors.page_empty')} />;
  }
}

Guidelines.propTypes = {
  auth: PropTypes.object.isRequired,
  getPrivacy: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getPrivacy: args => {
      return dispatch(UserActions.getPrivacy(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Guidelines);
