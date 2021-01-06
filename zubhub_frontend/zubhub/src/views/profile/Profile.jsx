import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { connect } from "react-redux";

import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import ShareIcon from "@material-ui/icons/Share";
import {
  Tooltip,
  Badge,
  Avatar,
  Grid,
  Box,
  Container,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Typography,
  OutlinedInput,
  InputLabel,
  FormControl,
  Divider,
} from "@material-ui/core";

import CustomButton from "../../components/button/Button";
import * as AuthActions from "../../store/actions/authActions";
import ErrorPage from "../error/ErrorPage";
import LoadingPage from "../loading/LoadingPage";
import Project from "../../components/project/Project";
import styles from "../../assets/js/styles/views/profile/profileStyles";

function Profile(props) {
  const classes = makeStyles(styles)();

  const [state, setState] = React.useState({
    projects: [],
    openEditProfileModal: false,
    loading: true,
  });

  const [profile, setProfile] = React.useState({});

  React.useEffect(() => {
    get_user_profile();
  }, []);

  const get_user_profile = () => {
    let username = props.match.params.username;

    if (!username) {
      username = props.auth.username;
    } else if (props.auth.username === username) props.history.push("/profile");
    props.api
      .get_user_profile({ username, token: props.auth.token })
      .then((res) => {
        if (!res.username) {
          throw new Error(
            "an error occured while fetching user profile, please try again later"
          );
        } else {
          setProfile(res);
          return props.api.get_user_projects({
            username: res.username,
            limit: 4,
          });
        }
      })
      .then((res) => {
        if (Array.isArray(res.results)) {
          return setState({ ...state, projects: res.results, loading: false });
        } else {
          res = Object.keys(res)
            .map((key) => res[key])
            .join("\n");
          throw new Error(res);
        }
      })
      .catch((error) => {
        toast.warning(error.message);
        setState({ ...state, loading: false });
      });
  };

  const toggle_follow = (id) => {
    if (!props.auth.token) {
      props.history.push("/login");
    } else {
      props.api
        .toggle_follow({ id, token: props.auth.token })
        .then((res) => {
          if (res.id) {
            return setProfile(res);
          } else {
            res = Object.keys(res)
              .map((key) => res[key])
              .join("\n");
            throw new Error(res);
          }
        })
        .catch((error) => {
          setState({ ...state, loading: false });
          if (error.message.startsWith("Unexpected")) {
            toast.warning(
              "An error occured while performing this action. Please try again later"
            );
          } else {
            toast.warning(error.message);
          }
        });
    }
  };

  const handleToggleEditProfileModal = () => {
    let { openEditProfileModal } = state;
    openEditProfileModal = !openEditProfileModal;
    setState({ ...state, openEditProfileModal });
  };

  const copyProfileUrl = (e) => {
    let tempInput = document.createElement("textarea");
    tempInput.value = `${document.location.origin}/creators/${profile.username}`;
    tempInput.style.top = "0";
    tempInput.style.top = "0";
    tempInput.style.position = "fixed";
    let rootElem = document.querySelector("#root");
    rootElem.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    if (document.execCommand("copy")) {
      toast.success(
        "your profile url has been successfully copied to your clipboard!"
      );
      rootElem.removeChild(tempInput);
    }
  };

  const updateProfile = (e) => {
    e.preventDefault();
    let username = document.querySelector("#new_username");
    if (username.value) {
      props.api
        .edit_user_profile({
          token: props.auth.token,
          username: username.value,
        })
        .then((res) => {
          if (res.username) {
            setProfile(res);
            props.set_auth_user({
              ...props.auth,
              username: res.username,
            });
            handleToggleEditProfileModal();
            username.value = "";
          } else {
            throw new Error(
              "An error occured while updating your profile, please try again later"
            );
          }
        })
        .catch((error) => toast.warning(error.message));
    } else {
      handleToggleEditProfileModal();
    }
  };

  const updateProjects = (res) => {
    res
      .then((res) => {
        if (res.id) {
          let { projects } = state;
          projects = projects.map((project) =>
            project.id === res.id ? res : project
          );
          return setState({ ...state, projects });
        } else {
          res = Object.keys(res)
            .map((key) => res[key])
            .join("\n");
          throw new Error(res);
        }
      })
      .catch((error) => {
        setState({ ...state, loading: false });
        toast.warning(error.message);
      });
  };

  let { projects, loading, openEditProfileModal } = state;

  if (loading) {
    return <LoadingPage />;
  } else if (profile && Object.keys(profile).length > 0) {
    return (
      <>
        <Box className={classes.root}>
          <Paper className={classes.profileHeaderStyle}>
            <Container maxWidth="md">
              {props.auth.username === profile.username ? (
                <CustomButton
                  className={classes.floatRight}
                  variant="contained"
                  margin="normal"
                  primaryButtonStyle
                  onClick={handleToggleEditProfileModal}
                >
                  Edit
                </CustomButton>
              ) : (
                <CustomButton
                  className={classes.floatRight}
                  variant="outlined"
                  margin="normal"
                  secondaryButtonStyle
                  onClick={(e, id = profile.id) => toggle_follow(id)}
                >
                  {profile.followers.includes(props.auth.id)
                    ? "Unfollow"
                    : "Follow"}
                </CustomButton>
              )}
              <Box className={classes.avatarBoxStyle}>
                <Badge
                  overlap="circle"
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  badgeContent={
                    props.auth.id === profile.id ? (
                      <Tooltip
                        title="Share your profile with friends!"
                        placement="right-start"
                        arrow
                      >
                        <Fab
                          className={clsx(
                            classes.secondaryButton,
                            classes.profileShareButtonStyle
                          )}
                          aria-label="share profile url"
                          onClick={copyProfileUrl}
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
                {props.auth.username === profile.username ? (
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
                      {profile.projects_count} Projects
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
                      {profile.followers.length} Followers
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
                About Me
              </Typography>
              <Box className={classes.aboutMeBoxStyle}>
                {profile.bio
                  ? profile.bio
                  : "You will be able to change this next month 😀!"}
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
                  Latest projects of {profile.username}
                  <Link
                    className={clsx(
                      classes.secondaryLink,
                      classes.floatRight,
                      classes.textDecorationNone
                    )}
                    to={`/creators/${profile.username}/projects`}
                  >
                    View all >>
                  </Link>
                </Typography>
                <Grid container>
                  {Array.isArray(projects) &&
                    projects.map((project) => (
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
                          updateProjects={updateProjects}
                          {...props}
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
          onClose={handleToggleEditProfileModal}
          aria-labelledby="edit user profile"
        >
          <DialogTitle id="edit-user-profile">Edit User Profile</DialogTitle>
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
                New Username
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
            <CustomButton
              variant="outlined"
              onClick={handleToggleEditProfileModal}
              color="primary"
              secondaryButtonStyle
            >
              Cancel
            </CustomButton>
            <CustomButton
              variant="contained"
              onClick={updateProfile}
              primaryButtonStyle
            >
              Save
            </CustomButton>
          </DialogActions>
        </Dialog>
      </>
    );
  } else {
    return (
      <ErrorPage error="An error occured while fetching profile, please try again later" />
    );
  }
}

Profile.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
