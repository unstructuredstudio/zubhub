import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { withAPI } from "./api";
// import { AuthUserContext } from '../components/session';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as AuthActions from "../store/actions/authActions";
import unstructuredLogo from "../assets/images/logos/unstructured-logo.png";
import logo from "../assets/images/logos/logo.png";

import clsx from "clsx";
import PropTypes from "prop-types";
import { withStyles, fade } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import * as Yup from "yup";

const styles = (theme) => ({
  root: {
    flex: "1 0 auto",
    zIndex: "100",
  },
  cardStyle: {
    border: 0,
    borderRadius: 15,
    boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .12)",
    color: "white",
    padding: "0 30px",
  },
  customLabelStyle: {
    "&.MuiFormLabel-root.Mui-focused": {
      color: "#00B8C4",
    },
  },

  customInputStyle: {
    borderRadius: 15,
    "&.MuiOutlinedInput-notchedOutline": {
      border: "1px solid #00B8C4",
      boxShadow: `${fade("#00B8C4", 0.25)} 0 0 0 0.2rem`,
    },
    "&.MuiOutlinedInput-root": {
      "&:hover fieldset": {
        border: "1px solid #00B8C4",
        boxShadow: `${fade("#00B8C4", 0.25)} 0 0 0 0.2rem`,
      },
      "&.Mui-focused fieldset": {
        border: "1px solid #00B8C4",
        boxShadow: `${fade("#00B8C4", 0.25)} 0 0 0 0.2rem`,
      },
    },
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#00B8C4",
    borderRadius: 15,
    color: "white",
    "&:hover": {
      backgroundColor: "#03848C",
    },
  },
  secondaryButton: {
    width: "100%",
    borderRadius: 15,
    borderColor: "#00B8C4",
    color: "#00B8C4",
    "&:hover": {
      color: "#03848C",
      borderColor: "#03848C",
    },
  },
  imageUploadButton: {
    display: "flex",
    justifyContent: "flex-start",
  },
  uploadProgressLabelStyle: {
    color: "white",
  },
  uploadProgressStyle: {
    color: "#00B8C4",
  },
  customChipStyle: {
    border: "1px solid #00B8C4",
    color: "#00B8C4",
    margin: "0.5em",
  },
  materialsUsedViewStyle: {
    padding: "0.5em",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  textDecorationNone: {
    textDecoration: "none",
  },
  displayNone: { display: "none" },
  largeLabel: {
    fontSize: "1.3rem",
  },
  errorBox: {
    width: "100%",
    padding: "1em",
    borderRadius: 6,
    borderWidth: "1px",
    borderColor: "#a94442",
    backgroundColor: "#ffcdd2",
  },
  error: {
    color: "#a94442",
  },
});

class PageWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
    };
  }

  componentDidMount() {
    if (this.props.auth.token) {
      this.props.api
        .get_auth_user(this.props.auth.token)
        .then((res) => {
          if (!res.username) {
            throw new Error(
              "an error occured while getting user profile, please try again later"
            );
          }
          this.props.set_auth_user({
            ...this.props.auth,
            username: res.username,
          });
        })
        .catch((error) => toast.warning(error.message));
    }
  }

  logout = (e) => {
    e.preventDefault();
    this.props.api
      .logout(this.props.auth.token)
      .then((res) => {
        this.props.set_auth_user({ token: null, username: null });
      })
      .then((res) => {
        this.props.history.push("/");
      })
      .catch((error) => {
        console.log(error);
        toast.warning(
          "An error occured while signing you out. please try again"
        );
      });
  };

  render() {
    let { classes } = this.props;
    return (
      <Box className={classes.root}>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <ToastContainer />
        <header className="App-header">
          <Link to="/">
            <img src={logo} className="App-logo" alt="logo" />
          </Link>
          <div className="float-right">
            {!this.props.auth.token ? (
              <>
                <Link className="btn btn-success" to="/login">
                  Sign In
                </Link>
                <Link className="btn btn-primary" to="/signup">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile">
                  <img
                    src={`https://robohash.org/${this.props.auth.username}`}
                    className="profile_image"
                    aria-label="creator profile"
                  />
                </Link>
                <Link className="btn btn-danger" onClick={this.logout}>
                  Logout
                </Link>
              </>
            )}
          </div>
        </header>

        {this.props.children}

        <footer className="footer-distributed" style={{ flexShrink: 0 }}>
          <div className="footer-right"></div>

          <div className="footer-left"></div>
          <img
            src={unstructuredLogo}
            className="footer-logo"
            alt="unstructured-studio-logo"
          />
        </footer>
      </Box>
    );
  }
}

PageWrapper.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    set_auth_user: (auth_user) => {
      dispatch(AuthActions.setAuthUser(auth_user));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAPI(withStyles(styles)(PageWrapper)));
