import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Box, ButtonGroup, Container, Card, Typography } from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { toast } from 'react-toastify';
import CustomButton from '../../components/button/Button';

import * as UserActions from '../../store/actions/userActions';
import * as ProjectActions from '../../store/actions/projectActions';
import LoadingPage from '../loading/LoadingPage';
import ErrorPage from '../error/ErrorPage';
import Project from '../../components/project/Project';
import { fetchPage, updateProjects } from './ambassadorsScripts';


import styles from '../../assets/js/styles/views/ambassadors/ambassadorsStyles';

const useStyles = makeStyles(styles);

/**
 * @function Ambassadors View
 * @author Srishti Sethi <srishti@unstructured.studio>
 *
 * @todo - describe function's signature
 */
function Ambassadors(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    loading: true,
    ambassadors: {},
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

  const { loading, ambassadors } = state;
  const { t } = props;
  

  if (loading) {
    return <LoadingPage />;
  } else if (Object.keys(ambassadors).length > 0 && ambassadors.ambassadors) {
    return (
      <Box className={classes.root}>
        <Container className={classes.containerStyle}>
          <Card className={classes.cardStyle}>
            <Typography className={classes.ambassadorsHeadingStyle}>
              Ambassadors
            </Typography>
            <Box
              className={classes.ambassadorsBodyStyle}
              dangerouslySetInnerHTML={{ __html: ambassadors.ambassadors }}
            ></Box>
          </Card>
        </Container>
        <Container className={classes.containerStyle}>
            <Typography className={classes.ambassadorsHeadingStyle}>
              Selected Projects
            </Typography>


          <Grid container spacing={3}>
            {ambassadors.projects.results.map(project => (
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
            {ambassadors.projects.prev ? (
              <CustomButton
                className={classes.floatLeft}
                size="large"
                startIcon={<NavigateBeforeIcon />}
                onClick={(e, page = ambassadors.projects.prev) => {
                  handleSetState({ loading: true });
                  handleSetState(fetchPage(page, props));
                }}
                primaryButtonStyle
              >
                {t('staffPickDetails.prev')}
              </CustomButton>
            ) : null}
            {ambassadors.projects.next ? (
              <CustomButton
                className={classes.floatRight}
                size="large"
                endIcon={<NavigateNextIcon />}
                onClick={(e, page = ambassadors.projects.next) => {
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
    return <ErrorPage error={t('ambassadors.errors.page_empty')} />;
  }
}

Ambassadors.propTypes = {
  auth: PropTypes.object.isRequired,
  getAmbassadors: PropTypes.func.isRequired,
  toggleLike: PropTypes.func.isRequired,
  toggleSave: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAmbassadors: args => {
      return dispatch(UserActions.getAmbassadors(args));
    },
    toggleLike: props => {
      return dispatch(ProjectActions.toggleLike(props));
    },
    toggleSave: props => {
      return dispatch(ProjectActions.toggleSave(props));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Ambassadors);
