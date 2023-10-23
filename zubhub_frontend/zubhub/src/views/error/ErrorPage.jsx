import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx'

import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Container } from '@material-ui/core';

import disconnected from '../../assets/images/disconnected-chains.svg';
import styles from '../../assets/js/styles/views/error/errorPageStyles';

const useStyles = makeStyles(styles);

/**
 * @function ErrorPage
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function ErrorPage(props) {
  const classes = useStyles();
  const propStyle = props.style;
  return (
    <Box className={clsx([classes.root, props.styleOverrides.width])} style={propStyle ? propStyle : null}>
      <Container className={classes.mainContainerStyle}>
        <img className={classes.disconnectedStyle} src={disconnected} alt={props.error} />
        <Box className={classes.errorBoxStyle}>
          <Typography variant="h1">Oops!!</Typography>
          <Typography style={{ marginBottom: 50 }} variant="h5">
            {props.error}
          </Typography>
          {props.children}
        </Box>
      </Container>
    </Box>
  );
}

ErrorPage.propTypes = {
  error: PropTypes.string.isRequired,
};

export default ErrorPage;
