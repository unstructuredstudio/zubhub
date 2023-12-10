import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { makeStyles } from '@mui/styles';
import { Box, Container, Card, Typography } from '@mui/material';

import * as UserActions from '../../store/actions/userActions';
import LoadingPage from '../loading/LoadingPage';
import ErrorPage from '../error/ErrorPage';
import styles from '../../assets/js/styles/views/terms_of_use/termsOfUseStyles';

const useStyles = makeStyles(styles);

/**
 * @function TermsOfUse View
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function TermsOfUse(props) {
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
  } else if (Object.keys(privacy).length > 0 && privacy.terms_of_use) {
    return (
      <Box className={classes.root}>
        <Container className={classes.containerStyle}>
          <Card className={classes.cardStyle}>
            <Typography className={classes.termsOfUseHeadingStyle}>{t('termsOfUse.title')}</Typography>
            <Box
              className={classes.termsOfUseBodyStyle}
              dangerouslySetInnerHTML={{ __html: privacy.terms_of_use }}
            ></Box>
          </Card>
        </Container>
      </Box>
    );
  } else {
    return <ErrorPage error={t('termsOfUse.errors.page_empty')} />;
  }
}

TermsOfUse.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(TermsOfUse);
