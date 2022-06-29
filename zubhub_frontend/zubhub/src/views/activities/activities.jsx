import React,{useEffect} from 'react'
import {connect} from 'react-redux'
import {getActivities} from '../../store/actions/activityActions'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles, {
  sliderSettings,
} from '../../assets/js/styles/views/activities/activitiesStyles';
import { makeStyles } from '@material-ui/core/styles';
import styled from "styled-components"
import {
  Box,
} from '@material-ui/core';
import { useState } from 'react';
const useStyles = makeStyles(styles);

 const StyledSlider = styled(Slider)
   `
  .slick-next {
    top: 16vh!important;
  } 
  .slick-prev {
    top: 16vh!important;
  }
  .slick-list {
    padding: 0 !important;
  }
  .slick-slider {
    padding-top: 0 !important;
    maxHeight: 40vh;
  }
  .slick-slide {
    margin: 0 5px;
  }
 `;

function Activities(props) {
   const classes = useStyles();
   const activities = props.activities.all_activities
   const [activeCarouselIndex,setActiveCarouselIndex] = useState(0)
   useEffect(() => {
     props.getActivities()
   }, [])
  const activeSlide = (currentSlide) =>{
    setActiveCarouselIndex(currentSlide)
  } 

  return (<div>
          <div className={classes.bannerContainer}>

            <Box className={classes.sliderBox}>
             <StyledSlider {...sliderSettings(3,activeSlide)} >
               {activities? 
               activities.map((activity,index) => (
                  index === activeCarouselIndex ?  
                  <div className={classes.activeSlideContainer}>
                    <iframe
                          id={activity.id}
                          className={classes.activeCarouselVideo}
                          
                          src={activity.video+`?autoplay=1&mute=1`}
                          allow='autoplay; encrypted-media'
                        /> 
                        </div>: 
                    <div className={classes.slideContainer}>    
                    <iframe
                          id={activity.id}
                          className={classes.sliderVideo}
                          src={activity.video}
                        />
                    </div>      
               ))
              :'No activities created yet!!'}
             </StyledSlider></Box> 
             
            </div>
           
             {activities? 
               activities.map(activity => (
                <h2>{activity.title}</h2>
               ))
              :'No activities created yet!!'}
           </div>
  )
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
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Activities);