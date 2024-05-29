import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { connect } from 'react-redux';

import { toast } from 'react-toastify';

import { makeStyles } from '@mui/styles';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Pagination } from '@mui/lab';
import { Grid, Box, Typography, Container } from '@mui/material';

import { fetchPage, fetchStaffPicks, updateProjects, updateStaffPicks } from './projectsScripts';

import * as ProjectActions from '../../store/actions/projectActions';
import CustomButton from '../../components/button/Button';
import ErrorPage from '../error/ErrorPage';
import LoadingPage from '../loading/LoadingPage';
import Project from '../../components/project/Project';
import StaffPick from '../../components/staff_pick/StaffPick';
import new_stuff from '../../assets/images/new_stuff.svg';
import heroMainImage from '../../assets/images/heroMainImage.svg';
import styles from '../../assets/js/styles/views/projects/projectsStyles';
import commonStyles from '../../assets/js/styles';
import hikingIcon from '../../assets/images/hiking.svg';
import { PROJECTS_PAGE_SIZE } from '../../utils.js';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

/**
 * @function Projects View
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function Projects(props) {
  const classes = useStyles();
  const common_classes = useCommonStyles();

  const [state, setState] = React.useState({
    loading: true,
    currentPage: 1,
    isMobileView: false,
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  React.useEffect(() => {
    fetchStaffPicks(props);
    handleSetState(fetchPage(null, props));

    const checkMobileView = () => {
      setState(prevState => ({
        ...prevState,
        isMobileView: window.innerWidth < 500, // Adjust the breakpoint as needed
      }));
    };

    checkMobileView(); // Initial check
    window.addEventListener('resize', checkMobileView);

    return () => {
      window.removeEventListener('resize', checkMobileView);
    };
  }, []);

  const { loading, isMobileView } = state;
  const { count: totalProjects, results: projects, previous: prev_page, next: next_page } = props.projects.all_projects;
  const { hero } = props.projects;
  const staff_picks = props.projects.staff_picks;
  const { t } = props;
  const noOfPage = Math.ceil(totalProjects / PROJECTS_PAGE_SIZE);
  if (loading) {
    return <LoadingPage />;
  } else if (projects && projects.length >= 0) {
    return (
      <>
        {projects.length > 0 ? (
          <Box className={classes.root}>
            {!props.auth?.token && hero && hero.id ? (
              <Box className={classes.heroMainSectionStyle}>
                <Box className={classes.heroMessageContainerStyle}>
                  <Typography className={classes.heroMessageSecondaryStyle}>{hero.description}</Typography>
                  <Typography className={classes.heroMessagePrimaryStyle}>{hero.title}</Typography>
                  <CustomButton
                    className={classes.heroButtonStyle}
                    size="small"
                    primaryButtonStyle
                    onClick={() => props.navigate('/projects/create')}
                  >
                    {t('projects.shareProject')}
                  </CustomButton>
                  <a
                    className={common_classes.textDecorationNone}
                    href={hero.explore_ideas_url ? hero.explore_ideas_url : 'https://kriti.unstructured.studio/'}
                    target="__blank"
                    rel="noreferrer"
                  >
                    <CustomButton className={classes.heroButtonStyle} size="small" darkDangerButtonStyle>
                      {t('projects.exploreIdeas')}
                    </CustomButton>
                  </a>
                  <CustomButton
                    className={classes.heroButtonStyle}
                    size="small"
                    customWarningButtonStyle
                    onClick={() => props.navigate('/ambassadors')}
                  >
                    {t('projects.zubhubAmbassadors')}
                  </CustomButton>
                </Box>
                <Box
                  className={clsx(classes.heroImageContainerStyle, {
                    [common_classes.displayNone]: !hero.activity_url,
                  })}
                >
                  <img src={new_stuff} alt={t('projects.newStuff')} />
                  <a href={hero.activity_url} target="__blank" rel="noreferrer">
                    <img
                      className={classes.heroImageStyle}
                      src={hero.image_url ? hero.image_url : heroMainImage}
                      alt={t('projects.heroAlt')}
                    />
                  </a>
                </Box>
              </Box>
            ) : null}
            <Box className={classes.mainContainerStyle}>
              {staff_picks &&
                staff_picks.map(staff_pick => (
                  <StaffPick
                    key={staff_pick.id}
                    staff_pick={staff_pick}
                    updateProjects={res => handleSetState(updateStaffPicks(res, staff_pick.id, props, toast))}
                    {...props}
                  />
                ))}
              <Grid spacing={3} container>
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
                    key={project.id}
                    xs={12}
                    sm={6}
                    lg={4}
                    item
                    align="center"
                    // className={classes.projectGridStyle}
                  >
                    <Project
                      project={project}
                      key={project.id}
                      updateProjects={res => handleSetState(updateProjects(res, props, toast))}
                      {...props}
                    />
                  </Grid>
                ))}
              </Grid>
              <div aria-label={t('projects.ariaLabels.prevNxtButtons')} className={classes.buttonGroupStyleThree}>
                {prev_page ? (
                  <CustomButton
                    className={clsx(classes.floatLeft, classes.buttonGroupStyleAlternative)}
                    size="large"
                    startIcon={<NavigateBeforeIcon />}
                    onClick={(e, page = prev_page.split('=')[1]) => {
                      handleSetState({ loading: true, currentPage: page ? +page : 1 });
                      handleSetState(fetchPage(page, props));
                      window.scrollTo(0, 0);
                    }}
                    primaryButtonStyle
                  >
                    {!isMobileView ? t('projects.prev') : ''}
                  </CustomButton>
                ) : (
                  <CustomButton className={clsx(classes.visibilityNone)}></CustomButton>
                )}
                {totalProjects > 18 ? (
                  <Pagination
                    count={noOfPage}
                    hidePrevButton={true}
                    hideNextButton={true}
                    page={state.currentPage}
                    className={clsx(classes.paginationRoot)}
                    onChange={(e, page) => {
                      handleSetState({ loading: true, currentPage: +page });
                      handleSetState(fetchPage(page, props));
                    }}
                    shape="rounded"
                    size="small"
                    style={{ display: 'flex' }}
                  />
                ) : (
                  ''
                )}

                {next_page ? (
                  <CustomButton
                    className={clsx(classes.floatRight, classes.buttonGroupStyleAlternative)}
                    size={!isMobileView ? 'large' : 'small'}
                    endIcon={<NavigateNextIcon />}
                    onClick={(e, page = next_page.split('=')[1]) => {
                      handleSetState({ loading: true, currentPage: +page });
                      handleSetState(fetchPage(page, props));
                      window.scrollTo(0, 0);
                    }}
                    primaryButtonStyle
                  >
                    {!isMobileView ? t('projects.next') : ''}
                  </CustomButton>
                ) : (
                  <CustomButton className={clsx(classes.visibilityNone)}></CustomButton>
                )}
              </div>
            </Box>
          </Box>
        ) : (
          <Box className={classes.root}>
            <Container className={classes.welcomeContainerStyle}>
              <img className={classes.welcomeStyle} src={hikingIcon} alt={'Create project'} />
              <Box className={classes.welcomeBoxStyle}>
                <Typography variant="h1">{t('projects.welcome')}!</Typography>
                <Typography variant="h5">{t('projects.errors.noProject')}</Typography>
                <Box>
                  <CustomButton
                    className={classes.heroButtonStyle}
                    size="small"
                    primaryButtonStyle
                    onClick={() => props.navigate('/projects/create')}
                  >
                    {t('projects.createProject')}
                  </CustomButton>
                  <a
                    className={common_classes.textDecorationNone}
                    href={hero.explore_ideas_url ? hero.explore_ideas_url : 'https://kriti.unstructured.studio/'}
                    target="__blank"
                    rel="noreferrer"
                  >
                    <CustomButton className={classes.heroButtonStyle} size="small" darkDangerButtonStyle>
                      {t('projects.exploreIdeas')}
                    </CustomButton>
                  </a>
                </Box>
              </Box>
            </Container>
          </Box>
        )}
      </>
    );
  } else {
    return <ErrorPage error={t('projects.errors.unexpected')} />;
  }
}

Projects.propTypes = {
  auth: PropTypes.object.isRequired,
  getProjects: PropTypes.func.isRequired,
  setProjects: PropTypes.func.isRequired,
  toggleLike: PropTypes.func.isRequired,
  toggleSave: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  projects: state.projects,
});

const mapDispatchToProps = dispatch => ({
  getProjects: page => dispatch(ProjectActions.getProjects(page)),
  setProjects: args => dispatch(ProjectActions.setProjects(args)),
  toggleLike: args => dispatch(ProjectActions.toggleLike(args)),
  toggleSave: args => dispatch(ProjectActions.toggleSave(args)),
  getStaffPicks: args => dispatch(ProjectActions.getStaffPicks(args)),
  setStaffPicks: args => dispatch(ProjectActions.setStaffPicks(args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
