import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';

import { toast } from 'react-toastify';

import { makeStyles } from '@material-ui/core/styles';
import ShareIcon from '@material-ui/icons/Share';
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
} from '@material-ui/core';

import CustomButton from '../../components/button/Button';
import * as AuthActions from '../../store/actions/authActions';
import * as UserActions from '../../store/actions/userActions';
import * as ProjectActions from '../../store/actions/projectActions';
import ErrorPage from '../error/ErrorPage';
import LoadingPage from '../loading/LoadingPage';
import Project from '../../components/project/Project';
import styles from '../../assets/js/styles/views/profile/profileStyles';

const useStyles = makeStyles(styles);

const handleToggleEditProfileModal = ({ openEditProfileModal }) => {
  openEditProfileModal = !openEditProfileModal;
  return { openEditProfileModal };
};

const getUserPofile = props => {
  let username = props.match.params.username;

  if (!username) {
    username = props.auth.username;
  } else if (props.auth.username === username) props.history.push('/profile');
  return props.get_user_profile({ username, token: props.auth.token });
};

const updateProfile = (e, props, state, newUserNameEL) => {
  e.preventDefault();
  const username = newUserNameEL.current.firstChild;
  if (username.value) {
    return props
      .edit_user_profile({
        token: props.auth.token,
        username: username.value,
      })
      .then(res => {
        if (!res.id) {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
        username.value = '';
        return { ...res, ...handleToggleEditProfileModal(state) };
      })
      .catch(error => ({ dialogError: error.message }));
  } else {
    return handleToggleEditProfileModal(state);
  }
};

const copyProfileUrl = profile => {
  const tempInput = document.createElement('textarea');
  tempInput.value = `${document.location.origin}/creators/${profile.username}`;
  tempInput.style.top = '0';
  tempInput.style.top = '0';
  tempInput.style.position = 'fixed';
  const rootElem = document.querySelector('#root');
  rootElem.appendChild(tempInput);
  tempInput.focus();
  tempInput.select();
  if (document.execCommand('copy')) {
    toast.success(
      'your profile url has been successfully copied to your clipboard!',
    );
    rootElem.removeChild(tempInput);
  }
};

const updateProjects = (res, { results: projects }) => {
  return res
    .then(res => {
      if (res.project && res.project.title) {
        projects = projects.map(project =>
          project.id === res.project.id ? res.project : project,
        );
        return { results: projects };
      } else {
        res = Object.keys(res)
          .map(key => res[key])
          .join('\n');
        throw new Error(res);
      }
    })
    .catch(error => {
      toast.warning(error.message);
      return { loading: false };
    });
};

const toggle_follow = (id, props) => {
  if (!props.auth.token) {
    props.history.push('/login');
  } else {
    return props.toggle_follow({ id, token: props.auth.token });
  }
};

function Profile(props) {
  const newUserNameEL = React.useRef(null);
  const classes = useStyles();

  const [state, setState] = React.useState({
    results: [],
    openEditProfileModal: false,
    loading: true,
    profile: {},
    dialogError: null,
  });

  React.useEffect(() => {
    handleSetState(getUserPofile(props));
  }, []);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState({ ...state, ...obj });
      });
    }
  };

  const {
    results: projects,
    profile,
    loading,
    openEditProfileModal,
    dialogError,
  } = state;

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
                  onClick={() =>
                    handleSetState(handleToggleEditProfileModal(state))
                  }
                >
                  Edit
                </CustomButton>
              ) : (
                <CustomButton
                  className={classes.floatRight}
                  variant="outlined"
                  margin="normal"
                  secondaryButtonStyle
                  onClick={() =>
                    handleSetState(toggle_follow(profile.id, props))
                  }
                >
                  {profile.followers.includes(props.auth.id)
                    ? 'Unfollow'
                    : 'Follow'}
                </CustomButton>
              )}
              <Box className={classes.avatarBoxStyle}>
                <Badge
                  overlap="circle"
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
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
                            classes.profileShareButtonStyle,
                          )}
                          aria-label="share profile url"
                          onClick={() => copyProfileUrl(profile)}
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
                  : 'You will be able to change this next month 😀!'}
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
                      classes.textDecorationNone,
                    )}
                    to={`/creators/${profile.username}/projects`}
                  >
                    View all >>
                  </Link>
                </Typography>
                <Grid container>
                  {Array.isArray(projects) &&
                    projects.map(project => (
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
                          updateProjects={res =>
                            handleSetState(updateProjects(res, state))
                          }
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
          onClose={() => handleSetState(handleToggleEditProfileModal(state))}
          aria-labelledby="edit user profile"
        >
          <DialogTitle id="edit-user-profile">Edit User Profile</DialogTitle>
          <Box
            component="p"
            className={dialogError !== null && classes.errorBox}
          >
            {dialogError !== null && (
              <Box component="span" className={classes.error}>
                {dialogError}
              </Box>
            )}
          </Box>{' '}
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
                ref={newUserNameEL}
                name="username"
                type="text"
                labelWidth={90}
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <CustomButton
              variant="outlined"
              onClick={() =>
                handleSetState(handleToggleEditProfileModal(state))
              }
              color="primary"
              secondaryButtonStyle
            >
              Cancel
            </CustomButton>
            <CustomButton
              variant="contained"
              onClick={e =>
                handleSetState(updateProfile(e, props, state, newUserNameEL))
              }
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
  set_auth_user: PropTypes.func.isRequired,
  get_user_profile: PropTypes.func.isRequired,
  edit_user_profile: PropTypes.func.isRequired,
  toggle_follow: PropTypes.func.isRequired,
  toggle_like: PropTypes.func.isRequired,
  toggle_save: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    set_auth_user: auth_user => {
      dispatch(AuthActions.setAuthUser(auth_user));
    },
    get_user_profile: props => {
      return dispatch(UserActions.get_user_profile(props));
    },
    edit_user_profile: props => {
      return dispatch(UserActions.edit_user_profile(props));
    },
    toggle_follow: props => {
      return dispatch(UserActions.toggle_follow(props));
    },
    toggle_like: props => {
      return dispatch(ProjectActions.toggle_like(props));
    },
    toggle_save: props => {
      return dispatch(ProjectActions.toggle_save(props));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
