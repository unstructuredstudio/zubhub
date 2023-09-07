import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';

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
  Link,
  Avatar
} from '@material-ui/core';

import { fetchPage, updateProjects, followTeam } from './allteamScripts';

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
  // const [teams, setTeams] = useState([])
  React.useEffect(() => {
    handleSetState(fetchPage(null, props));
  }, []);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { results: teams, prev_page, next_page, loading } = state;
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
                {t('All Teams')}
              </Typography>
            </Grid>
            <Grid container spacing={2}>
                {teams.map(team => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    className={classes.projectGridStyle}
                    align="center"
                  > 
                    <Link to={`/teams/${team.groupname}`} className={classes.textDecorationNone}>
                    <Card>
                      <CardContent className={classes.mediaBoxStyle}>
                        <Avatar
                          className={classes.creatorAvatarStyle}
                          src={team.avatar}
                          alt={team.groupname}
                        />
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
                          className={classes.editButton}
                          variant="contained"
                          margin="normal"
                          primaryButtonStyle
                          onClick={() => followTeam(team.groupname, props.auth.username, props)}
                        >
                          {team.members.includes(props.auth.id) ? t('profile.unfollow') : t('profile.follow')}
                        </CustomButton>
                      </CardContent>
                    </Card>
                  </Link>
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
    return <ErrorPage error={t('userProjects.errors.noTeams')} />;
  }
}

TeamProjects.propTypes = {
  auth: PropTypes.object.isRequired,
  getTeamProfile: PropTypes.func.isRequired,
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
    toggleLike: args => {
      return dispatch(ProjectActions.toggleLike(args));
    },
    toggleSave: args => {
      return dispatch(ProjectActions.toggleSave(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamProjects);
