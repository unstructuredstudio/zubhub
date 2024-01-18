import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { toast } from 'react-toastify';

import { makeStyles } from '@material-ui/core/styles';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {
  Grid,
  Box,
  ButtonGroup,
  Button,
  Typography,
  Container,
  Card,
  Avatar,
} from '@material-ui/core';

import {
  getQueryParams,
  fetchPage,
  updateProjects,
  toggleFollow,
  SearchType,
} from './searchResultsScripts';

import * as ProjectActions from '../../store/actions/projectActions';
import * as CreatorActions from '../../store/actions/userActions';
import CustomButton from '../../components/button/Button';
import ErrorPage from '../error/ErrorPage';
import LoadingPage from '../loading/LoadingPage';
import Project from '../../components/project/Project';
import { styles, loginStyleOverrides, staffPickStyleOverrides } from '../../assets/js/styles/views/search_results/searchResultsStyles';
import commonStyles from '../../assets/js/styles';
import Login from '../login/Login';
import broken_robot from '../../assets/images/broken_robot.svg';
import { fetchStaffPicks, updateStaffPicks } from '../home/projectsScripts';
import StaffPick from '../../components/staff_pick/StaffPick';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);
const useLoginStyleOverrides = makeStyles(loginStyleOverrides);
const useStaffPickStyleOverrides = makeStyles(staffPickStyleOverrides)

