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

import {
  getUserProfile,
  copyProfileUrl,
  updateProjects,
  toggleFollow,
  handleMoreMenuOpen,
  handleMoreMenuClose,
  handleToggleDeleteAccountModal,
  deleteAccount,
} from './profileScripts';

import CustomButton from '../../components/button/Button';
import * as AuthActions from '../../store/actions/authActions';
import * as UserActions from '../../store/actions/userActions';
import * as ProjectActions from '../../store/actions/projectActions';
import ErrorPage from '../error/ErrorPage';
import LoadingPage from '../loading/LoadingPage';
import Project from '../../components/project/Project';
import ProjectsDraftsGrid from '../../components/projects_drafts/ProjectsDraftsGrid'
import Comments from '../../components/comments/Comments';

import {
  parseComments,
} from '../../assets/js/utils/scripts';

import styles from '../../assets/js/styles/views/profile/profileStyles';
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);


/**
* @function Profile View
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
function Profile(props) {
  const username_el = React.useRef(null);
  const classes = useStyles();
  const common_classes = useCommonStyles();

  const [state, setState] = React.useState({
    results: [],
    loading: true,
    profile: {},
    open_delete_account_modal: false,
    dialog_error: null,
    more_anchor_el: null,
  });

  React.useEffect(() => {
    Promise.resolve(getUserProfile(props)).then(obj => {
      if (obj.profile) {
        parseComments(obj.profile.comments);
      }
      handleSetState(obj);
    });
  }, []);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const {
    results: projects,
    profile,
    loading,
    open_delete_account_modal,
    dialog_error,
    more_anchor_el,
  } = state;

  const more_menu_open = Boolean(more_anchor_el);
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
                    anchorEl={more_anchor_el}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={more_menu_open}
                    onClose={e => handleSetState(handleMoreMenuClose(e))}
                  >
                    <MenuItem>
                      <Typography
                        variant="subtitle2"
                        className={common_classes.colorRed}
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
                    handleSetState(toggleFollow(profile.id, props))
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
                          onClick={() => copyProfileUrl(profile, props, toast)}
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

                  {profile.role !== 'creator' ? (
                    <Typography className={classes.roleStyle}>
                      {profile.role}
                    </Typography>
                  ) : null}
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
                  {profile.members_count !== null ? (
                    <Link
                      to={`/creators/${profile.username}/members`}
                      className={classes.textDecorationNone}
                    >
                      <Typography
                        className={classes.moreInfoStyle}
                        component="h5"
                      >
                        {profile.members_count} {t('profile.membersCount')}
                      </Typography>
                    </Link>
                  ) : null}
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
                {!profile.members_count
                  ? t('profile.about.label1')
                  : t('profile.about.label2')}
              </Typography>
              {profile.bio
                ? profile.bio
                : !profile.members_count
                ? t('profile.about.placeholder1')
                : t('profile.about.placeholder2')}
            </Paper>

            {profile.projects_count > 0 ? (
              <ProjectsDraftsGrid
                props={props}
                state={state}
                profile={profile}
                projects={projects}
              />
            ) : null}
            <Comments
              context={{ name: 'profile', body: profile }}
              handleSetState={handleSetState}
              {...props}
            />
          </Container>
        </Box>
        <Dialog
          open={open_delete_account_modal}
          onClose={() => handleSetState(handleToggleDeleteAccountModal(state))}
          aria-labelledby={t('profile.delete.ariaLabels.deleteAccount')}
        >
          <DialogTitle id="delete-project">
            {t('profile.delete.dialog.primary')}
          </DialogTitle>
          <Box
            component="p"
            className={dialog_error !== null && classes.errorBox}
          >
            {dialog_error !== null && (
              <Box component="span" className={classes.error}>
                {dialog_error}
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
                ref={username_el}
                name="username"
                type="text"
                labelWidth={120}
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
                handleSetState(deleteAccount(username_el, props, state))
              }
              dangerButtonStyle
              customButtonStyle
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
  setAuthUser: PropTypes.func.isRequired,
  getUserProfile: PropTypes.func.isRequired,
  suggestCreators: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  toggleFollow: PropTypes.func.isRequired,
  toggleLike: PropTypes.func.isRequired,
  toggleSave: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setAuthUser: auth_user => {
      dispatch(AuthActions.setAuthUser(auth_user));
    },
    getUserProfile: args => {
      return dispatch(UserActions.getUserProfile(args));
    },
    suggestCreators: args => {
      return dispatch(UserActions.suggestCreators(args));
    },
    addComment: args => {
      return dispatch(UserActions.addComment(args));
    },
    unpublishComment: args => {
      return dispatch(ProjectActions.unpublishComment(args));
    },
    deleteComment: args => {
      return dispatch(ProjectActions.deleteComment(args));
    },
    deleteAccount: args => {
      return dispatch(AuthActions.deleteAccount(args));
    },
    logout: args => {
      return dispatch(AuthActions.logout(args));
    },
    toggleFollow: args => {
      return dispatch(UserActions.toggleFollow(args));
    },
    toggleLike: args => {
      return dispatch(ProjectActions.toggleLike(args));
    },
    toggleSave: args => {
      return dispatch(ProjectActions.toggleSave(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
