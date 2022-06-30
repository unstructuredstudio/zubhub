import classNames from 'classnames'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {style} from '../../assets/js/styles/components/activity/activityStyle'
import { Card, CardActions, CardContent, CardMedia, Typography} from '@material-ui/core';
const useStyles = makeStyles(style);
function Activity(props) {
    const {title,demoImage} = {...props}
    const classes = useStyles()
  return (
    <div>
      <Card className={classes.activityCard}>
        <CardMedia title={ title } className={classes.mediaBoxStyle}>
          <img src={demoImage} alt='demo' className={classes.activityCardImage} />
        </CardMedia>
        <CardActions>
          <CardContent>
             <Typography
              variant="h5"
              component="h2"
             >
              {title}
            </Typography>
            <i className="fa-solid fa-diagram-project"></i>
          </CardContent>
        </CardActions>
      </Card>
    </div>
  )
}

export default Activity