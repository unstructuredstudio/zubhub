import { ArrowBackOutlined } from '@mui/icons-material';
import { Box, Button, FormControl, Grid, Typography } from '@mui/material';
import { CustomErrorMessage } from '../../../../components';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const Step4 = props => {
  return (
    <Box>
      <Grid container direction="column">
        <Grid>
          <ArrowBackOutlined />
          <Grid>Image background</Grid>
        </Grid>
        <Grid>
          <Typography>When were you born?</Typography>
        </Grid>
        <Grid>
          <FormControl>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker label="dd/mm/yyyy" />
              </DemoContainer>
            </LocalizationProvider>
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

export default Step4;
