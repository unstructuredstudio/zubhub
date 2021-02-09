import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';

import { toast } from 'react-toastify';

import { makeStyles } from '@material-ui/core/styles';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
  Tooltip,
  Badge,
  Avatar,
  Grid,
  Box,
  Container,
  Paper,
  Menu,
  MenuItem,
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
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

const getUserPofile = props => {
  let username = props.match.params.username;

  if (!username) {
    username = props.auth.username;
  } else if (props.auth.username === username) props.history.push('/profile');
  return props.get_user_profile({
    username,
    token: props.auth.token,
    t: props.t,
  });
};

const copyProfileUrl = ({ profile, props }) => {
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
    toast.success(props.t('profile.toastSuccess'));
    rootElem.removeChild(tempInput);
  }
};

const updateProjects = (res, { results: projects }, props) => {
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
      if (error.message.startsWith('Unexpected')) {
        toast.warning(props.t('profile.errors.unexpected'));
      } else {
        toast.warning(error.message);
      }
      return { loading: false };
    });
};

const toggle_follow = (id, props) => {
  if (!props.auth.token) {
    props.history.push('/login');
  } else {
    return props.toggle_follow({ id, token: props.auth.token, t: props.t });
  }
};

const handleMoreMenuOpen = e => {
  return { moreAnchorEl: e.currentTarget };
};

const handleMoreMenuClose = () => {
  return { moreAnchorEl: null };
};

const handleToggleDeleteAccountModal = state => {
  const openDeleteAccountModal = !state.openDeleteAccountModal;
  return { openDeleteAccountModal, moreAnchorEl: null };
};

const deleteAccount = (usernameEl, props) => {
  if (usernameEl.current.firstChild.value !== props.auth.username) {
    return { dialogError: props.t('profile.delete.errors.incorrectUsernme') };
  } else {
    return props.delete_account({
      token: props.auth.token,
      history: props.history,
      logout: props.logout,
      t: props.t,
    });
  }
};

function Profile(props) {
  const usernameEl = React.useRef(null);
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const [state, setState] = React.useState({
    results: [],
    loading: true,
    profile: {},
    openDeleteAccountModal: false,
    dialogError: null,
    moreAnchorEl: null,
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
    openDeleteAccountModal,
    dialogError,
    moreAnchorEl,
  } = state;

  const moreMenuOpen = Boolean(moreAnchorEl);
  const { t } = props;

  if (loading) {
    return <LoadingPage />;
  } else if (profile && Object.keys(profile).length > 0) {
    return (
      <>
        <Box className={classes.root}>
          <Paper className={classes.profileHeaderStyle}>
            <Container maxWidth="md">
              {props.auth.username === profile.username ? (
                <>
                  <CustomButton
                    className={classes.floatRight}
                    onClick={e => handleSetState(handleMoreMenuOpen(e))}
                  >
                    <MoreVertIcon />
                  </CustomButton>
                  <CustomButton
                    className={classes.floatRight}
                    variant="contained"
                    margin="normal"
                    primaryButtonStyle
                    onClick={() => props.history.push('/edit-profile')}
                  >
                    {t('profile.edit')}
                  </CustomButton>
                  <Menu
                    className={classes.moreMenuStyle}
                    id="profile_menu"
                    anchorEl={moreAnchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={moreMenuOpen}
                    onClose={e => handleSetState(handleMoreMenuClose(e))}
                  >
                    <MenuItem>
                      <Typography
                        variant="subtitle2"
                        className={commonClasses.colorRed}
                        component="span"
                        onClick={() =>
                          handleSetState(handleToggleDeleteAccountModal(state))
                        }
                      >
                        {t('profile.delete.label')}
                      </Typography>
                    </MenuItem>
                  </Menu>
                </>
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
                    ? t('profile.unfollow')
                    : t('profile.follow')}
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
                        title={t('profile.tooltips.shareProfile')}
                        placement="right-start"
                        arrow
                      >
                        <Fab
                          className={clsx(
                            classes.secondaryButton,
                            classes.profileShareButtonStyle,
                          )}
                          aria-label={t('profile.ariaLabels.shareProfile')}
                          onClick={() => copyProfileUrl({ profile, props })}
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
                  <>
                    <Typography className={classes.emailStyle} component="h5">
                      {profile.email}
                    </Typography>
                    <Typography className={classes.emailStyle} component="h5">
                      {profile.phone}
                    </Typography>
                  </>
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
                      {profile.projects_count} {t('profile.projectsCount')}
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
                      {profile.followers.length} {t('profile.followersCount')}
                    </Typography>
                  </Link>
                  <Link
                    to={`/creators/${profile.username}/following`}
                    className={classes.textDecorationNone}
                  >
                    <Typography
                      className={classes.moreInfoStyle}
                      component="h5"
                    >
                      {profile.following_count} {t('profile.followingCount')}
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
                {t('profile.about.label')}
              </Typography>
              <Box className={classes.aboutMeBoxStyle}>
                {profile.bio ? profile.bio : t('profile.about.placeholder')}
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
                  {t('profile.projects.label')} {profile.username}
                  <Link
                    className={clsx(
                      classes.secondaryLink,
                      classes.floatRight,
                      classes.textDecorationNone,
                    )}
                    to={`/creators/${profile.username}/projects`}
                  >
                    {t('profile.projects.viewAll')}
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
                            handleSetState(updateProjects(res, state, props))
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
          open={openDeleteAccountModal}
          onClose={() => handleSetState(handleToggleDeleteAccountModal(state))}
          aria-labelledby={t('profile.delete.ariaLabels.deleteAccount')}
        >
          <DialogTitle id="delete-project">
            {t('profile.delete.dialog.primary')}
          </DialogTitle>
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
            <Typography>{t('profile.delete.dialog.secondary')}</Typography>
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
                {t('profile.delete.dialog.inputs.username')}
              </InputLabel>
              <OutlinedInput
                className={classes.customInputStyle}
                ref={usernameEl}
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
                handleSetState(handleToggleDeleteAccountModal(state))
              }
              color="primary"
              secondaryButtonStyle
            >
              {t('profile.delete.dialog.cancel')}
            </CustomButton>
            <CustomButton
              variant="contained"
              onClick={e =>
                handleSetState(deleteAccount(usernameEl, props, state))
              }
              dangerButtonStyle
            >
              {t('profile.delete.dialog.procceed')}
            </CustomButton>
          </DialogActions>
        </Dialog>
      </>
    );
  } else {
    return <ErrorPage error={t('profile.errors.profileFetchError')} />;
  }
}

Profile.propTypes = {
  auth: PropTypes.object.isRequired,
  set_auth_user: PropTypes.func.isRequired,
  get_user_profile: PropTypes.func.isRequired,
  delete_account: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
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
    get_user_profile: args => {
      return dispatch(UserActions.get_user_profile(args));
    },
    delete_account: args => {
      return dispatch(AuthActions.delete_account(args));
    },
    logout: args => {
      return dispatch(AuthActions.logout(args));
    },
    toggle_follow: args => {
      return dispatch(UserActions.toggle_follow(args));
    },
    toggle_like: args => {
      return dispatch(ProjectActions.toggle_like(args));
    },
    toggle_save: args => {
      return dispatch(ProjectActions.toggle_save(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
