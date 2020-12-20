import React, { Component } from "react";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Typography, Container } from "@material-ui/core";
import disconnected from "../../../assets/images/disconnected-chains.svg";

const styles = (theme) => ({
  root: {
    paddingBottom: "2em",
    display: "flex",
    flex: "1 0 auto",
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
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("500")]: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
  },
  disconnectedStyle: {
    [theme.breakpoints.down("500")]: {
      height: "10em",
    },
  },
  errorBoxStyle: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    "& h1": {
      fontWeight: "bold",
    },
  },
});

class ErrorPage extends Component {
  render() {
    let { classes } = this.props;
    return (
      <Box className={classes.root}>
        <Container className={classes.mainContainerStyle}>
          <img
            className={classes.disconnectedStyle}
            src={disconnected}
            alt={this.props.error}
          />
          <Box className={classes.errorBoxStyle}>
            <Typography variant="h1">Oops!!</Typography>
            <Typography variant="h5">{this.props.error}</Typography>
          </Box>
        </Container>
      </Box>
    );
  }
}

ErrorPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ErrorPage);
