import { Box, FormControl, Grid, Typography, IconButton } from '@mui/material';
import { CustomErrorMessage, CustomButton } from '../../../../components';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TfiArrowLeft } from 'react-icons/tfi';
import CreamBackground from '../../../../assets/images/cream.png';
import { makeStyles } from '@mui/styles';
import { mainStyles, step4Styles } from '../../signupStyles';

const useMainStyles = makeStyles(mainStyles);
const useStyles = makeStyles(step4Styles);

const Step4 = props => {
  const mainClasses = useMainStyles();
  const classes = useStyles();
  return (
    <Box width="100%">
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        maxWidth="600px"
        margin="0 auto"
        rowSpacing={{ xs: 2, sm: 3, md: 5 }}
      >
        <Grid item>
          <Grid>
            <div style={{ position: 'absolute', marginLeft: '40px', marginTop: '40px' }}>
              <IconButton className={mainClasses.backContainer}>
                <TfiArrowLeft className={mainClasses.backIcon} />
              </IconButton>
            </div>
          </Grid>
          <Grid>
            <img src={CreamBackground} alt="" className={mainClasses.spaceBackground} />
          </Grid>
        </Grid>
        <Grid
          item
          container
          direction="column"
          alignItems="center"
          rowSpacing={{ xs: 2, sm: 3, md: 5 }}
          className={mainClasses.gridControl}
        >
          <Grid item>
            <Typography maxWidth="342px" align="center" className={mainClasses.header2}>
              When were you born?
            </Typography>
          </Grid>
          <Grid item width="100%">
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker slotProps={{ textField: { name: 'dateOfBirth', placeholder: 'dd/mm/yyyy' } }} />
              </LocalizationProvider>
              <CustomErrorMessage name="dateOfBirth" {...props} />
            </FormControl>
          </Grid>
          <Grid item width="100%">
            <CustomButton primaryButtonStyle fullWidth className={mainClasses.button}>
              Next
            </CustomButton>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Step4;
