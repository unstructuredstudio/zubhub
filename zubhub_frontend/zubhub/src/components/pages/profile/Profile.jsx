import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorPage from "../infos/ErrorPage";
import LoadingPage from "../infos/LoadingPage";
import { Link } from "react-router-dom";
import Project from "../projects/projects_components/Project";
import * as AuthActions from "../../../store/actions/authActions";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import clsx from "clsx";
import PropTypes from "prop-types";
import { withStyles, fade } from "@material-ui/core/styles";
import ShareIcon from "@material-ui/icons/Share";
import Tooltip from "@material-ui/core/Tooltip";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import Typography from "@material-ui/core/Typography";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import { Divider } from "@material-ui/core";

const styles = (theme) => ({
  root: {
    flex: "1 0 auto",
  },
  profileHeaderStyle: {
    paddingTop: "1.5em",
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
  },
  avatarBoxStyle: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  profileShareButtonStyle: {
    borderRadius: "50% !important",
  },
  avatarStyle: {
    width: "100%",
    height: "100%",
    paddingTop: "1.5em",
    paddingBottom: "1.5em",
    "& img": {
      width: "10em",
      backgroundColor: "white",
      height: "10em",
      borderRadius: "50%",
      boxShadow: `0 3px 5px 2px rgba(0, 0, 0, .12)`,
    },
  },
  ProfileDetailStyle: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  userNameStyle: {
    fontWeight: 900,
    fontSize: "2rem",
  },
  emailStyle: { marginBottom: "0.5em" },
  dividerStyle: {
    width: "100vw",
  },
  moreInfoBoxStyle: {
    height: "3em",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  moreInfoStyle: {
    marginLeft: "0.5em",
    marginRight: "0.5em",
    fontWeight: "bold",
    fontSize: "0.9rem",
    color: "#00B8C4",
  },
  profileLowerStyle: {
    margin: "1em",
    padding: "1em",
    paddingBottom: "4em",
  },
  titleStyle: {
    fontWeight: 900,
    fontSize: "1.5rem",
  },
  aboutMeBoxStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "7em",
    borderRadius: "15px",
    backgroundColor: "#E4E4E4",
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

  projectGridStyle: {
    marginBottom: "2em",
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
    backgroundColor: "#00B8C4",
    borderRadius: 15,
    color: "white",
    marginLeft: "1em",
    "&:hover": {
      backgroundColor: "#03848C",
    },
  },
  secondaryButton: {
    backgroundColor: "white",
    borderRadius: 15,
    borderColor: "#00B8C4",
    color: "#00B8C4",
    marginLeft: "1em",
    "&:hover": {
      color: "#03848C",
      borderColor: "#03848C",
      backgroundColor: "#F2F2F2",
    },
  },
  secondaryLink: {
    color: "#00B8C4",
    "&:hover": {
      color: "#03848C",
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
  floatRight: { float: "right" },
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

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {},
      projects: [],
      openEditProfileModal: false,
      loading: true,
    };
  }

  componentDidMount() {
    this.get_user_profile();
  }

  get_user_profile = () => {
    let username = this.props.match.params.username;

    if (!username) {
      username = this.props.auth.username;
    } else if (this.props.auth.username === username)
      this.props.history.push("/profile");
    this.props.api
      .get_user_profile({ username, token: this.props.auth.token })
      .then((res) => {
        if (!res.username) {
          throw new Error(
            this.props.t("profile.others.errors.profile_fetch_error")
          );
        }
        this.setState({ profile: res });
        return this.props.api.get_user_projects({
          username: res.username,
          limit: 4,
        });
      })
      .then((res) => {
        if (Array.isArray(res.results)) {
          return this.setState({ projects: res.results, loading: false });
        } else {
          res = Object.keys(res)
            .map((key) => res[key])
            .join("\n");
          throw new Error(res);
        }
      })
      .catch((error) => {
        toast.warning(error.message);
        this.setState({ loading: false });
      });
  };

  toggle_follow = (id) => {
    if (!this.props.auth.token) {
      this.props.history.push("/login");
    } else {
      this.props.api
        .toggle_follow({ id, token: this.props.auth.token })
        .then((res) => {
          if (res.id) {
            return this.setState({ profile: res });
          } else {
            res = Object.keys(res)
              .map((key) => res[key])
              .join("\n");
            throw new Error(res);
          }
        })
        .catch((error) => {
          this.setState({ loading: false });
          if (error.message.startsWith("Unexpected")) {
            toast.warning(this.props.t("profile.others.errors.unexpected"));
          } else {
            toast.warning(error.message);
          }
        });
    }
  };

  handleToggleEditProfileModal = () => {
    let { openEditProfileModal } = this.state;
    openEditProfileModal = !openEditProfileModal;
    this.setState({ openEditProfileModal });
  };

  copyProfileUrl = (e) => {
    let tempInput = document.createElement("textarea");
    tempInput.value = `${document.location.origin}/creators/${this.state.profile.username}`;
    tempInput.style.top = "0";
    tempInput.style.top = "0";
    tempInput.style.position = "fixed";
    let rootElem = document.querySelector("#root");
    rootElem.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    if (document.execCommand("copy")) {
      toast.success(this.props.t("profile.others.toast_success"));
      rootElem.removeChild(tempInput);
    }
  };

  updateProfile = (e) => {
    e.preventDefault();
    let username = document.querySelector("#new_username");
    this.props.api
      .edit_user_profile({
        token: this.props.auth.token,
        username: username.value,
      })
      .then((res) => {
        if (res.username) {
          this.setState({ profile: res });
          this.props.set_auth_user({
            ...this.props.auth,
            username: res.username,
          });
          this.handleToggleEditProfileModal();
          username.value = "";
        } else {
          throw new Error(
            this.props.t("profile.others.errors.profile_update_error")
          );
        }
      })
      .catch((error) => toast.warning(error.message));
  };

  setProfile = (value) => {};

  updateProjects = (res) => {
    res
      .then((res) => {
        if (res.id) {
          let { projects } = this.state;
          projects = projects.map((project) =>
            project.id === res.id ? res : project
          );
          return this.setState({ projects });
        } else {
          res = Object.keys(res)
            .map((key) => res[key])
            .join("\n");
          throw new Error(res);
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        toast.warning(error.message);
      });
  };

  render() {
    let { profile, projects, loading, openEditProfileModal } = this.state;
    let { classes, t } = this.props;

    if (loading) {
      return <LoadingPage />;
    } else if (Object.keys(profile).length > 0) {
      return (
        <>
          <Box className={classes.root}>
            <Paper className={classes.profileHeaderStyle}>
              <Container maxWidth="md">
                {this.props.auth.username === profile.username ? (
                  <Button
                    className={clsx(classes.primaryButton, classes.floatRight)}
                    variant="contained"
                    size="medium"
                    margin="normal"
                    onClick={this.handleToggleEditProfileModal}
                  >
                    {t("profile.edit.label")}
                  </Button>
                ) : (
                  <Button
                    className={clsx(
                      classes.secondaryButton,
                      classes.floatRight
                    )}
                    variant="outlined"
                    size="medium"
                    margin="normal"
                    onClick={(e, id = profile.id) => this.toggle_follow(id)}
                  >
                    {profile.followers.includes(this.props.auth.id)
                      ? t("profile.unfollow")
                      : t("profile.follow")}
                  </Button>
                )}
                <Box className={classes.avatarBoxStyle}>
                  <Badge
                    overlap="circle"
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    badgeContent={
                      this.props.auth.id === profile.id ? (
                        <Tooltip
                          title={t("profile.tooltips.share_profile")}
                          placement="right-start"
                          arrow
                        >
                          <Fab
                            className={clsx(
                              classes.secondaryButton,
                              classes.profileShareButtonStyle
                            )}
                            aria-label={t("profile.aria_labels.share_profile")}
                            onClick={this.copyProfileUrl}
                          >
                            <ShareIcon />
                          </Fab>
                        </Tooltip>
                      ) : null
                    }
                  >
                    <Avatar
                      className={classes.avatarStyle}
                      src={profile.avatar}
                      alt={profile.username}
                    />
                  </Badge>
                </Box>
                <Box className={classes.ProfileDetailStyle}>
                  <Typography
                    className={classes.userNameStyle}
                    component="h1"
                    color="textPrimary"
                  >
                    {profile.username}
                  </Typography>
                  {this.props.auth.username === profile.username ? (
                    <Typography className={classes.emailStyle} component="h5">
                      {profile.email}
                    </Typography>
                  ) : null}
                  <Divider className={classes.dividerStyle} />
                  <Box className={classes.moreInfoBoxStyle}>
                    <Link
                      className={classes.textDecorationNone}
                      to={`/creators/${profile.username}/projects`}
                    >
                      <Typography
                        className={classes.moreInfoStyle}
                        component="h5"
                      >
                        {profile.projects_count} {t("profile.projects_count")}
                      </Typography>
                    </Link>
                    <Link
                      to={`/creators/${profile.username}/followers`}
                      className={classes.textDecorationNone}
                    >
                      <Typography
                        className={classes.moreInfoStyle}
                        component="h5"
                      >
                        {profile.followers.length}{" "}
                        {t("profile.followers_count")}
                      </Typography>
                    </Link>
                  </Box>
                </Box>
              </Container>
            </Paper>

            <Container maxWidth="md">
              <Paper className={classes.profileLowerStyle}>
                <Typography
                  gutterBottom
                  component="h2"
                  variant="h6"
                  color="textPrimary"
                  className={classes.titleStyle}
                >
                  {t("profile.about.label")}
                </Typography>
                <Box className={classes.aboutMeBoxStyle}>
                  {profile.bio ? profile.bio : t("profile.about.placeholder")}
                </Box>
              </Paper>

              {profile.projects_count > 0 ? (
                <Paper className={classes.profileLowerStyle}>
                  <Typography
                    gutterBottom
                    component="h2"
                    variant="h6"
                    color="textPrimary"
                    className={classes.titleStyle}
                  >
                    {t("profile.projects.label")} {profile.username}
                    <Link
                      className={clsx(
                        classes.secondaryLink,
                        classes.floatRight,
                        classes.textDecorationNone
                      )}
                      to={`/creators/${profile.username}/projects`}
                    >
                      {t("profile.projects.view_all")}
                    </Link>
                  </Typography>
                  <Grid container>
                    {projects.map((project) => (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        className={classes.projectGridStyle}
                        align="center"
                      >
                        <Project
                          project={project}
                          key={project.id}
                          updateProjects={this.updateProjects}
                          {...this.props}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              ) : null}
            </Container>
          </Box>
          <Dialog
            open={openEditProfileModal}
            onClose={this.handleToggleEditProfileModal}
            aria-labelledby={t("profile.aria_labels.edit_profile")}
          >
            <DialogTitle id="edit-user-profile">
              {t("profile.edit.dialog.primary")}
            </DialogTitle>
            <DialogContent>
              <FormControl
                className={clsx(classes.margin, classes.textField)}
                variant="outlined"
                size="medium"
                fullWidth
                margin="normal"
              >
                <InputLabel
                  className={classes.customLabelStyle}
                  htmlFor="username"
                >
                  {t("profile.edit.dialog.username")}
                </InputLabel>
                <OutlinedInput
                  className={classes.customInputStyle}
                  id="new_username"
                  name="username"
                  type="text"
                  labelWidth={90}
                />
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                className={classes.secondaryButton}
                onClick={this.handleToggleEditProfileModal}
                color="primary"
              >
                {t("profile.edit.dialog.cancel")}
              </Button>
              <Button
                variant="contained"
                onClick={this.updateProfile}
                className={classes.primaryButton}
              >
                {t("profile.edit.dialog.save")}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      );
    } else {
      return (
        <ErrorPage error={t("profile.others.errors.profile_fetch_error")} />
      );
    }
  }
}

Profile.propTypes = {
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
)(withStyles(styles)(Profile));
