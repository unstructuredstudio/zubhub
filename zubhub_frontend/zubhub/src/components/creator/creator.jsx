import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { style } from '../../assets/js/styles/components/creator/creatorStyle';

const useStyles = makeStyles(style);

function Creator(props) {
  const { creator, top } = props;
  console.log('creator of activity', creator);
  const classes = useStyles();
  return (
    <Box className={classes.creatorImageBox} style={{ top: top }}>
      <Link
        to={`/creators/${creator.username}`}
      >
        <img
          className={classes.creatorImage}
          src={creator.avatar}
          alt={creator.username}
        />
      </Link>
    </Box>
  );
}

export default Creator;
