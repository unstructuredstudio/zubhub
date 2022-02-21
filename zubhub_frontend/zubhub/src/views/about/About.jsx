import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Container, Card, Typography } from '@material-ui/core';

import * as UserActions from '../../store/actions/userActions';
import LoadingPage from '../loading/LoadingPage';
import ErrorPage from '../error/ErrorPage';
import styles from '../../assets/js/styles/views/about/aboutStyles';

const useStyles = makeStyles(styles);

/**
* @function About View
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
function About(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    loading: true,
    help: {},
  });

  React.useEffect(() => {
    handleSetState(props.getHelp({ t: props.t }));
  }, []);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { loading, help } = state;
  const { t } = props;

  if (loading) {
    return <LoadingPage />;
  } else if (Object.keys(help).length > 0 && help.about) {
    return (
      <Box className={classes.root}>
        <Container className={classes.containerStyle}>
          <Card className={classes.cardStyle}>
            <Typography className={classes.aboutHeadingStyle}>
              {t('about.title')}
            </Typography>
            <Box
              className={classes.aboutBodyStyle}
              dangerouslySetInnerHTML={{ __html: help.about }}
            ></Box>
          </Card>
        </Container>
      </Box>
    );
  } else {
    return <ErrorPage error={t('about.errors.page_empty')} />;
  }
}

About.propTypes = {
  auth: PropTypes.object.isRequired,
  getHelp: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getHelp: args => {
      return dispatch(UserActions.getHelp(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
