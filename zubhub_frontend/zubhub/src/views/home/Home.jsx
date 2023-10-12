import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { connect } from 'react-redux';
import CheckIcon from '@material-ui/icons/CheckCircle';
import { toast } from 'react-toastify';
import child from '../../assets/images/child.jpg';
import teams from '../../assets/images/teams.JPG';
import review1 from '../../assets/images/faridah.png';
import review2 from '../../assets/images/hemant.png';
import review3 from '../../assets/images/yaya.png';
import global from '../../assets/images/global.JPG';
import { makeStyles } from '@material-ui/core/styles';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Grid, Box, ButtonGroup, Typography, Container } from '@material-ui/core';

import { fetchPage, fetchStaffPicks, updateProjects, updateStaffPicks } from './projectsScripts';

import * as ProjectActions from '../../store/actions/projectActions';
import CustomButton from '../../components/button/Button';
import ErrorPage from '../error/ErrorPage';
import LoadingPage from '../loading/LoadingPage';
import Project from '../../components/project/Project';
import StaffPick from '../../components/staff_pick/StaffPick';
import activity_of_the_month_svg from '../../assets/images/activity_of_the_month.svg';
import activity_of_the_month_small_svg from '../../assets/images/activity_of_the_month_small.svg';
import new_stuff from '../../assets/images/new_stuff.svg';
import styles from '../../assets/js/styles/views/projects/projectsStyles';
import commonStyles from '../../assets/js/styles';
import hikingIcon from '../../assets/images/hiking.svg';

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

  const [activeSlide, setActiveSlide] = React.useState(0);

  const handleSlideChange = index => {
    setActiveSlide(index);
  };

  const [state, setState] = React.useState({
    loading: true,
    isMobileView: false,
  });

  React.useEffect(() => {
    fetchStaffPicks(props);
    handleSetState(fetchPage(null, props));

    const checkMobileView = () => {
      setState((prevState) => ({
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

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { loading, isMobileView } = state;
  const {
    results: projects,
    previous: prev_page,
    next: next_page,
  } = props.projects.all_projects;
  const { hero } = props.projects;
  const staff_picks = props.projects.staff_picks;
  const { t } = props;

  if (loading) {
    return <LoadingPage />;
  } else if (projects && projects.length >= 0) {
    return (
      <>
      {props.auth.username ? (props.history.push('/projects')) : ''}
        {projects.length > 0 ?
          (
            <Box className={classes.root}>
              {hero && hero.id ? (
                 <Box className={classes.heroSectionStyle}>
                 <Box className={classes.heroContainerStyle}>
                   {state.isMobileView && hero && hero.id && (
                     <Box className={classes.heroImageContainerStyle}>
                       <img
                         className={classes.heroImageStyle}
                         src={hero.image_url}
                         alt=""
                       />
                     </Box>
                   )}
                   <Box className={classes.heroMessageContainerStyle}>
                     <br />
                     <Typography className={classes.heroMessageSecondaryStyle}>
                       {t('projects.1')} <span className={classes.heroMessageSpanStyle}> {t('projects.2')}</span>
                     </Typography>
                     <br />
                     <Typography className={classes.heroMessagePrimaryStyle}>
                       {hero.description}
                     </Typography>
                     <br />
                     <CustomButton
                       className={classes.heroButtonStyle}
                       size="small"
                       primaryButtonStyle
                       onClick={() => props.history.push('/login')}
                     >
                       {t('projects.shareProject')}
                     </CustomButton>
                   </Box>
                   {!state.isMobileView && hero && hero.id && (
                     <Box className={classes.heroImageContainerStyle}> 
                       <img
                         className={classes.heroImageStyle}
                         src={hero.image_url}
                         alt=""
                       />
                     </Box>
                   )}
                 </Box>
               </Box>
              ) : null}
            
          <Box className={classes.mainContainerStyle}>
            {staff_picks &&
              staff_picks.map(staff_pick => (
                <StaffPick
                  key={staff_pick.id}
                  staff_pick={staff_pick}
                  updateProjects={res =>
                    handleSetState(
                      updateStaffPicks(res, staff_pick.id, props, toast),
                    )
                  }
                  {...props}
                />
              ))}
              <CustomButton
                  className={classes.heroBtnStyle}
                  size="small"
                  primaryButtonStyle
                  onClick={() => props.history.push('/login')}
                >
                  {t('projects.login')}
              </CustomButton>

          </Box>
            </Box>
          ) : (
            <Box className={classes.root}>
              <Container className={classes.welcomeContainerStyle}>
                <img
                  className={classes.welcomeStyle}
                  src={hikingIcon}
                  alt={'Create project'}
                />
                <Box className={classes.welcomeBoxStyle}>
                  <Typography variant="h1">{t('projects.welcome')}!</Typography>
                  <Typography variant="h5">{t('projects.errors.noProject')}</Typography>
                  <Box>
                    <CustomButton
                      className={classes.heroButtonStyle}
                      size="small"
                      primaryButtonStyle
                      onClick={() => props.history.push('/projects/create')}
                    >
                      {t('projects.createProject')}
                    </CustomButton>
                    <a
                      className={common_classes.textDecorationNone}
                      href={
                        hero.explore_ideas_url
                          ? hero.explore_ideas_url
                          : 'https://kriti.unstructured.studio/'
                      }
                      target="__blank"
                      rel="noreferrer"
                    >
                      <CustomButton
                        className={classes.heroButtonStyle}
                        size="small"
                        darkDangerButtonStyle
                      >
                        {t('projects.exploreIdeas')}
                      </CustomButton>
                    </a>
                  </Box>
                </Box>
              </Container>
            </Box>
          )}
          
          <Box className={classes.SectionStyle}>
                  <Box className={classes.heroContainerStyle}>
                  {state.isMobileView ? '' :(
                  <Box
                      className={clsx(classes.desktopambassadorImageStyle, {
                        [common_classes.displayNone]: !hero.activity_url,
                      })}
                      style={{ marginTop: state.isMobileView ? '0' : '2em' }}
                    >
                        <img
                          className={classes.desktopambassadorImageStyle}
                          src={child}
                          alt=""
                        />
                    </Box>)}
                    <Box className={classes.MessageContainerStyle} style={{ marginLeft: state.isMobileView ? '0' : '15em' }}>
                    <br/><Typography className={classes.MessagePrimaryStyle}>
                        {t('projects.child.title')}
                      </Typography><br/><br/>
                      <Typography className={classes.MessageSecondaryStyle}>
                      <CheckIcon style={{ color: '#00B8C4' }}/>  {t('projects.child.1')}
                      </Typography><br/>
                      <Typography className={classes.MessageSecondaryStyle}>
                      <CheckIcon style={{ color: '#00B8C4' }}/>  {t('projects.child.2')}
                      </Typography><br/>
                      <Typography className={classes.MessageSecondaryStyle}>
                      <CheckIcon style={{ color: '#00B8C4' }}/>  {t('projects.child.3')}
                      </Typography><br/>
                      <CustomButton
                        className={classes.heroButtonStyle}
                        size="small"
                        primaryButtonStyle
                        onClick={() => props.history.push('/ambassadors')}
                      >
                        {t('projects.zubhubAmbassadors')}
                      </CustomButton>
                    </Box>
                    {state.isMobileView ? (
                  <Box
                      className={clsx(classes.ambassadorImageStyle, {
                        [common_classes.displayNone]: !hero.activity_url,
                      })}
                    >
                        <img
                          className={classes.ambassadorImageStyle}
                          src={child}
                          alt=""
                        />
                    </Box>):''}
                  </Box>
                </Box>

          <Box className={classes.SectionStyle}>
            <Box className={classes.heroContainerStyle}>
              <Box className={classes.MessageContainerStyle}>
              <br/><Typography className={classes.MessagePrimaryStyle}>
                  {t('projects.teams.title')}
                </Typography><br></br>
                <Typography className={classes.MessageSecondaryStyle}>
                {t('projects.teams.1')}
                </Typography><br/>
                <Typography className={classes.MessageSecondaryStyle}>
                {t('projects.teams.2')}
                </Typography>
                <CustomButton
                  className={classes.heroButtonStyle}
                  size="small"
                  primaryButtonStyle
                  onClick={() => props.history.push('/signup')}
                >
                  {t('projects.teams.button')}
                </CustomButton>
              </Box>
              {state.isMobileView ? (
              <Box
                className={clsx(classes.teamsImageContainerStyle, {
                  [common_classes.displayNone]: !hero.activity_url,
                })}
                style={{ marginTop: state.isMobileView ? '0' : '4em' }}
              >
                  <img
                    className={classes.teamsImageStyle}
                    src={teams}
                    alt=""
                  />
              </Box>): (
              <Box
                className={clsx(classes.teamsImageContainerStyle, {
                  [common_classes.displayNone]: !hero.activity_url,
                })}
                style={{ marginTop: state.isMobileView ? '0' : '4em' }}
              >
                  <img
                    className={classes.desktopteamsImageStyle}
                    src={teams}
                    alt=""
                  />
              </Box>)}
            </Box>
          </Box>

          <Box
      className={clsx(classes.heroSectionStyle, classes.centerCarousel)}
      style={{
        backgroundColor: activeSlide === 1 ? '#00B8C4' : activeSlide === 2 ? '#292535' : '#DC3545', // Replace 'default-color' with your actual default background color
      }}
    >
            <div className={classes.carouselContainer}>
              <Carousel showThumbs={false} infiniteLoop={true} showStatus={false} onChange={handleSlideChange}>
                <div className={classes.carouselSlide}>
                  <Box className={classes.heroContainerStyle}>
                    <Box className={classes.heroMessageContainerStyle} style={{ textAlign: 'left' }}>
                      <Typography
                        className={classes.MessagePrimaryStyle}
                      >
                        {t('projects.reviews.title')}
                      </Typography>
                      <Typography className={classes.heroMessageSecondaryStyle}>
                        {t('projects.reviews.1.review')}
                      </Typography>
                      <Typography className={classes.heroMessagePrimaryStyle}>
                        {t('projects.reviews.1.name')}
                      </Typography>
                      <Typography className={classes.MessageSecondaryStyle}>
                        {t('projects.reviews.1.designation')}
                      </Typography>
                    </Box>
                    <Box
                      className={clsx(classes.heroImageContainerStyle, {
                        [common_classes.displayNone]: !hero.activity_url,
                      })}
                    >
                      <img
                        className={classes.reviewImageStyle}
                        src={review1}
                        alt=""
                        style={{ width: '200px', height: '200px', borderRadius: '50%', border: '6px solid white', }}
                      />
                    </Box>
                  </Box>
                </div>
                <div className={classes.carouselSlide} style={{ backgroundColor: '#00B8C4' }}>  
                <Box className={classes.heroContainerStyle}>
                    <Box className={classes.heroMessageContainerStyle} style={{ textAlign: 'left' }}>
                      <Typography
                        className={classes.MessagePrimaryStyle}
                      >
                        {t('projects.reviews.title')}
                      </Typography>
                      <Typography className={classes.heroMessageSecondaryStyle}>
                        {t('projects.reviews.2.review')}
                      </Typography>
                      <Typography className={classes.heroMessagePrimaryStyle}>
                        {t('projects.reviews.2.name')}
                      </Typography>
                      <Typography className={classes.MessageSecondaryStyle}>
                        {t('projects.reviews.2.designation')}
                      </Typography>
                    </Box>
                    <Box
                      className={clsx(classes.heroImageContainerStyle, {
                        [common_classes.displayNone]: !hero.activity_url,
                      })}
                    >
                      <img
                        className={classes.reviewImageStyle}
                        src={review2}
                        alt=""
                        style={{ width: '200px', height: '200px', borderRadius: '50%', border: '6px solid white',  }}
                      />
                    </Box>
                  </Box>  
                </div>
                <div className={classes.carouselSlide} style={{ backgroundColor: '#292535' }}>  
                <Box className={classes.heroContainerStyle}>
                    <Box className={classes.heroMessageContainerStyle} style={{ textAlign: 'left' }}>
                      <Typography
                        className={classes.MessagePrimaryStyle}
                      >
                        {t('projects.reviews.title')}
                      </Typography>
                      <Typography className={classes.heroMessageSecondaryStyle}>
                        {t('projects.reviews.3.review')}
                      </Typography>
                      <Typography className={classes.heroMessagePrimaryStyle}>
                        {t('projects.reviews.3.name')}
                      </Typography>
                      <Typography className={classes.MessageSecondaryStyle}>
                        {t('projects.reviews.3.designation')}
                      </Typography>
                    </Box>
                    <Box
                      className={clsx(classes.heroImageContainerStyle, {
                        [common_classes.displayNone]: !hero.activity_url,
                      })}
                    >
                      <img
                        className={classes.reviewImageStyle}
                        src={review3}
                        alt=""
                        style={{ width: '200px', height: '200px', borderRadius: '50%', border: '6px solid white',  }}
                      />
                    </Box>
                  </Box>  
                </div>
              </Carousel>
            </div>
          </Box>



          <Box className={classes.SectionStyle}>
            <Box className={classes.heroContainerStyle}>
              <Box className={classes.MessageContainerStyle}>
              <br/><Typography className={classes.MessagePrimaryStyle}>
                  {t('projects.global.title')}
                </Typography><br></br>
                <Typography className={classes.MessageSecondaryStyle}>
                {t('projects.global.body')}
                </Typography><br/>
                <Typography className={classes.MessageSecondaryStyle}>
                {t('projects.global.body2')}
                </Typography>
                <CustomButton
                  className={classes.heroButtonStyle}
                  size="small"
                  primaryButtonStyle
                  onClick={() => props.history.push('/signup')}
                >
                  {t('projects.global.button')}
                </CustomButton>
                
                <CustomButton
                  className={classes.heroButtonStyle}
                  variant="outlined"
                  size="small"
                  secondaryButtonStyle
                  onClick={() => props.history.push('/login')}
                >
                  {t('projects.global.button2')}
                </CustomButton>
              </Box>
              <Box
                className={clsx(classes.heroImageContainerStyle, {
                  [common_classes.displayNone]: !hero.activity_url,
                })}
              >
                  <img
                    className={classes.globalImageStyle}
                    src={global}
                    alt=""
                  />
              </Box>
            </Box>
          </Box>
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

const mapStateToProps = state => {
  return {
    auth: state.auth,
    projects: state.projects,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getProjects: page => {
      return dispatch(ProjectActions.getProjects(page));
    },
    setProjects: args => {
      return dispatch(ProjectActions.setProjects(args));
    },
    toggleLike: args => {
      return dispatch(ProjectActions.toggleLike(args));
    },
    toggleSave: args => {
      return dispatch(ProjectActions.toggleSave(args));
    },
    getStaffPicks: args => {
      return dispatch(ProjectActions.getStaffPicks(args));
    },
    setStaffPicks: args => {
      return dispatch(ProjectActions.setStaffPicks(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
