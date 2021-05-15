import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Container, Card, Typography } from '@material-ui/core';

import * as UserActions from '../../store/actions/userActions';
import LoadingPage from '../loading/LoadingPage';
import ErrorPage from '../error/ErrorPage';
import styles from '../../assets/js/styles/views/resources/resourcesStyles';

const useStyles = makeStyles(styles);

function Resources(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    loading: true,
    help: {},
  });

  React.useEffect(() => {
    handleSetState(props.get_help({ t: props.t }));
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
  } else if (Object.keys(help).length > 0 && help.resources) {
    return (
      <Box className={classes.root}>
        <Container className={classes.containerStyle}>
          <Card className={classes.cardStyle}>
            <Typography className={classes.resourcesHeadingStyle}>
              {t('resources.title')}
            </Typography>
            <Box
              className={classes.resourcesBodyStyle}
              dangerouslySetInnerHTML={{ __html: help.resources }}
            ></Box>
          </Card>
        </Container>
      </Box>
    );
  } else {
    return <ErrorPage error={t('resources.errors.page_empty')} />;
  }
}

Resources.propTypes = {
  auth: PropTypes.object.isRequired,
  get_help: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    get_help: args => {
      return dispatch(UserActions.get_help(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Resources);
