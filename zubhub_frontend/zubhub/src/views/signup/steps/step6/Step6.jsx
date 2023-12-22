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
  const { errors, handleChange, handleBlur, goAction, touched, handleSubmit } = props;

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
        <Grid alignSelf="flex-start">
          <IconButton onClick={() => goAction('prev', false)} className={mainClasses.backContainer}>
            <TfiArrowLeft className={mainClasses.backIcon} />
          </IconButton>
        </Grid>
        <Grid item>
          <Typography align="center" className={mainClasses.header2}>
            Parents or Guardian Details
          </Typography>
        </Grid>
        <Grid item>
          <FormControl
            fullWidth
            className={mainClasses.formControl}
            error={touched['parentEmail'] && errors['parentEmail']}
          >
            <FormLabel className={mainClasses.subHeader2}>Parent's Emaol</FormLabel>
            <OutlinedInput
              name="parentEmail"
              id="parentEmail"
              placeholder="Enter parent's email address"
              className={mainClasses.outlinedInput}
              onChange={handleChange}
              onBlur={handleBlur}
              startAdornment={
                <InputAdornment>
                  <SlEnvolope className={mainClasses.inputIcon} />
                </InputAdornment>
              }
            />
            <CustomErrorMessage name="parentEmail" {...props} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl
            fullWidth
            className={mainClasses.formControl}
            error={touched['parentPhone'] && errors['parentPhone']}
          >
            <FormLabel className={mainClasses.subHeader2}>Parent's Phone number</FormLabel>
            <OutlinedInput
              name="parentPhone"
              id="parentPhone"
              placeholder="Enter parent's phone number"
              className={mainClasses.outlinedInput}
              onChange={handleChange}
              onBlur={handleBlur}
              startAdornment={
                <InputAdornment>
                  <SlPhone className={mainClasses.inputIcon} />
                </InputAdornment>
              }
            />
            <CustomErrorMessage name="parentPhone" {...props} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl>
            <FormControlLabel
              id="sendTips"
              name="sendTips"
              onChange={handleChange}
              onBlur={handleBlur}
              label="Send me personalised recommendations and learning tips."
              control={<Checkbox />}
            />
          </FormControl>
        </Grid>
        <Grid item>
          <CustomButton onClick={handleSubmit} className={mainClasses.button} primaryButtonStyle fullWidth>
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
