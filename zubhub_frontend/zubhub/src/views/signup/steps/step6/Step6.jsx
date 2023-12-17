import {
  Box,
  Grid,
  FormControl,
  FormLabel,
  OutlinedInput,
  Button,
  InputAdornment,
  Typography,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { SlPhone, SlEnvolope } from 'react-icons/sl';
import { TfiArrowLeft } from 'react-icons/tfi';
import { CustomErrorMessage } from '../../../../components';

const Step2 = props => {
  return (
    <Box>
      <Grid container direction="column">
        <Grid>
          <TfiArrowLeft />
        </Grid>
        <Grid>
          <Typography>Parents or Guardian Details</Typography>
        </Grid>
        <Grid>
          <FormControl>
            <FormLabel>Parent Email</FormLabel>
            <OutlinedInput
              placeholder="Enter parent's email address"
              startAdornment={
                <InputAdornment>
                  <SlEnvolope />
                </InputAdornment>
              }
            />
            <CustomErrorMessage name="parent-email" {...props} />
          </FormControl>
        </Grid>
        <Grid>
          <Typography>OR</Typography>
        </Grid>
        <Grid>
          <FormControl>
            <FormLabel>Parent's phone number</FormLabel>
            <OutlinedInput
              placeholder="Enter parent's phone number"
              startAdornment={
                <InputAdornment>
                  <SlPhone />
                </InputAdornment>
              }
            />
            <CustomErrorMessage name="parent-number" {...props} />
          </FormControl>
        </Grid>
        <Grid>
          <FormControl>
            <FormControlLabel label="Send me personalised recommendations and learning tips." control={<Checkbox />} />
          </FormControl>
        </Grid>
        <Grid>
          <Button>Create Your Account</Button>
        </Grid>
        <Grid>
          <Typography>By signing up you agree to our Terms and Services and Privacy Policy</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Step2;
