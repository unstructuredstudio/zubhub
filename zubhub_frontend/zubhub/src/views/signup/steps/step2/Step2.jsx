import { Box, Grid, FormControl, FormLabel, OutlinedInput, Button, InputAdornment, Typography } from '@mui/material';
import { LockOutlined, PersonOutlined, VisibilityOutlined } from '@mui/icons-material';
import { CustomErrorMessage } from '../../../../components';

const Step2 = props => {
  console.log(props, 'PROPS');
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
                  <PersonOutlined />
                </InputAdornment>
              }
            />
            <CustomErrorMessage name="username" {...props} />
          </FormControl>
        </Grid>
        <Grid>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <OutlinedInput
              placeholder="Enter your password"
              startAdornment={
                <InputAdornment>
                  <LockOutlined />
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
                  <LockOutlined />
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
          <Button>Next</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Step2;
