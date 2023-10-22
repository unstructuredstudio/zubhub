import PropTypes from 'prop-types';
import React from 'react';

import { connect } from 'react-redux';

import { toast } from 'react-toastify';

import { Box, ButtonGroup, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { fetchPage, updateDrafts } from './userDraftsScripts';

import { capitalize } from 'lodash';
import styles from '../../assets/js/styles';
import styles2 from '../../assets/js/styles/views/user_projects/userProjectsStyles';
import CustomButton from '../../components/button/Button';
import Project from '../../components/project/Project';
import * as ProjectActions from '../../store/actions/projectActions';
import ErrorPage from '../error/ErrorPage';
import LoadingPage from '../loading/LoadingPage';

const useStyles = makeStyles(styles2);

/**
 * @function UserDrafts View
 */
function UserDrafts(props) {
  const classes = useStyles();
  const commonClasses = makeStyles(styles)();

  const [state, setState] = React.useState({
    drafts: [],
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

  const { drafts, prev_page, next_page, loading } = state;
  const { t } = props;
  const username = props.params.username;
  if (loading) {
    return <LoadingPage />;
  } else if (drafts && drafts.length > 0) {
    return (
      <Box className={classes.root}>
        <Grid spacing={3} container>
          <Grid item xs={12}>
            <Typography className={commonClasses.title1} variant="h3" gutterBottom>
              {capitalize(username)}'s {t('userDrafts.title')}
            </Typography>
          </Grid>
          {drafts.map(draft => (
            <Grid item xs={12} sm={6} lg={4} align="center">
              <Project
                project={draft}
                key={draft.id}
                updateProjects={res => handleSetState(updateDrafts(res, state, props, toast))}
                {...props}
              />
            </Grid>
          ))}
        </Grid>
        <ButtonGroup aria-label={t('userDrafts.ariaLabels.prevNxtButtons')} className={classes.buttonGroupStyle}>
          {prev_page ? (
            <CustomButton
              className={classes.floatLeft}
              size="large"
              startIcon={<NavigateBeforeIcon />}
              onClick={(e, page = prev_page.split('?')[1]) => handleSetState(fetchPage(page, props))}
              primaryButtonStyle
            >
              {t('userDrafts.prev')}
            </CustomButton>
          ) : null}
          {next_page ? (
            <CustomButton
              className={classes.floatRight}
              size="large"
              endIcon={<NavigateNextIcon />}
              onClick={(e, page = next_page.split('?')[1]) => handleSetState(fetchPage(page, props))}
              primaryButtonStyle
            >
              {t('userDrafts.next')}
            </CustomButton>
          ) : null}
        </ButtonGroup>
      </Box>
    );
  } else {
    return (
      <ErrorPage error={t('userDrafts.errors.noUserDrafts')}>
        <CustomButton primaryButtonStyle href="/projects/create">
          Create Project
        </CustomButton>
      </ErrorPage>
    );
  }
}

UserDrafts.propTypes = {
  auth: PropTypes.object.isRequired,
  getUserDrafts: PropTypes.func.isRequired,
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
    getUserDrafts: args => {
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

export default connect(mapStateToProps, mapDispatchToProps)(UserDrafts);
