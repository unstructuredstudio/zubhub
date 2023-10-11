import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { makeStyles } from '@material-ui/core/styles';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {
  Grid,
  Box,
  ButtonGroup,
  Typography,
  Container,
  Card,
  CardContent,
  Avatar
} from '@material-ui/core';

import { fetchPage, updateProjects, followTeam, fetchTeam } from './teamScripts';

import * as ProjectActions from '../../store/actions/projectActions';
import * as UserActions from '../../store/actions/userActions';
import CustomButton from '../../components/button/Button';
import ErrorPage from '../error/ErrorPage';
import LoadingPage from '../loading/LoadingPage';
import Project from '../../components/project/Project';
import styles from '../../assets/js/styles/views/user_projects/userProjectsStyles';

const useStyles = makeStyles(styles);

/**
 * @function UserProjects View
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function TeamProjects(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    teams: [],
    prev_page: null,
    next_page: null,
    loading: true,
  });

  const [uteam, setUTeam] = React.useState({
    uteams: [],
  });
  // const [teams, setTeams] = useState([])
  React.useEffect(() => {
    handleSetState(fetchPage(null, props));
    handleSetTeam(fetchTeam(null, props));
  }, []);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };
  const handleSetTeam = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { results: teams, prev_page, next_page, loading } = state;
  const { results: uteams } = state;
  const { t } = props;
  const {groupname} = useParams();
  const username=groupname;
  if (loading) {
    return <LoadingPage />;
  } else if (teams && teams.length > 0) {
    return (
      <Box className={classes.root}>
        <Container className={classes.mainContainerStyle}>
          <Grid container>
            <Grid item xs={12}>
              <Typography
                className={classes.pageHeaderStyle}
                variant="h3"
                gutterBottom
              >
                {t('profile.allTeams')}
              </Typography>
            </Grid>
            <Grid container spacing={2}>
            {teams.slice(0, 4).map(team => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    className={classes.projectGridStyle}
                    align="center"
                  > 
                    <Card>
                    <CardContent className={classes.mediaBoxStyle}>
                    <Link
                      to={`/teams/${team.groupname}`}
                      className={classes.linkStyle}
                      // Add an event handler to prevent the link from being triggered by the button
                      onClick={event => {
                        if (
                          event.target.classList.contains(classes.editButton) ||
                          event.target.closest(`.${classes.editButton}`)
                        ) {
                          // Prevent the link from being triggered when clicking the button
                          event.preventDefault();
                        }
                      }}
                    >
                      {/* <CardContent className={classes.mediaBoxStyle}> */}
                        <Avatar
                          className={classes.creatorAvatarStyle}
                          src={team.avatar}
                          alt={team.groupname}
                        />
                        <Typography variant="h4">{team.groupname}</Typography>
                        <Typography variant="body1">{team.description}</Typography>
                        </Link>
                        <CustomButton
                            className={classes.editButton}
                            variant="contained"
                            margin="normal"
                            primaryButtonStyle
                            onClick={() =>followTeam(team.groupname, props.auth.username, props)}
                          >
                            {team.members.includes(props.auth.id)
                              ? t('profile.unfollow')
                              : t('profile.follow')}
                          </CustomButton>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
          </Grid>
          <div>
            <Link to="/teams/all">See All</Link>
          </div>
          <Grid container>
            <Grid item xs={12}>
              <Typography
                className={classes.pageHeaderStyle}
                variant="h3"
                gutterBottom
              >
                {props.auth.username}'s {t('profile.teams')}
              </Typography>
            </Grid>
            <Grid container spacing={2}>
            {uteams.map(team => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    className={classes.projectGridStyle}
                    align="center"
                  > 
                    <Card>
                    <CardContent className={classes.mediaBoxStyle}>
                    <Link
                      to={`/teams/${team.groupname}`}
                      className={classes.linkStyle}
                      // Add an event handler to prevent the link from being triggered by the button
                      onClick={event => {
                        if (
                          event.target.classList.contains(classes.editButton) ||
                          event.target.closest(`.${classes.editButton}`)
                        ) {
                          // Prevent the link from being triggered when clicking the button
                          event.preventDefault();
                        }
                      }}
                    >
                      {/* <CardContent className={classes.mediaBoxStyle}> */}
                        <Avatar
                          className={classes.creatorAvatarStyle}
                          src={team.avatar}
                          alt={team.groupname}
                        />
                        <Typography variant="h4">{team.groupname}</Typography>
                        <Typography variant="body1">{team.description}</Typography>
                        </Link>
                        <CustomButton
                            className={classes.followButton}
                            variant="outlined"
                            margin="normal"
                            secondaryButtonStyle
                            onClick={() =>followTeam(team.groupname, props.auth.username, props)}
                          >
                            {team.members.includes(props.auth.id)
                              ? t('profile.unfollow')
                              : t('profile.follow')}
                          </CustomButton>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
          </Grid>
          <ButtonGroup
            aria-label={t('userProjects.ariaLabels.prevNxtButtons')}
            className={classes.buttonGroupStyle}
          >
            {prev_page ? (
              <CustomButton
                className={classes.floatLeft}
                size="large"
                startIcon={<NavigateBeforeIcon />}
                onClick={(e, page = prev_page.split('?')[1]) =>
                  handleSetState(fetchPage(page, props))
                }
                primaryButtonStyle
              >
                {t('userProjects.prev')}
              </CustomButton>
            ) : null}
            {next_page ? (
              <CustomButton
                className={classes.floatRight}
                size="large"
                endIcon={<NavigateNextIcon />}
                onClick={(e, page = next_page.split('?')[1]) =>
                  handleSetState(fetchPage(page, props))
                }
                primaryButtonStyle
              >
                {t('userProjects.next')}
              </CustomButton>
            ) : null}
          </ButtonGroup>
        </Container>
      </Box>
    );
  } else {
    return <ErrorPage error={t('userProjects.errors.noUserProjects')} />;
  }
}

TeamProjects.propTypes = {
  auth: PropTypes.object.isRequired,
  getTeamProfile: PropTypes.func.isRequired,
  getUserTeams: PropTypes.func.isRequired,
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
    getTeamProfile: args => {
      return dispatch(UserActions.getAllTeams(args));
    },
    getUserTeams: args => {
      return dispatch(UserActions.getUserTeams(args));
    },
    toggleLike: args => {
      return dispatch(ProjectActions.toggleLike(args));
    },
    toggleSave: args => {
      return dispatch(ProjectActions.toggleSave(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamProjects);
