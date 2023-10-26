import React, {useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api'

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
  getTeamProfile,
  copyProfileUrl,
  updateProjects,
  toggleFollow,
  sortTags,
  handleMoreMenuOpen,
  handleMoreMenuClose,
  handleToggleDeleteAccountModal,
  deleteAccount,
  fetchPage,
  followTeam,
} from './teamScripts';
import GroupsIcon from '@material-ui/icons/Group';
import CustomButton from '../../components/button/Button';
import * as AuthActions from '../../store/actions/authActions';
import * as UserActions from '../../store/actions/userActions';
import * as ProjectActions from '../../store/actions/projectActions';
import ErrorPage from '../error/ErrorPage';
import LoadingPage from '../loading/LoadingPage';
import Project from '../../components/project/Project';
import Comments from '../../components/comments/Comments';

import { parseComments, isBaseTag } from '../../assets/js/utils/scripts';

import styles from '../../assets/js/styles/views/profile/profileStyles';
import commonStyles from '../../assets/js/styles';
import ProjectsDraftsGrid from '../../components/projects_drafts/ProjectsDraftsGrid';
import UserActivitylog from '../../components/user_activitylog/UserActivitylog';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

/**
 * @function Profile View
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function Team(props) {
  const username_el = React.useRef(null);
  const classes = useStyles();
  const common_classes = useCommonStyles();
  const username = props.match.params.username || props.auth.username;
  const [page, setPage] = useState(1);
  const [userActivity, setUserActivity] = useState([])
  const [scrollPosition, setScrollPosition] = useState(0);
  const [nextPage, setNextPage] = useState(false)
  const { groupname } = useParams();
  const [state, setState] = React.useState({
    results: [],
    loading: true,
    profile: {},
    open_delete_account_modal: false,
    dialog_error: null,
    more_anchor_el: null,
    drafts: [],
    badge_tags: [],
  });
  const [followers,setFollowers]=React.useState([]);
  
  React.useEffect(() => {
  try{
    let activitylogObj= new API()
    const promises = [getTeamProfile(groupname, props), fetchPage(groupname, props)];
    if (username === props.auth.username) {
      promises.push(
        // ProjectActions.getUserDrafts({
        //   username,
        //   token: props.auth.token,
        //   t: props.t,
        //   limit: 4,
        // }),
      );
    }

    Promise.all(promises).then(values => {
      const obj = values[0];
      const followers = values[1];

      // if (obj.profile) {
      //   parseComments(obj.profile.comments);
      // }
      handleSetState({ ...obj });
      setFollowers(followers);
    });
  } catch (error) {
    console.log(error);
  }
  }, [page]);

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

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && nextPage) { 
            setPage(page => page + 1)
    }
 }

  if (loading) {
    return <LoadingPage />;
  } else if (profile && Object.keys(profile).length > 0) {
    return (
      <>
        <Box className={classes.root}>
          <Paper className={classes.profileHeaderStyle}>
            <Container maxWidth="md"
            style={{padding: '0 3em'}}
            >
              <Box className= {classes.flexClass}>
                <Box className={classes.avatarBoxStyle}>
                  <Avatar
                    className={classes.avatarStyle}
                    src={profile.avatar}
                    alt={profile.groupname}
                  />
                  {profile.members.some(member => member.member === props.auth.username && member.role === 'admin') ? (
                <>
                  <CustomButton
                    className={classes.editButton}
                    variant="contained"
                    margin="normal"
                    primaryButtonStyle
                    onClick={() => props.history.push('/'+groupname+'/edit-team')}
                  >
                    {t('editTeam.label')}
                  </CustomButton>
                </>
              ) : (
                <CustomButton
                  className={classes.followButton}
                  variant="outlined"
                  margin="normal"
                  secondaryButtonStyle
                  onClick={() =>
                    followTeam(groupname, props.auth.username, props)
                  }
                >
                  {followers.followerIds.includes(props.auth.id)
                    ? t('profile.unfollow')
                    : t('profile.follow')}
                </CustomButton>
              )}
                </Box>
                <Box className={classes.ProfileNameStyle}>
                  <Typography
                    className={classes.userNameStyle}
                    component="h1"
                    color="textPrimary"
                  >
                    {profile.groupname}
                  </Typography>
                  <Box className={classes.tagsContainerStyle}>
                    
                      <Typography
                        
                        className={classes.baseTagStyle}
                        component="h2"
                      >
                        Team  <GroupsIcon className={classes.iconWithSpace}/>
                      </Typography>
                    
                  </Box>
                  {groupname === profile.groupname ? (
                    <>
                      <Typography className={classes.emailStyle} component="h5">
                        {profile.email}
                      </Typography>
                      <Typography className={classes.emailStyle} component="h5">
                        {profile.phone}
                      </Typography>
                    </>
                  ) : null}
                </Box> 
                  <Box className={classes.moreInfoBoxStyle}>
                    <Link
                      className={classes.textDecorationNone}
                      to={`/teams/${profile.groupname}/projects`}
                    >
                      <Typography
                        className={classes.moreInfoStyle}
                        component="h5"
                      >
                        <div className={classes.moreInfoTitleStyle}>
                        {t('profile.projectsCount')}
                        </div>
                        <div className={classes.moreInfoCountStyle}>
                        {profile.projects_count}
                        </div>
                      </Typography>
                    </Link>
                    <Link
                      to={`/teams/${groupname}/followers`}
                      className={classes.textDecorationNone}
                    >
                      <Typography
                        className={classes.moreInfoStyle}
                        component="h5"
                      >
                        <div className={classes.moreInfoTitleStyle}>
                        {t('profile.followersCount')}
                        </div>
                        <div className={classes.moreInfoCountStyle}>
                        {profile.followers_count} 
                        </div>
                      </Typography>
                    </Link>
                    <Link
                      to={`/teams/${groupname}/members`}
                      className={classes.textDecorationNone}
                    >
                      <Typography
                        className={classes.moreInfoStyle}
                        component="h5"
                      >
                        <div className={classes.moreInfoTitleStyle}>
                        {t('profile.membersCount')}
                        </div>
                        <div className={classes.moreInfoCountStyle}>
                        {profile.members.length} 
                        </div>
                      </Typography>
                    </Link>
                  </Box>
              </Box> 
            </Container>
          </Paper>

            <div className= {classes.aboutMeBadgeBox}>
              <Paper className={classes.aboutMeBox}>
                <Typography
                  gutterBottom
                  component="h2"
                  variant="h6"
                  color="textPrimary"
                  className={classes.titleStyle}
                >
                  {!profile.members_count
                    ? t('About Us')
                    : t('profile.about.label2')}
                </Typography>
                {profile.description
                  ? profile.description
                  : !profile.members_count
                  ? t('profile.about.placeholder1')
                  : t('profile.about.placeholder2')}
              </Paper>
             
              {/* <Paper className={classes.badgeBox}>
                <Typography
                    gutterBottom
                    component="h2"
                    variant="h6"
                    color="textPrimary"
                    className={classes.badgeTitleStyle}
                  >
                    {t('profile.badge.badges')}
                  </Typography>
                  {!badge_tags.length > 0 ? (
                    t('profile.badge.addBadges')
                  ) : (
                    <Box className={classes.badgeContainerStyle}>
                      {badge_tags.map(tag => (
                        <Typography
                          key={tag}
                          className={clsx(classes.badgeStyle)}
                          component="h2"
                        >
                          {tag}
                        </Typography>
                      ))}
                    </Box>
                  )}
              </Paper> */}
            </div>

            {profile.projects_count > 0 ? (
              username === props.auth.username ? (
                <Paper className={classes.profileLowerStyle}>
                  <Typography
                    gutterBottom
                    component="h2"
                    variant="h6"
                    color="textPrimary"
                    className={classes.titleStyle}
                  >
                    {t('Projects')}
                    {/* <CustomButton
                      className={classes.teamButton}
                      variant="contained"
                      margin="normal"
                      primaryButtonStyle
                      onClick={() => props.history.push('/create-team')}
                    >
                      {t('Add Project')}
                    </CustomButton> */}
                    <CustomButton
                      className={clsx(classes.floatRight)}
                      variant="outlined"
                      margin="normal"
                      secondaryButtonStyle
                      onClick={() =>
                        props.history.push(
                          `/teams/${groupname}/projects`,
                        )
                      }
                    >
                      {t('profile.projects.viewAll')}
                    </CustomButton>
                  </Typography>
                  <Grid container>
                    {Array.isArray(profile.projects) &&
                      profile.projects.map(project => (
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
                              handleSetState(
                                updateProjects(res, state, props, toast),
                              )
                            }
                            {...props}
                          />
                        </Grid>
                      ))}
                  </Grid>
                </Paper>
              ) : null ): null}

            {/* <Comments
              context={{ name: 'profile', body: profile }}
              handleSetState={handleSetState}
              {...props}
            /> */}
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

Team.propTypes = {
  auth: PropTypes.object.isRequired,
  setAuthUser: PropTypes.func.isRequired,
  getTeamProfile: PropTypes.func.isRequired,
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
    getTeamProfile: args => {
      return dispatch(UserActions.getTeamProfile(args));
    },
    getTeamFollowers: args => {
      return dispatch(UserActions.getTeamFollowers(args));
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
    toggleTeamFollow: args => {
      return dispatch(UserActions.toggleTeamFollow(args));
    },
    toggleLike: args => {
      return dispatch(ProjectActions.toggleLike(args));
    },
    toggleSave: args => {
      return dispatch(ProjectActions.toggleSave(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Team);
