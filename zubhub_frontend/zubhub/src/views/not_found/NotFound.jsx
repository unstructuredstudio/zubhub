import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { Box, Typography, Container } from '@mui/material';
import CustomButton from '../../components/button/Button';
import brokenRobot from '../../assets/images/broken_robot.svg';
import styles from '../../assets/js/styles/views/not_found/notFoundStyles';

const useStyles = makeStyles(styles);

function NotFoundPage() {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Container className={classes.mainContainerStyle}>
        <Box className={classes.errorBoxStyle}>
          <Typography variant="h3" component={'h1'}>
            ERROR <span className={classes.boldErrorText}>404</span>
          </Typography>
          <Typography variant="h3" component={'p'}>
            Something went <span className={classes.wrongText}>WRONG!</span>
          </Typography>

          <Link to={'/'} className={classes.textDecorationNone}>
            <CustomButton variant="outlined" size="large" primaryButtonStyle customButtonStyle fullWidth>
              GO BACK TO HOMEPAGE
            </CustomButton>
          </Link>
        </Box>
        <img className={classes.errorImg} src={brokenRobot} alt="error 404" />
      </Container>
    </Box>
  );
}

export default NotFoundPage;
