import { ArrowBackOutlined } from '@mui/icons-material';
import { Box, Button, FormControl, FormControlLabel, Grid, Radio, Typography } from '@mui/material';
import { CustomErrorMessage } from '../../../../components';

const Step5 = props => {
  return (
    <Box>
      <Grid container direction="column">
        <Grid container direction="column">
          <Grid>
            <ArrowBackOutlined />
          </Grid>
          <Grid>
            <Typography>What’s your gender?</Typography>
            <Typography>ZubHub welcomes people of all genders.</Typography>
          </Grid>
        </Grid>
        <Grid>
          <Typography>What country do you live in?</Typography>
        </Grid>
        <Grid>
          <FormControl>
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
            <FormControlLabel value="unspecified" control={<Radio />} label="Prefer not to say" />
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

export default Step5;
