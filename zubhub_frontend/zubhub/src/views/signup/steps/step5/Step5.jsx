import { Box, FormControl, FormControlLabel, Grid, Radio, Typography, IconButton } from '@mui/material';
import { CustomErrorMessage, CustomButton } from '../../../../components';
import { TfiArrowLeft } from 'react-icons/tfi';
import { makeStyles } from '@mui/styles';
import { mainStyles, step5Styles } from '../../signupStyles';

const useMainStyles = makeStyles(mainStyles);
const useStyles = makeStyles(step5Styles);

const Step5 = props => {
  const mainClasses = useMainStyles();
  const classes = useStyles();
  return (
    <Box width={'100%'}>
      <Grid
        container
        direction="column"
        maxWidth={'600px'}
        margin={'0 auto'}
        rowSpacing={{ xs: 2, sm: 3, md: 5 }}
        className={mainClasses.gridControl}
        alignItems="center"
        borderRadius={1}
      >
        <Grid item alignSelf={'flex-start'}>
          <Grid>
            <div style={{ position: 'absolute', marginLeft: '40px', marginTop: '40px' }}>
              <IconButton className={mainClasses.backContainer}>
                <TfiArrowLeft className={mainClasses.backIcon} />
              </IconButton>
            </div>
          </Grid>
          <Grid></Grid>
        </Grid>
        <Grid item>
          <Typography align="center" className={mainClasses.header2}>
            What’s your gender?
          </Typography>
          <Typography align="center" className={mainClasses.text2}>
            ZubHub welcomes people of all genders.
          </Typography>
        </Grid>
        <Grid item width="100%">
          <FormControl fullWidth className={classes.formControl}>
            <Grid component="fieldset" className={classes.fieldSet}>
              <FormControlLabel className={classes.label} value="male" control={<Radio />} label="Male" />
            </Grid>
            <Grid component="fieldset" className={classes.fieldSet}>
              <FormControlLabel className={classes.label} value="female" control={<Radio />} label="Female" />
            </Grid>
            <Grid component="fieldset" className={classes.fieldSet}>
              <FormControlLabel className={classes.label} value="other" control={<Radio />} label="Other" />
            </Grid>
            <Grid component="fieldset" className={classes.fieldSet}>
              <FormControlLabel
                className={classes.label}
                value="unspecified"
                control={<Radio />}
                label="Prefer not to say"
              />
            </Grid>
            <CustomErrorMessage name="location" {...props} />
          </FormControl>
        </Grid>
        <Grid item width="100%">
          <CustomButton className={mainClasses.button} primaryButtonStyle fullWidth>
            NEXT
          </CustomButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Step5;
