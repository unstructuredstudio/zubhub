import classNames from 'classnames'
import React from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {style} from '../../assets/js/styles/components/activity/activityStyle'
import ProjectsCountIcon from '../../assets/js/icons/projectsCountIcon'
import { Card, CardActions, CardContent, CardMedia, Typography, Box} from '@material-ui/core';
import commonStyles from '../../assets/js/styles';

const useCommonStyles = makeStyles(commonStyles);
const useStyles = makeStyles(style);

function Activity(props) {
    const {activity} = {...props}
    const classes = useStyles()
    const common_classes = useCommonStyles()
  return (
    <div className={classes.activityCardContainer}>
       <Box  className={classes.activityCreatorImageBox}> 
              <Link to={`/creators/${activity.creator.username}`}
                className={classes.textDecorationNone}
                >  
                <img 
                  className={classes.activityCreatorImage}
                  src={activity.creator.image} 
                  alt='creator'
                  />
              </Link>  
            </Box>
      <Card className={classes.activityCard}>
         
        <CardMedia title={ activity.title } className={classes.mediaBoxStyle}>
          <img src={activity.demoImage} alt='demo' className={classes.activityCardImage} />
          
          <Box className={classes.activityTagsBox}>
            {activity.tags.length >0? activity.tags.map(tag => (
          <Typography 
            className={common_classes.baseTagStyle+' '+ classes.activityTagPill}
            key={tag.id}
            >
             {tag.name}
          </Typography>
         )) : ''}
          </Box>
         
        </CardMedia>
        <CardActions>
          <CardContent
            className={classes.activityCardContent}
          >
            <Box 
              className={classes.activityCardInfoBox}
            >
              <Typography
                variant="h5"
                component="h4"
                className={classes.activityTitle}
              >
                {activity.title}
              </Typography>
              <Typography
                component="h6"
                className={classes.projectsCount}
              >
                <ProjectsCountIcon />
                {activity.projectsCount}
              </Typography>
            </Box>
            
          </CardContent>
        </CardActions>
      </Card>
    </div>
  )
}

Activity.propTypes = {
  activity: PropTypes.object.isRequired,
};

export default Activity