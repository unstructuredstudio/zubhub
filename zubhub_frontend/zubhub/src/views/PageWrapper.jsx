import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { makeStyles } from "@material-ui/core/styles";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import {
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  useScrollTrigger,
  Box,
  Fab,
  Zoom,
  Menu,
  MenuItem,
  Avatar,
} from "@material-ui/core";

import CustomButton from "../components/button/Button.js";
import LoadingPage from "./loading/LoadingPage";
import { withAPI } from "../api";
import * as AuthActions from "../store/actions/authActions";
import unstructuredLogo from "../assets/images/logos/unstructured-logo.png";
import logo from "../assets/images/logos/logo.png";
import styles from "../assets/js/styles/views/page_wrapper/pageWrapperStyles";
import commonStyles from "../assets/js/styles";

function PageWrapper(props) {
  const classes = makeStyles(styles)();
  const commonClasses = makeStyles(commonStyles)();

  const [state, setState] = React.useState({
    username: null,
    anchorEl: null,
    loading: false,
  });

  React.useEffect(() => {
    if (props.auth.token) {
      setState({ ...state, loading: true });
      props.api
        .get_auth_user(props.auth.token)
        .then((res) => {
          if (!res.username) {
            throw new Error(
              "an error occured while getting user profile, please try again later"
            );
          }
          props.set_auth_user({
            ...props.auth,
            username: res.username,
            id: res.id,
          });
        })
        .catch((error) => toast.warning(error.message))
        .finally(() => {
          setState({ ...state, loading: false });
        });
    }
  }, [props.auth.token]);

  const logout = (e) => {
    e.preventDefault();
    props.api
      .logout(props.auth.token)
      .then((res) => {
        props.set_auth_user({ token: null, username: null, id: null });
      })
      .then((res) => {
        props.history.push("/");
      })
      .catch((error) => {
        toast.warning(
          "An error occured while signing you out. please try again"
        );
      });
  };

  const handleScrollTopClick = (e) => {
    const anchor = (e.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const scrollTop = (props) => {
    return (
      <Zoom in={useScrollTrigger}>
        <div
          onClick={handleScrollTopClick}
          role="presentation"
          className={classes.scrollTopButtonStyle}
        >
          <Fab color="secondary" size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </div>
      </Zoom>
    );
  };

  const handleProfileMenuOpen = (e) => {
    setState({ ...state, anchorEl: e.currentTarget });
  };

  const handleProfileMenuClose = () => {
    setState({ ...state, anchorEl: null });
  };

  let { anchorEl, loading } = state;
  let profileMenuOpen = Boolean(anchorEl);
  return (
    <>
      <ToastContainer />
      <CssBaseline />
      <AppBar className={classes.navBarStyle}>
        <Container className={classes.mainContainerStyle}>
          <Toolbar>
            <Box className={classes.logoStyle}>
              <Link to="/">
                <img src={logo} alt="logo" />
              </Link>
            </Box>
            <div className={classes.navActionStyle}>
              {!props.auth.token ? (
                <>
                  <Link className={classes.textDecorationNone} to="/login">
                    <CustomButton
                      variant="outlined"
                      size="large"
                      secondaryButtonStyle
                    >
                      Login
                    </CustomButton>
                  </Link>
                  <Link className={classes.textDecorationNone} to="/signup">
                    <CustomButton
                      variant="contained"
                      size="large"
                      primaryButtonStyle
                      className={commonClasses.marginLeft1em}
                    >
                      Sign Up
                    </CustomButton>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    className={classes.textDecorationNone}
                    to="/projects/create"
                  >
                    <CustomButton
                      className={commonClasses.marginLeft1em}
                      variant="contained"
                      primaryButtonStyle
                      size="small"
                    >
                      Create Project
                    </CustomButton>
                  </Link>
                  <Avatar
                    className={classes.avatarStyle}
                    aria-label={`${props.auth.username}' Avatar`}
                    aria-controls="profile_menu"
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    src={`https://robohash.org/${props.auth.username}`}
                    alt={props.auth.username}
                  />
                  <Menu
                    className={classes.profileMenuStyle}
                    id="profile_menu"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={profileMenuOpen}
                    onClose={handleProfileMenuClose}
                  >
                    <MenuItem className={classes.profileStyle}>
                      <a className={classes.textDecorationNone} href="/profile">
                        <Typography
                          variant="subtitle2"
                          color="textPrimary"
                          component="span"
                        >
                          {props.auth.username}
                        </Typography>
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        className={classes.textDecorationNone}
                        to="/projects/saved"
                      >
                        <Typography
                          variant="subtitle2"
                          color="textPrimary"
                          component="span"
                        >
                          Saved Projects
                        </Typography>
                      </Link>
                    </MenuItem>
                    <MenuItem className={classes.logOutStyle}>
                      <Typography
                        className={classes.textDecorationNone}
                        onClick={logout}
                      >
                        <Typography
                          variant="subtitle2"
                          color="textPrimary"
                          component="span"
                        >
                          Logout
                        </Typography>
                      </Typography>
                    </MenuItem>
                  </Menu>
                </>
              )}
            </div>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar id="back-to-top-anchor" />

      {loading ? <LoadingPage /> : props.children}

      <footer className="footer-distributed" style={{ flexShrink: 0 }}>
        <div className="footer-right"></div>

        <div className="footer-left"></div>
        <a href="https://unstructured.studio">
          <img
            src={unstructuredLogo}
            className={classes.footerLogoStyle}
            alt="unstructured-studio-logo"
          />
        </a>
        {scrollTop(props)}
      </footer>
    </>
  );
}

PageWrapper.propTypes = {
  auth: PropTypes.object.isRequired,
  api: PropTypes.object.isRequired,
  set_auth_user: PropTypes.func.isRequired,
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
)(withAPI(PageWrapper));
