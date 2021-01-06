import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Container, Box, CircularProgress } from "@material-ui/core";
import styles from "../../assets/js/styles/views/loading/loadingPageStyles";

function LoadingPage() {
  const classes = makeStyles(styles)();
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
