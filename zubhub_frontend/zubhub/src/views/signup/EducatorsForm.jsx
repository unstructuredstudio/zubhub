import {
  Box,
  Grid,
  FormControl,
  FormLabel,
  OutlinedInput,
  Button,
  InputAdornment,
  Typography,
  MenuItem,
  Select,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { VisibilityOutlined } from '@mui/icons-material';
import { CustomErrorMessage } from '../../components';
import { SlEnvolope, SlUser } from 'react-icons/sl';
import { TfiLocationPin, TfiLock } from 'react-icons/tfi';

const EducatorsForm = props => {
  return (
    <Box>
      <Grid container direction="column">
        <Grid>
          <Typography>Welcome to ZubHub !</Typography>
          <Typography>Create projects, share ideas, make friends. It’s free </Typography>
        </Grid>
        <Grid>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <OutlinedInput
              placeholder="Enter a username"
              startAdornment={
                <InputAdornment>
                  <SlUser />
                </InputAdornment>
              }
            />
            <CustomErrorMessage name="username" {...props} />
          </FormControl>
        </Grid>
        <Grid>
          <FormControl>
            <FormLabel>Email Address</FormLabel>
            <OutlinedInput
              placeholder="Enter email address"
              startAdornment={
                <InputAdornment>
                  <SlEnvolope />
                </InputAdornment>
              }
            />
            <CustomErrorMessage name="email" {...props} />
          </FormControl>
        </Grid>
        <Grid>
          <FormControl>
            <FormLabel>Select a location</FormLabel>
            <Select
              name="location"
              startAdornment={
                <InputAdornment>
                  <TfiLocationPin />
                </InputAdornment>
              }
            >
              <MenuItem>None</MenuItem>
            </Select>
            <CustomErrorMessage name="location" {...props} />
          </FormControl>
        </Grid>
        <Grid>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <OutlinedInput
              placeholder="Enter password"
              startAdornment={
                <InputAdornment>
                  <TfiLock />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment>
                  <VisibilityOutlined />
                </InputAdornment>
              }
            />
            <CustomErrorMessage name="password" {...props} />
          </FormControl>
        </Grid>
        <Grid>
          <FormControl>
            <FormLabel>Confirm Password</FormLabel>
            <OutlinedInput
              placeholder="Enter password again"
              startAdornment={
                <InputAdornment>
                  <TfiLock />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment>
                  <VisibilityOutlined />
                </InputAdornment>
              }
            />
            <CustomErrorMessage name="confirmPassword" {...props} />
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

export default EducatorsForm;
