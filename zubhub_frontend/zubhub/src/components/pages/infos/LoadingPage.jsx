import React, { Component } from "react";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";

const styles = (theme) => ({
  root: {
    paddingBottom: "2em",
    display: "flex",
    flex: "1 0 auto",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,204,0,1)",
    background:
      "-moz-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)",
    background:
      "-webkit-gradient(left top, left bottom, color-stop(0%, rgba(255,204,0,1)), color-stop(25%, rgba(255,229,133,1)), color-stop(61%, rgba(255,255,255,1)), color-stop(100%, rgba(255,255,255,1)))",
    background:
      "-webkit-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)",
    background:
      "-o-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)",
    background:
      "-ms-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)",
    background:
      "linear-gradient(to bottom, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)",
    filter:
      "progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffcc00', endColorstr='#ffffff', GradientType=0 )",
    "& .MuiGrid-root.MuiGrid-container": {
      width: "100%",
    },
  },
  mainContainerStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "2000px",
    width: "100%",
  },
  circularProgressStyle: {
    color: "#00B8C4",
  },
});

class LoadingPage extends Component {
  render() {
    let { classes } = this.props;
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
}

LoadingPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoadingPage);
