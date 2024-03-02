import React from 'react';

import { makeStyles } from '@mui/styles';
import { Container, Box, CircularProgress } from '@mui/material';
import styles from '../../assets/js/styles/views/loading/loadingPageStyles';

const useStyles = makeStyles(styles);

/**
 * @function LoadingPage
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function LoadingPage() {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Container className={classes.mainContainerStyle}>
        <CircularProgress
          className={classes.circularProgressStyle}
          size={70}
          thickness={6}
        />
      </Container>
    </Box>
  );
}

export default LoadingPage;
