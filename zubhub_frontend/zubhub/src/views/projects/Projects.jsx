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
  Container,
  Typography,
} from '@material-ui/core';

import * as ProjectActions from '../../store/actions/projectActions';
import CustomButton from '../../components/button/Button';
import ErrorPage from '../error/ErrorPage';
import LoadingPage from '../loading/LoadingPage';
import Project from '../../components/project/Project';
import StaffPick from '../../components/staff_pick/StaffPick';
import styles from '../../assets/js/styles/views/projects/projectsStyles';

const useStyles = makeStyles(styles);

const fetchPage = (page, props) => {
  return props.get_projects({ page, t: props.t });
};

const fetchStaffPicks = props => {
  return props.get_staff_picks({ t: props.t });
};

const updateProjects = (res, props) => {
  return res
    .then(res => {
      if (res.project && res.project.title) {
        const results = props.projects.all_projects.results.map(project =>
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
      if (error.message.startsWith('Unexpected')) {
        toast.warning(props.t('projects.errors.unexpected'));
      } else {
        toast.warning(error.message);
      }
      return { loading: false };
    });
};

const updateStaffPicks = (res, staff_pick_id, props) => {
  return res
    .then(res => {
      if (res.project && res.project.title) {
        const staff_picks = props.projects.staff_picks.map(staff_pick =>
          staff_pick.id === staff_pick_id
            ? {
                ...staff_pick,
                projects: staff_pick.projects.map(project =>
                  project.id === res.project.id ? res.project : project,
                ),
              }
            : staff_pick,
        );

        return props.set_staff_picks(staff_picks);
      } else {
        res = Object.keys(res)
          .map(key => res[key])
          .join('\n');
        throw new Error(res);
      }
    })
    .catch(error => {
      if (error.message.startsWith('Unexpected')) {
        toast.warning(props.t('projects.errors.unexpected'));
      } else {
        toast.warning(error.message);
      }
      return { loading: false };
    });
};

function Projects(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    loading: true,
  });

  React.useEffect(() => {
    fetchStaffPicks(props);
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
  } = props.projects.all_projects;
  const staff_picks = props.projects.staff_picks;
  const { t } = props;

  if (loading) {
    return <LoadingPage />;
  } else if (projects && projects.length > 0) {
    return (
      <Box className={classes.root}>
        <Container class={classes.mainContainerStyle}>
          {staff_picks.map(staff_pick => (
            <StaffPick
              key={staff_pick.id}
              staff_pick={staff_pick}
              updateProjects={res =>
                handleSetState(updateStaffPicks(res, staff_pick.id, props))
              }
              {...props}
            />
          ))}
          <Grid container>
            {staff_picks && staff_picks.length > 0 ? (
              <Grid item xs={12}>
                <Typography
                  gutterBottom
                  component="h2"
                  variant="h6"
                  color="textPrimary"
                  className={classes.titleStyle}
                >
                  {t('projects.allProjects')}
                </Typography>
              </Grid>
            ) : null}
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
            aria-label={t('projects.ariaLabels.prevNxtButtons')}
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
                {t('projects.prev')}
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
                {t('projects.next')}
              </CustomButton>
            ) : null}
          </ButtonGroup>
        </Container>
      </Box>
    );
  } else {
    return <ErrorPage error={t('projects.errors.unexpected')} />;
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
    projects: state.projects,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    get_projects: page => {
      return dispatch(ProjectActions.get_projects(page));
    },
    set_projects: args => {
      return dispatch(ProjectActions.set_projects(args));
    },
    toggle_like: args => {
      return dispatch(ProjectActions.toggle_like(args));
    },
    toggle_save: args => {
      return dispatch(ProjectActions.toggle_save(args));
    },
    get_staff_picks: args => {
      return dispatch(ProjectActions.get_staff_picks(args));
    },
    set_staff_picks: args => {
      return dispatch(ProjectActions.set_staff_picks(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
