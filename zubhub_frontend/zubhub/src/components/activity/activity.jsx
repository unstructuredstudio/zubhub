import classNames from 'classnames'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {style} from '../../assets/js/styles/components/activity/activityStyle'
import ProjectsCountIcon from '../../assets/js/icons/projectsCountIcon'
import { Card, CardActions, CardContent, CardMedia, Typography, Box} from '@material-ui/core';
import commonStyles from '../../assets/js/styles';

const useCommonStyles = makeStyles(commonStyles);
const useStyles = makeStyles(style);

function Activity(props) {
    const {title,demoImage,projectsCount,creatorImage, tags} = {...props}
    const classes = useStyles()
    const common_classes = useCommonStyles()
  return (
    <div>
      <Card className={classes.activityCard}>
        <CardMedia title={ title } className={classes.mediaBoxStyle}>
          <img src={demoImage} alt='demo' className={classes.activityCardImage} />
          <Box className={classes.activityTagsBox}>
            {tags.length >0? tags.map(tag => (
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
                {title}
              </Typography>
              <Typography
                component="h6"
                className={classes.projectsCount}
              >
                <ProjectsCountIcon />
                {projectsCount}
              </Typography>
            </Box>
            
          </CardContent>
        </CardActions>
      </Card>
    </div>
  )
}

export default Activity