import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { toast } from 'react-toastify';

import { makeStyles } from '@material-ui/core/styles';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Grid, Box, ButtonGroup, Typography } from '@material-ui/core';

import {
  fetchHero,
  fetchPage,
  fetchStaffPicks,
  updateProjects,
  updateStaffPicks,
} from './projectsScripts';

import * as ProjectActions from '../../store/actions/projectActions';
import CustomButton from '../../components/button/Button';
import ErrorPage from '../error/ErrorPage';
import LoadingPage from '../loading/LoadingPage';
import Project from '../../components/project/Project';
import StaffPick from '../../components/staff_pick/StaffPick';
import activity_of_the_month_svg from '../../assets/images/activity_of_the_month.svg';
import activity_of_the_month_small_svg from '../../assets/images/activity_of_the_month_small.svg';
import styles from '../../assets/js/styles/views/projects/projectsStyles';
import commonStyles from '../../assets/js/styles';

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
  });


  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { loading } = state;
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
  } else if (projects && projects.length > 0) {
    return (
      <Box className={classes.root}>
        {hero && hero.id ? (
          <Box className={classes.heroSectionStyle}>
            <Box className={classes.heroContainerStyle}>
              <Box className={classes.heroMessageContainerStyle}>
                <Typography className={classes.heroMessageSecondaryStyle}>
                  {hero.description}
                </Typography>
                <Typography className={classes.heroMessagePrimaryStyle}>
                  {hero.title}
                </Typography>
                <CustomButton
                  className={classes.heroButtonStyle}
                  size="small"
                  primaryButtonStyle
                  onClick={() => props.history.push('/projects/create')}
                >
                  {t('projects.shareProject')}
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
              <Box className={classes.heroImageContainerStyle}>
                <img
                  className={classes.heroImageTextSmallStyle}
                  src={activity_of_the_month_small_svg}
                  alt={t('projects.activityOfTheMonth')}
                />
                <img
                  className={classes.heroImageTextStyle}
                  src={activity_of_the_month_svg}
                  alt={t('projects.activityOfTheMonth')}
                />
                <a
                  className={classes.heroImageLinkStyle}
                  href={hero.activity_url}
                  target="__blank"
                  rel="noreferrer"
                >
                  <img
                    className={classes.heroImageStyle}
                    src={hero.image_url}
                    alt=""
                  />
                </a>
              </Box>
            </Box>
          </Box>
        ) : null}
        <Box className={classes.mainContainerStyle}>
          <ButtonGroup
            aria-label={t('projects.ariaLabels.prevNxtButtons')}
            className={classes.buttonGroupStyle}
          >
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
                {t('projects.prev')}
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
                {t('projects.next')}
              </CustomButton>
            ) : null}
          </ButtonGroup>
        </Box>
      </Box>
    );
  } else {
    return <ErrorPage error={t('projects.errors.unexpected')} />;
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    projects: state.projects,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
