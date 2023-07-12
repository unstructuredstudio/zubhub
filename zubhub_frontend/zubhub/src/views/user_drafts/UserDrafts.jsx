import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { toast } from 'react-toastify';

import { makeStyles } from '@material-ui/core/styles';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Grid, Box, ButtonGroup, Typography, Container } from '@material-ui/core';

import { fetchPage, updateDrafts } from './userDraftsScripts';

import * as ProjectActions from '../../store/actions/projectActions';
import CustomButton from '../../components/button/Button';
import ErrorPage from '../error/ErrorPage';
import LoadingPage from '../loading/LoadingPage';
import styles from '../../assets/js/styles/views/user_projects/userProjectsStyles';
import Project from '../../components/project/Project';

const useStyles = makeStyles(styles);

/**
 * @function UserDrafts View
 */
function UserDrafts(props) {
  const classes = useStyles();

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
  const username = props.match.params.username;
  if (loading) {
    return <LoadingPage />;
  } else if (drafts && drafts.length > 0) {
    return (
      <Box className={classes.root}>
        <Grid spacing={3} container>
          <Grid item xs={12}>
            <Typography className={classes.pageHeaderStyle} variant="h3" gutterBottom>
              {username}'s {t('userDrafts.title')}
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
    return <ErrorPage error={t('userDrafts.errors.noUserDrafts')} />;
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
