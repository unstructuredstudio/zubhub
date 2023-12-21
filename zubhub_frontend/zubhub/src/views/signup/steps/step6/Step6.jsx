import {
  Box,
  Grid,
  FormControl,
  FormLabel,
  OutlinedInput,
  InputAdornment,
  Typography,
  FormControlLabel,
  Checkbox,
  IconButton,
} from '@mui/material';
import { SlPhone, SlEnvolope } from 'react-icons/sl';
import { TfiArrowLeft } from 'react-icons/tfi';
import { CustomErrorMessage, CustomButton } from '../../../../components';
import { makeStyles } from '@mui/styles';
import { mainStyles, step4Styles } from '../../signupStyles';

const useMainStyles = makeStyles(mainStyles);
const useStyles = makeStyles(step4Styles);

const Step6 = props => {
  const mainClasses = useMainStyles();
  return (
    <Box width={'100%'}>
      <Grid
        container
        direction="column"
        maxWidth={'600px'}
        margin={'auto'}
        rowSpacing={{ xs: 2, sm: 3, md: 5 }}
        className={mainClasses.gridControl}
        borderRadius={1}
      >
        <Grid item alignSelf={'flex-start'}>
          {/* <Grid item position="absolute">
            <IconButton className={mainClasses.backContainer}>
              <TfiArrowLeft className={mainClasses.backIcon} />
            </IconButton>
          </Grid> */}
          <Grid></Grid>
        </Grid>
        <Grid item>
          <Typography align="center" className={mainClasses.header2}>
            Parents or Guardian Details
          </Typography>
        </Grid>
        <Grid item>
          <FormControl fullWidth className={mainClasses.formControl}>
            <FormLabel className={mainClasses.subHeader2}>Parent's Emaol</FormLabel>
            <OutlinedInput
              placeholder="Enter parent's email address"
              className={mainClasses.outlinedInput}
              startAdornment={
                <InputAdornment>
                  <SlEnvolope className={mainClasses.inputIcon} />
                </InputAdornment>
              }
            />
            <CustomErrorMessage name="parent-email" {...props} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl fullWidth className={mainClasses.formControl}>
            <FormLabel className={mainClasses.subHeader2}>Parent's Phone number</FormLabel>
            <OutlinedInput
              placeholder="Enter parent's phone number"
              className={mainClasses.outlinedInput}
              startAdornment={
                <InputAdornment>
                  <SlPhone className={mainClasses.inputIcon} />
                </InputAdornment>
              }
            />
            <CustomErrorMessage name="parent-phone" {...props} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl>
            <FormControlLabel label="Send me personalised recommendations and learning tips." control={<Checkbox />} />
          </FormControl>
        </Grid>
        <Grid item>
          <CustomButton className={mainClasses.button} primaryButtonStyle fullWidth>
            Create Your Account
          </CustomButton>
        </Grid>
        <Grid item>
          <Typography align="center">By signing up you agree to our Terms and Services and Privacy Policy</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Step6;
