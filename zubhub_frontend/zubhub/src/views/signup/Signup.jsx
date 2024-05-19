import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { withFormik } from 'formik';

import 'intl-tel-input/build/css/intlTelInput.css';

import { makeStyles } from '@mui/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Grid,
  Box,
  Divider,
  Container,
  Card,
  CardActionArea,
  CardContent,
  Select,
  MenuItem,
  Typography,
  InputAdornment,
  IconButton,
  OutlinedInput,
  Tooltip,
  ClickAwayListener,
  InputLabel,
  FormHelperText,
  FormControl,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

import {
  vars,
  validationSchema,
  initIntlTelInput,
  handleMouseDownPassword,
  getLocations,
  signup,
  handleTooltipOpen,
  handleTooltipClose,
  handleToggleSubscribeBox,
  handleLocationChange,
  setLabelWidthOfStaticFields,
} from './signupScripts';

import CustomButton from '../../components/button/Button';
import * as AuthActions from '../../store/actions/authActions';
import styles from '../../assets/js/styles/views/signup/signupStyles';

const useStyles = makeStyles(styles);

/**
 * @function Signup View
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function Signup(props) {
  const classes = useStyles();

  const refs = {
    phone_el: React.useRef(null),
    location_el: React.useRef(null),
    date_of_birth_el: React.useRef(null),
  };

  const [state, setState] = React.useState({
    locations: [],
    show_password1: false,
    show_password2: false,
    tool_tip_open: false,
    subscribe_box_checked: false,
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  React.useEffect(() => {
    handleSetState(getLocations(props));
  }, []);

  React.useEffect(() => {
    initIntlTelInput(props, refs);
  }, [refs.phone_el]);

  React.useEffect(() => {
    setLabelWidthOfStaticFields(refs, document, props);
  }, [props.i18n.language]);

  React.useEffect(() => {
    if (props.touched['email']) {
      vars.email_field_touched = true;
    } else {
      vars.email_field_touched = false;
    }

    if (props.touched['phone']) {
      vars.phone_field_touched = true;
    } else {
      vars.phone_field_touched = false;
    }
  }, [props.touched['email'], props.touched['phone']]);

  const { locations, tool_tip_open, show_password1, show_password2, subscribe_box_checked } = state;
  const { t } = props;

  return (
    <Box className={classes.root}>
      <Container className={classes.containerStyle}>
        <Card className={classes.cardStyle}>
          <CardActionArea>
            <CardContent>
              <form className="auth-form" name="signup" noValidate="noValidate" onSubmit={e => signup(e, props)}>
                <Typography gutterBottom variant="h5" component="h2" color="textPrimary" className={classes.titleStyle}>
                  {t('signup.welcomeMsg.primary')}
                </Typography>
                <Typography className={classes.descStyle} variant="body2" color="textSecondary" component="p">
                  {t('signup.welcomeMsg.secondary')}
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box component="p" className={props.status && props.status['non_field_errors'] && classes.errorBox}>
                      {props.status && props.status['non_field_errors'] && (
                        <Box component="span" className={classes.error}>
                          {props.status['non_field_errors']}
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl
                      className={clsx(classes.margin, classes.textField)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      margin="normal"
                      error={
                        (props.status && props.status['username']) ||
                        (props.touched['username'] && props.errors['username'])
                      }
                    >
                      <InputLabel className={classes.customLabelStyle} htmlFor="username">
                        {t('signup.inputs.username.label')}
                      </InputLabel>
                      <ClickAwayListener onClickAway={() => handleSetState(handleTooltipClose())}>
                        <Tooltip
                          title={t('signup.tooltips.noRealName')}
                          placement="top-start"
                          arrow
                          onClose={() => handleSetState(handleTooltipClose())}
                          PopperProps={{
                            disablePortal: true,
                          }}
                          open={tool_tip_open}
                          disableFocusListener
                          disableHoverListener
                          disableTouchListener
                        >
                          <OutlinedInput
                            className={classes.customInputStyle}
                            id="username"
                            name="username"
                            type="text"
                            onClick={() => handleSetState(handleTooltipOpen())}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            label={t('signup.inputs.username.label')}
                          />
                        </Tooltip>
                      </ClickAwayListener>
                      <FormHelperText className={classes.fieldHelperTextStyle} error>
                        {(props.status && props.status['username']) ||
                          (props.touched['username'] &&
                            props.errors['username'] &&
                            t(`signup.inputs.username.errors.${props.errors['username']}`))}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl
                      className={clsx(classes.margin, classes.textField)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      margin="normal"
                      error={
                        (props.status && props.status['user_location']) ||
                        (props.touched['user_location'] && props.errors['user_location'])
                      }
                    >
                      <InputLabel className={classes.customLabelStyle} id="user_location">
                        {t('signup.inputs.location.label')}
                      </InputLabel>
                      <Select
                        ref={refs.location_el}
                        labelId="user_location"
                        id="user_location"
                        name="user_location"
                        className={classes.customInputStyle}
                        value={props.values.user_location ? props.values.user_location : ''}
                        onChange={e => handleLocationChange(e, props)}
                        onBlur={props.handleBlur}
                        // label="Location"
                        label={t('signup.inputs.location.label')}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {Array.isArray(locations) &&
                          locations.map(location => (
                            <MenuItem key={location.name} value={location.name}>
                              {location.name}
                            </MenuItem>
                          ))}
                      </Select>
                      <FormHelperText className={classes.fieldHelperTextStyle} error>
                        {(props.status && props.status['user_location']) ||
                          (props.touched['user_location'] &&
                            props.errors['user_location'] &&
                            t(`signup.inputs.location.errors.${props.errors['user_location']}`))}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl
                      className={clsx(classes.margin, classes.textField)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      margin="normal"
                      error={
                        (props.status && props.status['dateOfBirth']) ||
                        (props.touched['dateOfBirth'] && props.errors['dateOfBirth'])
                      }
                    >
                      <InputLabel className={classes.customLabelStyle} htmlFor="dateOfBirth" shrink>
                        {t('signup.inputs.dateOfBirth.label')}
                      </InputLabel>
                      <OutlinedInput
                        ref={refs.date_of_birth_el}
                        className={clsx(classes.customInputStyle)}
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                      />
                      <FormHelperText className={classes.fieldHelperTextStyle} error>
                        {(props.status && props.status['dateOfBirth']) ||
                          (props.touched['dateOfBirth'] &&
                            props.errors['dateOfBirth'] &&
                            t(`signup.inputs.dateOfBirth.errors.${props.errors['dateOfBirth']}`))}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl
                      className={clsx(classes.margin, classes.textField)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      margin="normal"
                      error={
                        (props.status && props.status['phone']) || (props.touched['phone'] && props.errors['phone'])
                      }
                    >
                      <InputLabel className={classes.customLabelStyle} shrink htmlFor="phone">
                        {t('signup.inputs.phone.label')}
                      </InputLabel>
                      <OutlinedInput
                        ref={refs.phone_el}
                        className={clsx(classes.customInputStyle, classes.locationInputStyle)}
                        id="phone"
                        name="phone"
                        type="phone"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                      />
                      <FormHelperText className={classes.fieldHelperTextStyle} error>
                        {(props.status && props.status['phone']) ||
                          (props.touched['phone'] &&
                            props.errors['phone'] &&
                            t(`signup.inputs.phone.errors.${props.errors['phone']}`))}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl
                      className={clsx(classes.margin, classes.textField)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      margin="normal"
                      error={
                        (props.status && props.status['email']) || (props.touched['email'] && props.errors['email'])
                      }
                    >
                      <InputLabel className={classes.customLabelStyle} htmlFor="email">
                        {t('signup.inputs.email.label')}
                      </InputLabel>
                      <OutlinedInput
                        className={classes.customInputStyle}
                        id="email"
                        name="email"
                        type="text"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        label={t('signup.inputs.email.label')}
                      />
                      <FormHelperText className={classes.fieldHelperTextStyle} error>
                        {(props.status && props.status['email']) ||
                          (props.touched['email'] &&
                            props.errors['email'] &&
                            t(`signup.inputs.email.errors.${props.errors['email']}`))}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl
                      className={clsx(classes.margin, classes.textField)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      margin="normal"
                      error={
                        (props.status && props.status['password1']) ||
                        (props.touched['password1'] && props.errors['password1'])
                      }
                    >
                      <InputLabel className={classes.customLabelStyle} htmlFor="password1">
                        {t('signup.inputs.password1.label')}
                      </InputLabel>
                      <OutlinedInput
                        className={classes.customInputStyle}
                        id="password1"
                        name="password1"
                        type={show_password1 ? 'text' : 'password'}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={t('signup.ariaLabel.togglePasswordVisibility')}
                              onClick={() =>
                                setState({
                                  ...state,
                                  show_password1: !show_password1,
                                })
                              }
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {show_password1 ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        }
                        label={t('signup.inputs.password1.label')}
                      />
                      <FormHelperText className={classes.fieldHelperTextStyle} error>
                        {(props.status && props.status['password1']) ||
                          (props.touched['password1'] &&
                            props.errors['password1'] &&
                            t(`signup.inputs.password1.errors.${props.errors['password1']}`))}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl
                      className={clsx(classes.margin, classes.textField)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      margin="normal"
                      error={
                        (props.status && props.status['password2']) ||
                        (props.touched['password2'] && props.errors['password2'])
                      }
                    >
                      <InputLabel className={classes.customLabelStyle} htmlFor="password2">
                        {t('signup.inputs.password2.label')}
                      </InputLabel>
                      <OutlinedInput
                        className={classes.customInputStyle}
                        id="password2"
                        name="password2"
                        type={show_password2 ? 'text' : 'password'}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={t('signup.ariaLabel.togglePasswordVisibility')}
                              onClick={() =>
                                setState({
                                  ...state,
                                  show_password2: !show_password2,
                                })
                              }
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {show_password2 ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        }
                        label={t('signup.inputs.password2.label')}
                      />
                      <FormHelperText className={classes.fieldHelperTextStyle} error>
                        {(props.status && props.status['password2']) ||
                          (props.touched['password2'] &&
                            props.errors['password2'] &&
                            t(`signup.inputs.password2.errors.${props.errors['password2']}`))}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl
                      className={clsx(classes.margin, classes.textField)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      margin="small"
                      error={(props.status && props.status['bio']) || (props.touched['bio'] && props.errors['bio'])}
                    >
                      <InputLabel className={classes.customLabelStyle} htmlFor="bio">
                        {t('signup.inputs.bio.label')}
                      </InputLabel>
                      <OutlinedInput
                        className={classes.customInputStyle}
                        id="bio"
                        name="bio"
                        type="text"
                        multiline
                        rows={6}
                        rowsMax={6}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        label={t('signup.inputs.bio.label')}
                      />
                      <FormHelperText className={classes.fieldHelperTextStyle} error>
                        <Typography
                          color="textSecondary"
                          variant="caption"
                          component="span"
                          className={classes.fieldHelperTextStyle}
                        >
                          {t('signup.inputs.bio.helpText')}
                        </Typography>
                        <br />
                        {(props.status && props.status['bio']) ||
                          (props.touched['bio'] &&
                            props.errors['bio'] &&
                            t(`signup.inputs.bio.errors.${props.errors['bio']}`))}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      value={subscribe_box_checked}
                      onChange={e => handleSetState(handleToggleSubscribeBox(e, props, state))}
                      control={<Checkbox name="subscribe" id="subscribe" color="primary" />}
                      label={
                        <Typography
                          color="textSecondary"
                          variant="caption"
                          component="span"
                          className={classes.fieldHelperTextStyle}
                        >
                          {t('signup.unsubscribe')}
                        </Typography>
                      }
                      labelPlacement="end"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <CustomButton
                      variant="contained"
                      size="large"
                      primaryButtonStyle
                      type="submit"
                      fullWidth
                      customButtonStyle
                    >
                      {t('signup.inputs.submit')}
                    </CustomButton>
                  </Grid>
                </Grid>
              </form>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box className={classes.center}>
                    <Divider className={classes.divider} />
                    <Typography variant="body2" color="textSecondary" component="p">
                      {t('signup.alreadyAMember')}
                    </Typography>
                    <Divider className={classes.divider} />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Link to={`/login${props.location.search}`} className={classes.textDecorationNone}>
                    <CustomButton variant="outlined" size="large" secondaryButtonStyle customButtonStyle fullWidth>
                      {t('signup.login')}
                    </CustomButton>
                  </Link>
                </Grid>
              </Grid>
            </CardContent>
          </CardActionArea>
        </Card>
      </Container>
    </Box>
  );
}

Signup.propTypes = {
  auth: PropTypes.object.isRequired,
  setAuthUser: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired,
  getLocations: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  setAuthUser: auth_user => {
    dispatch(AuthActions.setAuthUser(auth_user));
  },
  signup: args => dispatch(AuthActions.signup(args)),
  getLocations: args => dispatch(AuthActions.getLocations(args)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  withFormik({
    mapPropsToValue: () => ({
      username: '',
      email: '',
      phone: '',
      user_location: '',
      password1: '',
      password2: '',
      bio: '',
    }),
    validationSchema,
  })(Signup),
);
