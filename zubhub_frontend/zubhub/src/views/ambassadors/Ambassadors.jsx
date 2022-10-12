import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Container, Card, Typography } from '@material-ui/core';

import * as UserActions from '../../store/actions/userActions';
import LoadingPage from '../loading/LoadingPage';
import ErrorPage from '../error/ErrorPage';

import styles from '../../assets/js/styles/views/ambassadors/ambassadorsStyles';
const useStyles = makeStyles(styles);

/**
 * @function Ambassadors View
 * @author Srishti Sethi <srishti@unstructured.studio>
 *
 * @todo - describe function's signature
 */
function Ambassadors(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    loading: true,
    ambassadors: {},
  });

  React.useEffect(() => {
    handleSetState(props.getAmbassadors({ t: props.t }));
  }, []);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { loading, ambassadors } = state;
  const { t } = props;

  if (loading) {
    return <LoadingPage />;
  } else if (Object.keys(ambassadors).length > 0 && ambassadors.ambassadors) {
    return (
      <Box className={classes.root}>
        <Container className={classes.containerStyle}>
          <Card className={classes.cardStyle}>
            <Typography className={classes.ambassadorsHeadingStyle}>
              Ambassadors
            </Typography>
            <Box
              className={classes.ambassadorsBodyStyle}
              dangerouslySetInnerHTML={{ __html: ambassadors.ambassadors }}
            ></Box>
          </Card>
        </Container>
      </Box>
    );
  } else {
    return <ErrorPage error={t('ambassadors.errors.page_empty')} />;
  }
}

Ambassadors.propTypes = {
  auth: PropTypes.object.isRequired,
  getAmbassadors: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAmbassadors: args => {
      return dispatch(UserActions.getAmbassadors(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Ambassadors);
