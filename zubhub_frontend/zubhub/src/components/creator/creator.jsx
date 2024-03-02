import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { style } from '../../assets/js/styles/components/creator/creatorStyle';

const useStyles = makeStyles(style);

function Creator(props) {
  const { creator, top } = props;

  const classes = useStyles();
  return (
    <Box className={classes.creatorImageBox} style={{ top: top }}>
      <Link to={`/creators/${creator.username}`}>
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
