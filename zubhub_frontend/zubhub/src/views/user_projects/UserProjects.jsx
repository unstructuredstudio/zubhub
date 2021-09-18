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

import { fetchPage, updateProjects } from './userProjectsScripts';

import * as ProjectActions from '../../store/actions/projectActions';
import CustomButton from '../../components/button/Button';
import ErrorPage from '../error/ErrorPage';
import LoadingPage from '../loading/LoadingPage';
import Project from '../../components/project/Project';
import styles from '../../assets/js/styles/views/user_projects/userProjectsStyles';

const useStyles = makeStyles(styles);

function UserProjects(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    results: [],
    prev_page: null,
    next_page: null,
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

  const { results: projects, prev_page, next_page, loading } = state;
  const { t } = props;
  const username = props.match.params.username;
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
                {username}'s {t('userProjects.title')}
              </Typography>
            </Grid>
            {projects.map(project => (
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
                    handleSetState(updateProjects(res, state, props, toast))
                  }
                  {...props}
                />
              </Grid>
            ))}
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

UserProjects.propTypes = {
  auth: PropTypes.object.isRequired,
  getUserProjects: PropTypes.func.isRequired,
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
    getUserProjects: args => {
      return dispatch(ProjectActions.getUserProjects(args));
    },
    toggleLike: args => {
      return dispatch(ProjectActions.toggleLike(args));
    },
    toggleSave: args => {
      return dispatch(ProjectActions.toggleSave(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProjects);
