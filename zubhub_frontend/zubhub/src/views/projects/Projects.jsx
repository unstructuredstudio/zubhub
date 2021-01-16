import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { toast } from 'react-toastify';

import { makeStyles } from '@material-ui/core/styles';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Grid, Box, ButtonGroup, Container } from '@material-ui/core';

import * as ProjectActions from '../../store/actions/projectActions';
import CustomButton from '../../components/button/Button';
import ErrorPage from '../error/ErrorPage';
import LoadingPage from '../loading/LoadingPage';
import Project from '../../components/project/Project';
import styles from '../../assets/js/styles/views/projects/projectsStyles';

const useStyles = makeStyles(styles);

const fetchPage = (page, props) => {
  return props.get_projects(page);
};

const updateProjects = (res, props) => {
  return res
    .then(res => {
      if (res.project && res.project.title) {
        const results = props.projects.results.map(project =>
          project.id === res.project.id ? res.project : project,
        );
        props.set_projects({ ...props.projects, results });
        return { loading: false };
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

function Projects(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    loading: true,
  });

  React.useEffect(() => {
    handleSetState(fetchPage(null, props));
  }, []);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState({ ...state, ...obj });
      });
    }
  };

  const { loading } = state;
  const {
    results: projects,
    previous: prevPage,
    next: nextPage,
  } = props.projects;

  if (loading) {
    return <LoadingPage />;
  } else if (projects && projects.length > 0) {
    return (
      <Box className={classes.root}>
        <Container class={classes.mainContainerStyle}>
          <Grid container>
            {projects.map(project => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                align="center"
                className={classes.projectGridStyle}
              >
                <Project
                  project={project}
                  key={project.id}
                  updateProjects={res =>
                    handleSetState(updateProjects(res, props))
                  }
                  {...props}
                />
              </Grid>
            ))}
          </Grid>
          <ButtonGroup
            aria-label="previous and next page buttons"
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
                Prev
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
                Next
              </CustomButton>
            ) : null}
          </ButtonGroup>
        </Container>
      </Box>
    );
  } else {
    return (
      <ErrorPage error="An error occured while fetching Projects, please try again later" />
    );
  }
}

Projects.propTypes = {
  auth: PropTypes.object.isRequired,
  get_projects: PropTypes.func.isRequired,
  set_projects: PropTypes.func.isRequired,
  toggle_like: PropTypes.func.isRequired,
  toggle_save: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
    projects: state.projects.all_projects,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    get_projects: page => {
      return dispatch(ProjectActions.get_projects(page));
    },
    set_projects: projects => {
      return dispatch(ProjectActions.set_projects(projects));
    },
    toggle_like: props => {
      return dispatch(ProjectActions.toggle_like(props));
    },
    toggle_save: props => {
      return dispatch(ProjectActions.toggle_save(props));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
