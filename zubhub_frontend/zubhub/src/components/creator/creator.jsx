import React from 'react'
import { Link } from 'react-router-dom';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { style } from '../../assets/js/styles/components/activity/activityStyle'

const useStyles = makeStyles(style);

function Creator(props) {
  const {creator, top} = props 
  const classes = useStyles()
  return (
    <Box  className={classes.activityCreatorImageBox} style={{top: top}}> 
              <Link to={`/creators/${creator.username}`}
                className={classes.textDecorationNone}
                >  
                <img 
                  className={classes.activityCreatorImage}
                  src={creator.image} 
                  alt='creator'
                  />
              </Link>
            </Box>
  )
}

export default Creator