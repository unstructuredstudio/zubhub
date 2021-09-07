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

import * as ProjectActions from '../../store/actions/projectActions';
import * as CreatorActions from '../../store/actions/userActions';
import CustomButton from '../../components/button/Button';
import ErrorPage from '../error/ErrorPage';
import LoadingPage from '../loading/LoadingPage';
import Project from '../../components/project/Project';
import styles from '../../assets/js/styles/views/search_results/searchResultsStyles';
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

const getQueryParams = url => {
  const params = url.split('?')[1];
  let [page, query] = params.split('q=');
  if (page) {
    page = page.split('=')[1];
    page = page.split('&')[0];
  } else {
    page = null;
  }
  return { page, query };
};

const fetchPage = (page, props, query_string, type) => {
  if (type === 'projects') {
    return props.search_projects({ page, query_string, t: props.t, type });
  } else if (type === 'creators') {
    return props.search_creators({ page, query_string, t: props.t, type });
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
        toast.warning(props.t('searchResults.errors.unexpected'));
      } else {
        toast.warning(error.message);
      }
      return { loading: false };
    });
};

const toggle_follow = (e, props, state, id) => {
  e.preventDefault();
  if (!props.auth.token) {
    props.history.push('/login');
  } else {
    return props
      .toggle_follow({ id, token: props.auth.token, t: props.t })
      .then(res => {
        if (res.profile && res.profile.username) {
          const results = state.results.map(creator =>
            creator.id !== res.profile.id ? creator : res.profile,
          );
          return { results };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(props.t('searchResults.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  }
};

const buildCreatorProfiles = (
  results,
  { classes, commonClasses },
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
        className={commonClasses.textDecorationNone}
        to={`/creators/${creator.username}`}
      >
        <Card className={classes.cardStyle}>
          <Avatar
            className={classes.avatarStyle}
            src={creator.avatar}
            alt={creator.username}
          />
          {creator.id !== props.auth.id ? (
            <CustomButton
              variant="contained"
              onClick={(e, id = creator.id) =>
                handleSetState(toggle_follow(e, props, state, id))
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

function SearchResults(props) {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const [state, setState] = React.useState({
    results: [],
    count: null,
    previous: null,
    next: null,
    loading: true,
    type: null,
  });

  React.useEffect(() => {
    handleSetState(
      fetchPage(
        null,
        props,
        getQueryParams(props.location.search).query,
        'projects',
      ),
    );
  }, []);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const {
    count,
    results,
    previous: prevPage,
    next: nextPage,
    loading,
    type,
  } = state;
  const { t } = props;
  if (loading) {
    return <LoadingPage />;
  } else {
    return (
      <Box className={classes.root}>
        <Box className={classes.searchSectionStyle}>
          <Button
            className={clsx(
              type === 'projects' ? classes.selectedTabStyle : null,
              classes.tabStyle,
            )}
            onClick={() =>
              handleSetState(
                fetchPage(
                  null,
                  props,
                  getQueryParams(props.location.search).query,
                  'projects',
                ),
              )
            }
          >
            {t('searchResults.projects')}
          </Button>

          <Button
            className={clsx(
              type === 'creators' ? classes.selectedTabStyle : null,
              classes.tabStyle,
            )}
            onClick={() =>
              handleSetState(
                fetchPage(
                  null,
                  props,
                  getQueryParams(props.location.search).query,
                  'creators',
                ),
              )
            }
          >
            {t('searchResults.creators')}
          </Button>
        </Box>
        {results && results.length > 0 ? (
          type === 'projects' ? (
            <Container className={classes.mainContainerStyle}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography
                    className={classes.pageHeaderStyle}
                    variant="h3"
                    gutterBottom
                  >
                    {count}{' '}
                    {count > 1
                      ? t('searchResults.resultsFound')
                      : t('searchResults.resultFound')}
                  </Typography>
                </Grid>
                {results.map(project => (
                  <Grid
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
                      updateProjects={res =>
                        handleSetState(updateProjects(res, state, props))
                      }
                      {...props}
                    />
                  </Grid>
                ))}
              </Grid>
              <ButtonGroup
                aria-label={t('searchResults.ariaLabels.prevNxtButtons')}
                className={classes.buttonGroupStyle}
              >
                {prevPage ? (
                  <CustomButton
                    className={classes.floatLeft}
                    size="large"
                    startIcon={<NavigateBeforeIcon />}
                    onClick={(e, page = getQueryParams(prevPage).page) =>
                      handleSetState(
                        fetchPage(
                          page,
                          props,
                          getQueryParams(prevPage).query,
                          'projects',
                        ),
                      )
                    }
                    primaryButtonStyle
                  >
                    {t('searchResults.prev')}
                  </CustomButton>
                ) : null}
                {nextPage ? (
                  <CustomButton
                    className={classes.floatRight}
                    size="large"
                    endIcon={<NavigateNextIcon />}
                    onClick={(e, page = getQueryParams(nextPage).page) =>
                      handleSetState(
                        fetchPage(
                          page,
                          props,
                          getQueryParams(nextPage).query,
                          'projects',
                        ),
                      )
                    }
                    primaryButtonStyle
                  >
                    {t('searchResults.next')}
                  </CustomButton>
                ) : null}
              </ButtonGroup>
            </Container>
          ) : (
            <Container className={classes.mainContainerStyle}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography
                    className={classes.pageHeaderStyle}
                    variant="h3"
                    gutterBottom
                  >
                    {count}{' '}
                    {count > 1
                      ? t('searchResults.resultsFound')
                      : t('searchResults.resultFound')}
                  </Typography>
                </Grid>
                {buildCreatorProfiles(
                  results,
                  { classes, commonClasses },
                  props,
                  state,
                  handleSetState,
                )}
              </Grid>
              <ButtonGroup
                aria-label={t('searchResults.ariaLabels.prevNxtButtons')}
                className={classes.buttonGroupStyle}
              >
                {prevPage ? (
                  <CustomButton
                    className={classes.floatLeft}
                    size="large"
                    startIcon={<NavigateBeforeIcon />}
                    onClick={(e, page = getQueryParams(prevPage).page) =>
                      handleSetState(
                        fetchPage(
                          page,
                          props,
                          getQueryParams(prevPage).query,
                          'projects',
                        ),
                      )
                    }
                    primaryButtonStyle
                  >
                    {t('searchResults.prev')}
                  </CustomButton>
                ) : null}
                {nextPage ? (
                  <CustomButton
                    className={classes.floatRight}
                    size="large"
                    endIcon={<NavigateNextIcon />}
                    onClick={(e, page = getQueryParams(nextPage).page) =>
                      handleSetState(
                        fetchPage(
                          page,
                          props,
                          getQueryParams(nextPage).query,
                          'projects',
                        ),
                      )
                    }
                    primaryButtonStyle
                  >
                    {t('searchResults.next')}
                  </CustomButton>
                ) : null}
              </ButtonGroup>
            </Container>
          )
        ) : (
          <ErrorPage
            style={{ width: '100vw' }}
            error={t('searchResults.errors.noResult')}
          />
        )}
      </Box>
    );
  }
}

SearchResults.propTypes = {
  auth: PropTypes.object.isRequired,
  search_projects: PropTypes.func.isRequired,
  search_creators: PropTypes.func.isRequired,
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
    search_projects: args => {
      return dispatch(ProjectActions.search_projects(args));
    },
    search_creators: args => {
      return dispatch(CreatorActions.search_creators(args));
    },
    toggle_follow: args => {
      return dispatch(CreatorActions.toggle_follow(args));
    },
    toggle_like: args => {
      return dispatch(ProjectActions.toggle_like(args));
    },
    toggle_save: args => {
      return dispatch(ProjectActions.toggle_save(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
