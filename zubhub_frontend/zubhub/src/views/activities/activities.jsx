import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getActivities } from '../../store/actions/activityActions';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Activity from '../../components/activity/activity';
import styles, {
  sliderSettings,
} from '../../assets/js/styles/views/activities/activitiesStyles';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import { Grid, Box } from '@material-ui/core';
import { useState } from 'react';
const useStyles = makeStyles(styles);

const StyledSlider = styled(Slider)`
  .slick-next {
    top: 16vh !important;
  }
  .slick-prev {
    top: 16vh !important;
  }
  .slick-list {
    padding: 0 !important;
  }
  .slick-slider {
    padding-top: 0 !important;
    maxheight: 40vh;
  }
  .slick-slide {
    margin: 0 5px;
  }
`;

function Activities(props) {
  const classes = useStyles();
  const activities = props.activities.all_activities;
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  useEffect(() => {
    props.getActivities();
  }, []);
  const activeSlide = currentSlide => {
    setActiveCarouselIndex(currentSlide);
  };

  return (
    <div>
      <div className={classes.bannerContainer}>
        <Box className={classes.sliderBox}>
          <StyledSlider {...sliderSettings(3, activeSlide)}>
            {activities
              ? activities.map((activity, index) =>
                  index === activeCarouselIndex ? (
                    <div className={classes.activeSlideContainer}>
                      <iframe
                        id={activity.id}
                        className={classes.activeCarouselVideo}
                        src={activity.video + `?autoplay=1&mute=1`}
                        allow="autoplay; encrypted-media"
                      />
                    </div>
                  ) : (
                    <div className={classes.slideContainer}>
                      <iframe
                        id={activity.id}
                        className={classes.sliderVideo}
                        src={activity.video}
                      />
                    </div>
                  ),
                )
              : 'No activities created yet!!'}
          </StyledSlider>
        </Box>
      </div>

      <Grid container className={classes.activityListContainer}>
        {activities.map(activity => (
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            align="center"
            className={classes.activityBoxContainer}
          >
            <Activity activity={activity} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    activities: state.activities,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getActivities: () => {
      return dispatch(getActivities());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Activities);
