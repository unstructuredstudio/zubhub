import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { toast } from 'react-toastify';

import { makeStyles } from '@mui/styles';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Grid, Box, ButtonGroup, Typography, Container } from '@mui/material';

import { fetchPage, updateProjects } from './savedProjectsScripts';

import * as ProjectActions from '../../store/actions/projectActions';
import CustomButton from '../../components/button/Button';
import ErrorPage from '../error/ErrorPage';
import LoadingPage from '../loading/LoadingPage';
import Project from '../../components/project/Project';
import styles from '../../assets/js/styles/views/saved_projects/savedProjectsStyles';

const useStyles = makeStyles(styles);

/**
 * @function SavedProjects View
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function SavedProjects(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    results: [],
    prev_page: null,
    next_page: null,
    loading: true,
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  React.useEffect(() => {
    handleSetState(fetchPage(null, props));
  }, []);

  const { results: projects, prev_page, next_page, loading } = state;
  const { t } = props;
  if (loading) {
    return <LoadingPage />;
  } else if (projects && projects.length > 0) {
    return (
      <Box className={classes.root}>
        <Container className={classes.mainContainerStyle}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography className={classes.pageHeaderStyle} variant="h4" gutterBottom>
                {t('savedProjects.title')}
              </Typography>
            </Grid>
            {projects.map(project => (
              <Grid item xs={12} sm={6} md={4} align="center" className={classes.projectGridStyle} key={project.id}>
                <Project
                  project={project}
                  updateProjects={res => handleSetState(updateProjects(res, state, props, toast))}
                  {...props}
                />
              </Grid>
            ))}
          </Grid>
          <ButtonGroup aria-label={t('savedProjects.ariaLabels.prevNxtButtons')} className={classes.buttonGroupStyle}>
            {prev_page ? (
              <CustomButton
                className={classes.floatLeft}
                size="large"
                startIcon={<NavigateBeforeIcon />}
                onClick={(e, page = prev_page.split('?')[1]) => {
                  handleSetState({ loading: true });
                  handleSetState(fetchPage(page, props));
                }}
                primaryButtonStyle
              >
                {t('savedProjects.prev')}
              </CustomButton>
            ) : null}
            {next_page ? (
              <CustomButton
                className={classes.floatRight}
                size="large"
                endIcon={<NavigateNextIcon />}
                onClick={(e, page = next_page.split('?')[1]) => {
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
  getSaved: PropTypes.func.isRequired,
  toggleLike: PropTypes.func.isRequired,
  toggleSave: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ auth: state.auth });

const mapDispatchToProps = dispatch => ({
  getSaved: props => dispatch(ProjectActions.getSaved(props)),
  toggleLike: props => dispatch(ProjectActions.toggleLike(props)),
  toggleSave: props => dispatch(ProjectActions.toggleSave(props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SavedProjects);
