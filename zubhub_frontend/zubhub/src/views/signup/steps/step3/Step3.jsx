// import { ArrowBackOutlined, LocationOnOutlined } from '@mui/icons-material';
import { TfiLocationPin, TfiArrowLeft } from 'react-icons/tfi';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { CustomErrorMessage } from '../../../../components';

const Step3 = props => {
  return (
    <Box>
      <Grid container direction="column">
        <Grid>
          <TfiArrowLeft />
          <Grid>Image background</Grid>
        </Grid>
        <Grid>
          <Typography>What country do you live in?</Typography>
        </Grid>
        <Grid>
          <FormControl>
            <InputLabel>Select a location</InputLabel>
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
          <Button>Next</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Step3;
