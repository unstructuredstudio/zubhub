import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Container } from '@material-ui/core';

import styles from '../../assets/js/styles/views/error/errorPageStyles';
import CustomButton from '../../components/button/Button';
import { Link } from 'react-router-dom';

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
    <Box className={classes.root} style={propStyle ? propStyle : null}>
      <Container className={classes.mainContainerStyle}>
        <img className={classes.disconnectedStyle} src={props.imgSrc} alt={props.error} />
        <Box className={classes.errorBoxStyle}>
          <Typography variant="h3">{props.errorTitle}</Typography>
          <Typography variant="h5">
            {props.error}
          </Typography>
          {props.children}
        </Box>
        <Link to={props.routeLink}>
          <CustomButton
            variant="outlined"
            size="large"
            secondaryButtonStyle
            customButtonStyle
          >
            {props.routeTitle}
          </CustomButton>
        </Link>
      </Container>
    </Box>
  );
}

ErrorPage.propTypes = {
  routeLink: PropTypes.string.isRequired,
  routeTitle: PropTypes.string.isRequired,
  errorTitle: PropTypes.string,
  error: PropTypes.string.isRequired,
  imgSrc: PropTypes.string,
};

export default ErrorPage;