/**
 * @function buildCreatorProfiles Component
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
const buildCreatorProfiles = (
  results,
  { classes, common_classes },
  props,
  state,
  handleSetState,
) =>
  results.map(creator => (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
      className={classes.projectGridStyle}
      align="center"
      key={creator.id}
    >
      <Link
        className={common_classes.textDecorationNone}
        to={`/creators/${creator.username}`}
      >
        <Card className={clsx(classes.cardStyle, !props.auth?.token && classes.cardLoggedOutStyle)}>
          <Avatar
            className={classes.avatarStyle}
            src={creator.avatar}
            alt={creator.username}
          />
          {creator.id !== props.auth.id ? (
            <CustomButton
              variant="contained"
              onClick={(e, id = creator.id) =>
                handleSetState(toggleFollow(e, props, state, id, toast))
              }
              primaryButtonStyle
            >
              {creator.followers.includes(props.auth.id)
                ? props.t('searchResults.following.unfollow')
                : props.t('searchResults.following.follow')}
            </CustomButton>
          ) : null}
          <Typography
            component="h3"
            color="textPrimary"
            className={classes.userNameStyle}
          >
            {creator.username}
          </Typography>
        </Card>
      </Link>
    </Grid>
  ));

/**
 * @function SearchResults View
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function SearchResults(props) {
  const classes = useStyles();
  const common_classes = useCommonStyles();
  const loginClasses = useLoginStyleOverrides();
  const staffPickClasses = useStaffPickStyleOverrides();

  const [state, setState] = React.useState({
    results: [],
    count: null,
    previous: null,
    next: null,
    loading: true,
  });

  React.useEffect(() => {
    const params = getQueryParams(window.location.href);
    fetchStaffPicks(props);
    handleSetState(fetchPage(null, props, params.get('q'), params.get('type')));
  }, []);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const getResults = (type, results) => {
    if (type === SearchType.CREATORS) {
      return buildCreatorProfiles(
        results,
        { classes, common_classes },
        props,
        state,
        handleSetState,
      );
    } else {
      return (
        <Grid container spacing={3} className={classes.projectsContainerStyle}>
          {results.map(project => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              align="center"
            >
              <Project
                project={project}
                key={project.id}
                updateProjects={res =>
                  handleSetState(updateProjects(res, state, props, toast))
                }
                {...props}
              />
            </Grid>
          ))}
        </Grid>
      )
    }
  };

  const {
    count,
    results,
    previous: prev_page,
    next: next_page,
    loading,
  } = state;
  const staff_picks = props.projects.staff_picks;
  const { t } = props;
  if (loading) {
    return <LoadingPage />;
  } else {
    return (
      <Box className={classes.root}>
          <Container className={classes.mainContainerStyle}>
            {results && results.length > 0 ? (
            <Grid container className={clsx(!props.auth.token && classes.mainContainerLoggedOutStyle)}>
              <Grid item xs={12}>
                <Typography
                  className={classes.pageHeaderStyle}
                  variant="h4"
                  gutterBottom
                >
                  {count}{' '}
                  {count > 1
                    ? t('searchResults.resultsFound')
                    : t('searchResults.resultFound')}{' '}
                  "{getQueryParams(window.location.href).get('q')}"
                </Typography>
              </Grid>
              <div className={clsx(classes.creatorsContainerStyle, !props.auth?.token && classes.creatorsContainerLoggedOutStyle)}>
              {getResults(
                getQueryParams(window.location.href).get('type'),
                results,
              )}
              </div>
            </Grid>
            ) : (
            <div className={clsx(classes.noResultContainerStyle, !props.auth.token && classes.mainContainerLoggedOutStyle)}>
              <div>
                <img className={classes.notFoundRobotStyle} src={broken_robot} alt={'error'} />
              </div>
              <Typography
                className={clsx(classes.pageHeaderStyle, classes.noResultTitleStyle, getQueryParams(window.location.href).get('type') === SearchType.CREATORS && !props.auth?.token && classes.marginBottom)}
                variant="h4"
                gutterBottom
              >
                {t('searchResults.errors.noResult2')}
                "
                {getQueryParams(window.location.href).get('q')}
                "
              </Typography>
              {staff_picks &&
                getQueryParams(window.location.href).get('type') === SearchType.PROJECTS && (
                  <>
                    <Typography
                      className={classes.noResultDescStyle}
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {t('searchResults.errors.noResultDescription')}
                    </Typography>
                    {staff_picks.map(staff_pick => (
                      <StaffPick
                        key={staff_pick.id}
                        staff_pick={staff_pick}
                        updateProjects={res =>
                          handleSetState(
                            updateStaffPicks(res, staff_pick.id, props, toast),
                          )
                        }
                        styleOverrides={{
                          root: staffPickClasses.root,
                          mainContainer: staffPickClasses.mainContainerStyle,
                          MessagePrimary: staffPickClasses.MessagePrimaryStyle,
                        }}
                        {...props}
                      />
                      ))
                    }
                  </>
                )
              }
              
            </div>
            )}
            {prev_page || next_page &&
            <ButtonGroup
              aria-label={t('searchResults.ariaLabels.prevNxtButtons')}
              className={clsx(classes.buttonGroupStyle, !props.auth?.token && classes.buttonGroupLoggedOut)}
            >
              {prev_page ? (
                <CustomButton
                  className={classes.floatLeft}
                  size="large"
                  startIcon={<NavigateBeforeIcon />}
                  onClick={(
                    _,
                    page = getQueryParams(prev_page).get('page'),
                  ) => {
                    handleSetState({ loading: true });
                    handleSetState(
                      fetchPage(
                        page,
                        props,
                        getQueryParams(prev_page).get('q'),
                        getQueryParams(window.location.href).get('type'),
                      ),
                    );
                  }}
                  primaryButtonStyle
                >
                  {t('searchResults.prev')}
                </CustomButton>
              ) : null}
              {next_page ? (
                <CustomButton
                  className={classes.floatRight}
                  size="large"
                  endIcon={<NavigateNextIcon />}
                  onClick={(
                    _,
                    page = getQueryParams(next_page).get('page'),
                  ) => {
                    handleSetState({ loading: true });
                    handleSetState(
                      fetchPage(
                        page,
                        props,
                        getQueryParams(next_page).get('q'),
                        getQueryParams(window.location.href).get('type'),
                      ),
                    );
                  }}
                  primaryButtonStyle
                >
                  {t('searchResults.next')}
                </CustomButton>
              ) : null}
            </ButtonGroup>
            }
            {!props.auth?.token &&
              <>
                <div className={classes.transitionStyle}></div>
                <div className={classes.loginCardStyle}>
                  <Login
                    {...props} 
                    title={`${t(`searchResults.loginCard.title.${getQueryParams(window.location.href).get('type')}`)}`}
                    styleOverrides={{
                      root: loginClasses.root,
                      container: loginClasses.container,
                      card: loginClasses.card,
                      title: loginClasses.title,
                      description: loginClasses.description,
                      grid: loginClasses.grid
                    }}
                  />
                </div>
              </>
            }
          </Container>
      </Box>
    );
  }
}

SearchResults.propTypes = {
  auth: PropTypes.object.isRequired,
  searchProjects: PropTypes.func.isRequired,
  searchCreators: PropTypes.func.isRequired,
  searchTags: PropTypes.func.isRequired,
  toggleFollow: PropTypes.func.isRequired,
  toggleLike: PropTypes.func.isRequired,
  toggleSave: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
    projects: state.projects,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    searchProjects: args => {
      return dispatch(ProjectActions.searchProjects(args));
    },
    searchCreators: args => {
      return dispatch(CreatorActions.searchCreators(args));
    },
    searchTags: args => {
      return dispatch(ProjectActions.searchTags(args));
    },
    toggleFollow: args => {
      return dispatch(CreatorActions.toggleFollow(args));
    },
    toggleLike: args => {
      return dispatch(ProjectActions.toggleLike(args));
    },
    toggleSave: args => {
      return dispatch(ProjectActions.toggleSave(args));
    },
    getStaffPicks: args => {
      return dispatch(ProjectActions.getStaffPicks(args));
    },
    setStaffPicks: args => {
      return dispatch(ProjectActions.setStaffPicks(args));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
