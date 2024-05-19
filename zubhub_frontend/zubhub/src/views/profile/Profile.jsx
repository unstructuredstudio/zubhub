import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';

import { toast } from 'react-toastify';

import { makeStyles } from '@mui/styles';
import {
  Avatar,
  Grid,
  Box,
  Container,
  Paper,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  OutlinedInput,
  InputLabel,
  FormControl,
} from '@mui/material';

import API from '../../api';
import { TEAM_ENABLED } from '../../utils.js';
import {
  getUserProfile,
  // copyProfileUrl,
  updateProjects,
  toggleFollow,
  sortTags,
  handleToggleDeleteAccountModal,
  deleteAccount,
  getUserTeams,
  followTeam,
} from './profileScripts';

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
function Profile(props) {
  const username_el = React.useRef(null);
  const classes = useStyles();
  const common_classes = useCommonStyles();
  const username = props.params.username || props.auth.username;
  const [page, setPage] = useState(1);
  const [userActivity, setUserActivity] = useState([]);
  const [nextPage, setNextPage] = useState(false);
  const [teams, setTeams] = useState([]);
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

  const handleSetTeams = newTeams => {
    newTeams && setTeams(teams => [...teams, ...newTeams]);
  };

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  React.useEffect(() => {
    try {
      const activitylogObj = new API();
      const promises = [getUserProfile(props), getUserTeams(props), activitylogObj.getUserActivity(username, page)];
      if (username === props.auth.username) {
        promises.push(
          ProjectActions.getUserDrafts({
            username,
            token: props.auth.token,
            t: props.t,
            limit: 4,
          }),
        );
      }

      Promise.all(promises).then(values => {
        const obj = values[0];
        const team = values[1].results;
        // setTeams(team);
        // setTeams(teams   => ([...teams, ...team]));
        handleSetTeams(team);
        const activity = values[2] || {};
        const drafts = values[3] || {};
        const badges = obj.profile?.badges;

        if (obj.profile) {
          parseComments(obj.profile.comments);
        }
        handleSetState({ ...obj, ...drafts, badge_tags: badges });
        setUserActivity(userActivity => [...userActivity, ...activity.results]);
        const nextPageExist = activity.next ? true : false;
        setNextPage(nextPageExist);
      });
    } catch (error) {
      console.log(error);
    }
  }, [page]);

  const { results: projects, profile, loading, open_delete_account_modal, dialog_error, drafts, badge_tags } = state;

  const { t } = props;

  const handleScroll = e => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && nextPage) {
      setPage(page => page + 1);
    }
  };

  if (loading) {
    return <LoadingPage />;
  } else if (profile && Object.keys(profile).length > 0) {
    return (
      <>
        <Box className={classes.root}>
          <Paper className={classes.profileHeaderStyle}>
            <Container maxWidth="md" style={{ padding: '0 3em' }}>
              <Box className={classes.flexClass}>
                <Box className={classes.avatarBoxStyle}>
                  <Avatar className={classes.avatarStyle} src={profile.avatar} alt={profile.username} />
                  {props.auth.username === profile.username ? (
                    <>
                      <CustomButton
                        className={classes.editButton}
                        variant="contained"
                        margin="normal"
                        primaryButtonStyle
                        onClick={() => props.navigate('/edit-profile')}
                      >
                        {t('profile.edit')}
                      </CustomButton>
                    </>
                  ) : (
                    <CustomButton
                      className={classes.followButton}
                      variant="outlined"
                      margin="normal"
                      secondaryButtonStyle
                      onClick={() => handleSetState(toggleFollow(profile.id, props))}
                    >
                      {profile.followers.includes(props.auth.id) ? t('profile.unfollow') : t('profile.follow')}
                    </CustomButton>
                  )}
                </Box>
                <Box className={classes.ProfileNameStyle}>
                  <Typography className={classes.userNameStyle} component="h1" color="textPrimary">
                    {profile.username}
                  </Typography>
                  <Box className={classes.tagsContainerStyle}>
                    {sortTags(profile.tags).map(tag => (
                      <Typography
                        key={tag}
                        className={clsx(common_classes.baseTagStyle, {
                          [common_classes.extendedTagStyle]: !isBaseTag(tag),
                        })}
                        component="h2"
                      >
                        {tag}
                      </Typography>
                    ))}
                  </Box>
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
                </Box>
                <Box className={classes.moreInfoBoxStyle}>
                  <Link className={classes.textDecorationNone} to={`/creators/${profile.username}/projects`}>
                    <Typography className={classes.moreInfoStyle} component="h5">
                      <div className={classes.moreInfoTitleStyle}>{t('profile.projectsCount')}</div>
                      <div className={classes.moreInfoCountStyle}>{profile.projects_count}</div>
                    </Typography>
                  </Link>
                  <Link to={`/creators/${profile.username}/followers`} className={classes.textDecorationNone}>
                    <Typography className={classes.moreInfoStyle} component="h5">
                      <div className={classes.moreInfoTitleStyle}>{t('profile.followersCount')}</div>
                      <div className={classes.moreInfoCountStyle}>{profile.followers.length}</div>
                    </Typography>
                  </Link>
                  <Link to={`/creators/${profile.username}/following`} className={classes.textDecorationNone}>
                    <Typography className={classes.moreInfoStyle} component="h5">
                      <div className={classes.moreInfoTitleStyle}>{t('profile.followingCount')}</div>
                      <div className={classes.moreInfoCountStyle}>{profile.following_count}</div>
                    </Typography>
                  </Link>
                  {profile.members_count !== null ? (
                    <Link to={`/creators/${profile.username}/members`} className={classes.textDecorationNone}>
                      <Typography className={classes.moreInfoStyle} component="h5">
                        <div className={classes.moreInfoTitleStyle}>{t('profile.membersCount')}</div>
                        <div className={classes.moreInfoCountStyle}>{profile.members_count}</div>
                      </Typography>
                    </Link>
                  ) : null}
                </Box>
              </Box>
            </Container>
          </Paper>

          <div className={classes.aboutMeBadgeBox}>
            <Paper className={classes.aboutMeBox}>
              <Typography gutterBottom component="h2" variant="h6" color="textPrimary" className={classes.titleStyle}>
                {!profile.members_count ? t('profile.about.label1') : t('profile.about.label2')}
              </Typography>
              {profile.bio
                ? profile.bio
                : !profile.members_count
                  ? t('profile.about.placeholder1')
                  : t('profile.about.placeholder2')}
            </Paper>

            <Paper className={classes.badgeBox}>
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
                    <Typography key={tag} className={clsx(classes.badgeStyle)} component="h2">
                      {tag}
                    </Typography>
                  ))}
                </Box>
              )}
            </Paper>
          </div>

          <Paper className={classes.profileLowerStyle}>
            <Typography gutterBottom component="h2" variant="h6" color="textPrimary" className={classes.titleStyle}>
              {t('profile.activityLog.activity')}
            </Typography>
            <div onScroll={handleScroll} style={{ maxHeight: '300px', overflow: 'auto' }}>
              {userActivity.map(activity => (
                <UserActivitylog activity={activity} key={activity.id} />
              ))}
            </div>
          </Paper>

          {TEAM_ENABLED === true ? (
            <Paper className={classes.profileLowerStyle}>
              <Typography gutterBottom component="h2" variant="h6" color="textPrimary" className={classes.titleStyle}>
                {t('Teams')}
                <CustomButton
                  className={classes.teamButton}
                  variant="contained"
                  margin="normal"
                  primaryButtonStyle
                  onClick={() => props.navigate('/create-team')}
                >
                  {t('profile.createteam')}
                </CustomButton>
              </Typography>
              <Grid container spacing={2}>
                {teams.map(team => (
                  <Grid key={team.id} item xs={12} sm={6} md={6} className={classes.projectGridStyle} align="center">
                    <Link to={`/teams/${team.groupname}`} className={classes.textDecorationNone}>
                      <Card>
                        <CardContent className={classes.mediaBoxStyle}>
                          <Avatar className={classes.creatorAvatarStyle} src={team.avatar} alt={team.groupname} />
                          <Typography className={classes.titleStyle} variant="h5" component="h2">
                            {team.groupname}
                          </Typography>
                          <Typography
                            className={classes.descriptionStyle}
                            variant="subtitle2"
                            color="textSecondary"
                            component="p"
                          >
                            {team.description}
                          </Typography>
                          <CustomButton
                            className={classes.followButton}
                            variant="outlined"
                            margin="normal"
                            secondaryButtonStyle
                            onClick={() => followTeam(team.groupname, props.auth.username, props)}
                            style={{
                              fontSize: '12px', // Adjust the font size as needed
                              padding: '6px 12px', // Adjust the padding to change the button size
                            }}
                          >
                            {team.members.includes(props.auth.id) ? t('profile.unfollow') : t('profile.follow')}
                          </CustomButton>
                        </CardContent>
                      </Card>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          ) : null}

          {profile.projects_count > 0 || drafts.length > 0 ? (
            username === props.auth.username ? (
              <ProjectsDraftsGrid
                profile={profile}
                projects={projects}
                drafts={drafts}
                handleSetState={handleSetState}
                {...props}
              />
            ) : (
              <Box style={{ borderRadius: 8, overflow: 'hidden' }}>
                <Typography gutterBottom component="h2" variant="h6" color="textPrimary" className={classes.titleStyle}>
                  {t('profile.projects.label')}
                  <CustomButton
                    className={clsx(classes.floatRight)}
                    variant="outlined"
                    margin="normal"
                    secondaryButtonStyle
                    onClick={() => props.navigate(`/creators/${profile.username}/projects`)}
                  >
                    {t('profile.projects.viewAll')}
                  </CustomButton>
                </Typography>
                <Grid container spacing={3}>
                  {Array.isArray(projects) &&
                    projects.map(project => (
                      <Grid
                        key={project.id}
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        className={classes.projectGridStyle}
                        align="center"
                      >
                        <Project
                          project={project}
                          key={project.id}
                          updateProjects={res => handleSetState(updateProjects(res, state, props, toast))}
                          {...props}
                        />
                      </Grid>
                    ))}
                </Grid>
              </Box>
            )
          ) : null}
          <Comments context={{ name: 'profile', body: profile }} handleSetState={handleSetState} {...props} />
        </Box>
        <Dialog
          open={open_delete_account_modal}
          onClose={() => handleSetState(handleToggleDeleteAccountModal(state))}
          aria-labelledby={t('profile.delete.ariaLabels.deleteAccount')}
        >
          <DialogTitle id="delete-project">{t('profile.delete.dialog.primary')}</DialogTitle>
          <Box component="p" className={dialog_error !== null && classes.errorBox}>
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
              <InputLabel className={classes.customLabelStyle} htmlFor="username">
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
              onClick={() => handleSetState(handleToggleDeleteAccountModal(state))}
              color="primary"
              secondaryButtonStyle
            >
              {t('profile.delete.dialog.cancel')}
            </CustomButton>
            <CustomButton
              variant="contained"
              onClick={() => handleSetState(deleteAccount(username_el, props, state))}
              dangerButtonStyle
              customButtonStyle
            >
              {t('profile.delete.dialog.proceed')}
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
  getUserTeams: PropTypes.func.isRequired,
  followTeam: PropTypes.func.isRequired,
  suggestCreators: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  toggleFollow: PropTypes.func.isRequired,
  toggleLike: PropTypes.func.isRequired,
  toggleSave: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  setAuthUser: auth_user => {
    dispatch(AuthActions.setAuthUser(auth_user));
  },
  getUserProfile: args => dispatch(UserActions.getUserProfile(args)),
  getUserTeams: args => dispatch(UserActions.getUserTeams(args)),
  toggleTeamFollow: args => dispatch(UserActions.toggleTeamFollow(args)),
  suggestCreators: args => dispatch(UserActions.suggestCreators(args)),
  addComment: args => dispatch(UserActions.addComment(args)),
  unpublishComment: args => dispatch(ProjectActions.unpublishComment(args)),
  deleteComment: args => dispatch(ProjectActions.deleteComment(args)),
  deleteAccount: args => dispatch(AuthActions.deleteAccount(args)),
  logout: args => dispatch(AuthActions.logout(args)),
  toggleFollow: args => dispatch(UserActions.toggleFollow(args)),
  toggleLike: args => dispatch(ProjectActions.toggleLike(args)),
  toggleSave: args => dispatch(ProjectActions.toggleSave(args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
