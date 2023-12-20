import {
  Box,
  Grid,
  FormControl,
  FormLabel,
  OutlinedInput,
  InputAdornment,
  Typography,
  IconButton,
} from '@mui/material';
import { CustomButton, CustomErrorMessage } from '../../../../components';
import { TfiLock } from 'react-icons/tfi';
import { SlEye, SlUser } from 'react-icons/sl';
import { makeStyles } from '@mui/styles';
import { mainStyles, step2Styles } from '../../signupStyles';

const useMainStyles = makeStyles(mainStyles);
const useStyles = makeStyles(step2Styles);
const Step2 = props => {
  const classes = useStyles();
  const mainClasses = useMainStyles();
  console.log(props, 'PROPS');
  return (
    <Box width={'100%'}>
      <Grid
        container
        direction="column"
        maxWidth={'600px'}
        margin={'auto'}
        rowSpacing={{ xs: 2, sm: 3, md: 5 }}
        className={classes.container}
      >
        <Grid item>
          <Typography align="center" className={mainClasses.header2}>
            Welcome to ZubHub !
          </Typography>
          <Typography align="center" className={mainClasses.text2}>
            Create projects, share ideas, make friends. It’s free{' '}
          </Typography>
        </Grid>
        <Grid item>
          <FormControl fullWidth className={mainClasses.formControl}>
            <FormLabel className={mainClasses.subHeader2}>Username</FormLabel>
            <OutlinedInput
              placeholder="Enter a username"
              className={mainClasses.outlinedInput}
              startAdornment={
                <InputAdornment>
                  <SlUser className={mainClasses.inputIcon} />
                </InputAdornment>
              }
            />
            <CustomErrorMessage name="username" {...props} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl fullWidth className={mainClasses.formControl}>
            <FormLabel className={mainClasses.subHeader2}>Password</FormLabel>
            <OutlinedInput
              placeholder="Enter your password"
              className={mainClasses.outlinedInput}
              startAdornment={
                <InputAdornment>
                  <TfiLock className={mainClasses.inputIcon} />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment>
                  <IconButton>
                    <SlEye className={mainClasses.inputIcon} />
                  </IconButton>
                </InputAdornment>
              }
            />
            <CustomErrorMessage name="password" {...props} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl fullWidth className={mainClasses.formControl}>
            <FormLabel className={mainClasses.subHeader2}>Confirm Password</FormLabel>
            <OutlinedInput
              placeholder="Enter password again"
              className={mainClasses.outlinedInput}
              startAdornment={
                <InputAdornment>
                  <TfiLock className={mainClasses.inputIcon} />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment>
                  <IconButton>
                    <SlEye className={mainClasses.inputIcon} />
                  </IconButton>
                </InputAdornment>
              }
            />
            <CustomErrorMessage name="confirmPassword" {...props} />
          </FormControl>
        </Grid>
        <Grid item>
          <CustomButton className={mainClasses.button} primaryButtonStyle fullWidth>
            NEXT
          </CustomButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Step2;
