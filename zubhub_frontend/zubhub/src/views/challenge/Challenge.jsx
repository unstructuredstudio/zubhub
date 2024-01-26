import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { makeStyles } from '@mui/styles';
import { Box, Container, Card, Typography } from '@mui/material';

import * as UserActions from '../../store/actions/userActions';
import LoadingPage from '../loading/LoadingPage';
import ErrorPage from '../error/ErrorPage';
import styles from '../../assets/js/styles/views/challenge/challengeStyles';

const useStyles = makeStyles(styles);

/**
 * @function Challenge View
 * @author Suchakra Sharma <suchakra@unstructured.stdio>
 *
 * @todo - describe function's signature
 */
function Challenge(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    loading: true,
    challenge: {},
  });

  React.useEffect(() => {
    handleSetState(props.getChallenge({ t: props.t }));
  }, []);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { loading, challenge } = state;
  const { t } = props;

  if (loading) {
    return <LoadingPage />;
  } else if (Object.keys(challenge).length > 0 && challenge.challenge) {
    return (
      <Box className={classes.root}>
        <Container className={classes.containerStyle}>
          <Card className={classes.cardStyle}>
            <Box
              className={classes.challengeBodyStyle}
              dangerouslySetInnerHTML={{ __html: challenge.challenge }}
            ></Box>
          </Card>
        </Container>
      </Box>
    );
  } else {
    return <ErrorPage error={t('challenge.errors.page_empty')} />;
  }
}

Challenge.propTypes = {
  auth: PropTypes.object.isRequired,
  getChallenge: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getChallenge: args => {
      return dispatch(UserActions.getChallenge(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Challenge);
