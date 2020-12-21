import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { withAPI } from "./api";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as AuthActions from "../store/actions/authActions";
import unstructuredLogo from "../assets/images/logos/unstructured-logo.png";
import logo from "../assets/images/logos/logo.png";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Box from "@material-ui/core/Box";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Zoom from "@material-ui/core/Zoom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";

const styles = (theme) => ({
  navBarStyle: {
    backgroundColor: "#DC3545",
  },
  mainContainerStyle: {
    maxWidth: "2000px",
  },
  logoStyle: {
    flexGrow: 1,
    "& img": {
      height: "2em",
    },
    [theme.breakpoints.down("376")]: {
      "& img": {
        height: "1em",
      },
    },
  },
  footerLogoStyle: {
    height: "5em",
    [theme.breakpoints.down("376")]: {
      height: "3em",
    },
    [theme.breakpoints.down("230")]: {
      height: "2em",
    },
  },

  avatarStyle: {
    cursor: "pointer",
    backgroundColor: "white",
  },
  profileMenuStyle: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  profileStyle: { backgroundColor: "#F5F5F5" },
  logOutStyle: {
    borderTop: "1px solid #C4C4C4",
  },
  scrollTopButtonStyle: {
    zIndex: 100,
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  primaryButtonStyle: {
    marginLeft: "1em",
    backgroundColor: "#00B8C4",
    borderRadius: 15,
    color: "white",
    "&:hover": {
      backgroundColor: "#03848C",
    },
  },
  secondaryButtonStyle: {
    borderRadius: 15,
    backgroundColor: "white",
    color: "#00B8C4",
    "&:hover": {
      color: "#03848C",
      backgroundColor: "rgba(255,255,255,0.8)",
    },
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
});

class PageWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      anchorEl: null,
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
            id: res.id,
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
        this.props.set_auth_user({ token: null, username: null, id: null });
      })
      .then((res) => {
        this.props.history.push("/");
      })
      .catch((error) => {
        toast.warning(
          "An error occured while signing you out. please try again"
        );
      });
  };

  handleScrollTopClick = (e) => {
    const anchor = (e.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  scrollTop = (props) => {
    const { classes } = props;

    return (
      <Zoom in={useScrollTrigger}>
        <div
          onClick={this.handleScrollTopClick}
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

  handleProfileMenuOpen = (e) => {
    this.setState({ anchorEl: e.currentTarget });
  };

  handleProfileMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    let { anchorEl } = this.state;
    let { classes } = this.props;
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
              <div className="">
                {!this.props.auth.token ? (
                  <>
                    <Link className={classes.textDecorationNone} to="/login">
                      <Button
                        variant="outlined"
                        size="large"
                        className={classes.secondaryButtonStyle}
                      >
                        Login
                      </Button>
                    </Link>
                    <Link className={classes.textDecorationNone} to="/signup">
                      <Button
                        variant="contained"
                        size="large"
                        className={classes.primaryButtonStyle}
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Avatar
                      className={classes.avatarStyle}
                      aria-label={`${this.props.auth.username}' Avatar`}
                      aria-controls="profile_menu"
                      aria-haspopup="true"
                      onClick={this.handleProfileMenuOpen}
                      src={`https://robohash.org/${this.props.auth.username}`}
                      alt={this.props.auth.username}
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
                      onClose={this.handleProfileMenuClose}
                    >
                      <MenuItem className={classes.profileStyle}>
                        <Link
                          className={classes.textDecorationNone}
                          to="/profile"
                        >
                          <Typography
                            variant="subtitle2"
                            color="textPrimary"
                            component="span"
                          >
                            {this.props.auth.username}
                          </Typography>
                        </Link>
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
                          onClick={this.logout}
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

        {this.props.children}

        <footer className="footer-distributed" style={{ flexShrink: 0 }}>
          <div className="footer-right"></div>

          <div className="footer-left"></div>
          <img
            src={unstructuredLogo}
            className={classes.footerLogoStyle}
            alt="unstructured-studio-logo"
          />
          {this.scrollTop(this.props)}
        </footer>
      </>
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
