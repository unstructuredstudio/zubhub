import React from 'react';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { FaUserGraduate, FaChalkboardUser } from 'react-icons/fa6';
import { makeStyles } from '@mui/styles';
import { step1Styles } from '../../signupStyles';

const useStyles = makeStyles(step1Styles);

const Step1 = props => {
  const classes = useStyles();
  return (
    <Box sx={{ width: '100%' }}>
      <Grid container className={classes.gridContainer} rowSpacing={{ xs: 4, sm: 6, md: 10 }}>
        <Grid item>
          <Typography align="center" className={classes.header}>
            Welcome to ZubHub !
          </Typography>
          <Typography align="center" mt={2} className={classes.subHeader}>
            Connect with students, educators, and the ZubHub community. To get started, choose an account type.
          </Typography>
        </Grid>
        <Grid item sx={{ width: '100%' }}>
          <Grid container justifyContent="space-around">
            <Grid>
              <Paper variant="elevation" elevation={2} className={classes.paper}>
                <FaUserGraduate className={classes.icon} />
                <Typography>Creator</Typography>
                <Typography>I am a Creator, who wants to create</Typography>
              </Paper>
            </Grid>
            <Grid>
              <Paper className={classes.paper} variant="elevation" elevetion={2}>
                <FaChalkboardUser className={classes.icon} />
                <Typography>Educator</Typography>
                <Typography>I am an Educator, looking to inspire</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Button className={classes.button}>JOIN AS A CREATOR</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Step1;
