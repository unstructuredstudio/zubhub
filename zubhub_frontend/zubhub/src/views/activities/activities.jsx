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
  CardMedia, 
} from '@material-ui/core';
import { useState } from 'react';
const useStyles = makeStyles(styles);

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


  const StyledSlider = styled(Slider)
   `
  .slick-next {
    top: 30%;
  } 
  .slick-prev {
    top: 30%;
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

  return (<div>
          <div className={classes.bannerContainerStyle}>

            <Box className={classes.sliderBoxStyle}>
             <StyledSlider {...sliderSettings(3,activeSlide)} >
               {activities? 
               activities.map((activity,index) => (
                  index === activeCarouselIndex ?  
                  <div className={classes.activeSlideContainer}>
                    <iframe
                          id={activity.id}
                          className={classes.activeCarouselVideo}
                          
                          src={activity.video+`?autoplay=1&muted=1`}
                          allow='autoplay; encrypted-media'
                        /> 
                        </div>: 
                    <div className={classes.slideContainer}>    
                    <img
                          id={activity.id}
                          className={classes.sliderVideo}
                          
                          src={activity.demoImage}
                        /> </div>      
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