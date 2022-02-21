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

import { fetchPage, updateProjects } from './staffPickDetailsScripts';

import * as ProjectActions from '../../store/actions/projectActions';
import CustomButton from '../../components/button/Button';
import ErrorPage from '../error/ErrorPage';
import LoadingPage from '../loading/LoadingPage';
import Project from '../../components/project/Project';
import styles from '../../assets/js/styles/views/staff_pick_details/staffPickDetailsStyles';

const useStyles = makeStyles(styles);

/**
* @function StaffPickDetails View
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
function StaffPickDetails(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    staff_pick: {},
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

  const { staff_pick, loading } = state;
  const { t } = props;
  if (loading) {
    return <LoadingPage />;
  } else if (staff_pick && staff_pick.projects.results.length > 0) {
    return (
      <Box className={classes.root}>
        <Container className={classes.mainContainerStyle}>
          <Grid container>
            <Grid item xs={12}>
              <Typography className={classes.pageHeaderStyle} variant="h3">
                {staff_pick.title}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                className={classes.descriptionBodyStyle}
                color="textSecondary"
                gutterBottom
              >
                {staff_pick.description}
              </Typography>
            </Grid>
            {staff_pick.projects.results.map(project => (
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
                    handleSetState(updateProjects(res, state, props, toast))
                  }
                  {...props}
                />
              </Grid>
            ))}
          </Grid>
          <ButtonGroup
            aria-label={t('staffPickDetails.ariaLabels.prevNxtButtons')}
            className={classes.buttonGroupStyle}
          >
            {staff_pick.projects.prev ? (
              <CustomButton
                className={classes.floatLeft}
                size="large"
                startIcon={<NavigateBeforeIcon />}
                onClick={(e, page = staff_pick.projects.prev) => {
                  handleSetState({ loading: true });
                  handleSetState(fetchPage(page, props));
                }}
                primaryButtonStyle
              >
                {t('staffPickDetails.prev')}
              </CustomButton>
            ) : null}
            {staff_pick.projects.next ? (
              <CustomButton
                className={classes.floatRight}
                size="large"
                endIcon={<NavigateNextIcon />}
                onClick={(e, page = staff_pick.projects.next) => {
                  handleSetState({ loading: true });
                  handleSetState(fetchPage(page, props));
                }}
                primaryButtonStyle
              >
                {t('staffPickDetails.next')}
              </CustomButton>
            ) : null}
          </ButtonGroup>
        </Container>
      </Box>
    );
  } else {
    return <ErrorPage error={t('staffPickDetails.errors.noStaffPick')} />;
  }
}

StaffPickDetails.propTypes = {
  auth: PropTypes.object.isRequired,
  getStaffPicks: PropTypes.func.isRequired,
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
    getStaffPick: args => {
      return dispatch(ProjectActions.getStaffPick(args));
    },
    toggleLike: props => {
      return dispatch(ProjectActions.toggleLike(props));
    },
    toggleSave: props => {
      return dispatch(ProjectActions.toggleSave(props));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StaffPickDetails);
