import React from 'react';
import PropTypes from 'prop-types';

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
} from '@material-ui/core';

import * as ProjectActions from '../../store/actions/projectActions';
import CustomButton from '../../components/button/Button';
import ErrorPage from '../error/ErrorPage';
import LoadingPage from '../loading/LoadingPage';
import Project from '../../components/project/Project';
import styles from '../../assets/js/styles/views/saved_projects/savedProjectsStyles';

const useStyles = makeStyles(styles);

const fetchPage = (page, props) => {
  if (!props.auth.token) {
    props.history.push('/login');
  } else {
    return props.get_saved({ page, token: props.auth.token, t: props.t });
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
        toast.warning(props.t('savedProjects.errors.unexpected'));
      } else {
        toast.warning(error.message);
      }
      return { loading: false };
    });
};

function SavedProjects(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    results: [],
    prevPage: null,
    nextPage: null,
    loading: true,
  });

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
  const { results: projects, prevPage, nextPage, loading } = state;
  const { t } = props;
  if (loading) {
    return <LoadingPage />;
  } else if (projects && projects.length > 0) {
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
                {t('savedProjects.title')}
              </Typography>
            </Grid>
            {projects.map(project => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                align="center"
                className={classes.projectGridStyle}
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
            aria-label={t('savedProjects.ariaLabels.prevNxtButtons')}
            className={classes.buttonGroupStyle}
          >
            {prevPage ? (
              <CustomButton
                className={classes.floatLeft}
                size="large"
                startIcon={<NavigateBeforeIcon />}
                onClick={(e, page = prevPage.split('?')[1]) => {
                  handleSetState({ loading: true });
                  handleSetState(fetchPage(page, props));
                }}
                primaryButtonStyle
              >
                {t('savedProjects.prev')}
              </CustomButton>
            ) : null}
            {nextPage ? (
              <CustomButton
                className={classes.floatRight}
                size="large"
                endIcon={<NavigateNextIcon />}
                onClick={(e, page = nextPage.split('?')[1]) => {
                  handleSetState({ loading: true });
                  handleSetState(fetchPage(page, props));
                }}
                primaryButtonStyle
              >
                {t('savedProjects.next')}
              </CustomButton>
            ) : null}
          </ButtonGroup>
        </Container>
      </Box>
    );
  } else {
    return <ErrorPage error={t('savedProjects.errors.noSavedProjects')} />;
  }
}

SavedProjects.propTypes = {
  auth: PropTypes.object.isRequired,
  get_saved: PropTypes.func.isRequired,
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
    get_saved: props => {
      return dispatch(ProjectActions.get_saved(props));
    },
    toggle_like: props => {
      return dispatch(ProjectActions.toggle_like(props));
    },
    toggle_save: props => {
      return dispatch(ProjectActions.toggle_save(props));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedProjects);
