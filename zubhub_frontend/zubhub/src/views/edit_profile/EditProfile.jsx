import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { withFormik } from 'formik';

import { toast } from 'react-toastify';

import { makeStyles } from '@material-ui/core/styles';

import Visibility from '@material-ui/icons/Visibility';

import VisibilityOff from '@material-ui/icons/VisibilityOff';

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
  OutlinedInput,
  Tooltip,
  ClickAwayListener,
  InputLabel,
  FormHelperText,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  IconButton,
} from '@material-ui/core';

import {
  validationSchema,
  getLocations,
  getProfile,
  editProfile,
  handleTooltipOpen,
  handleTooltipClose,
  handleToggleDeleteAccountModal,
  deleteAccount,
  handleClickShowPassword,
  handleMouseDownPassword,
  handleClickShowDeleteAccountPassword,
} from './editProfileScripts';

import CustomButton from '../../components/button/Button';
import * as AuthActions from '../../store/actions/authActions';
import * as UserActions from '../../store/actions/userActions';
import styles from '../../assets/js/styles/views/edit_profile/editProfileStyles';

const useStyles = makeStyles(styles);

/**
 * @function EditProfile View
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function EditProfile(props) {
  const refs = {
    username_el: React.useRef(null),
    location_el: React.useRef(null),
    email_el: React.useRef(null),
    phone_el: React.useRef(null),
    bio_el: React.useRef(null),
  };
  const username_check= React.useRef(null);

  const [state, setState] = React.useState({
    locations: [],
    tool_tip_open: false,
    dialog_error: null,
    open_delete_account_modal: false,
    show_password: false,
    show_delete_account_password: false,
  });

  React.useEffect(() => {
    getProfile(refs, props);
    handleSetState(getLocations(props));
  }, []);

  const classes = useStyles();
  const { show_password, show_delete_account_password } = state;

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { locations, tool_tip_open, open_delete_account_modal, dialog_error } = state;

  const { t } = props;

  return (
  <>
    <Box className={classes.root}>
      <Container className={classes.containerStyle}>
        <Card className={classes.cardStyle}>
          <CardActionArea>
            <CardContent>
              <form
                className="auth-form"
                name="signup"
                noValidate="noValidate"
                onSubmit={e => editProfile(e, props, toast)}
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  color="textPrimary"
                  className={classes.titleStyle}
                >
                  {t('editProfile.welcomeMsg.primary')}
                </Typography>
                <Typography
                  className={classes.descStyle}
                  variant="body2"
                  color="textSecondary"
                  component="p"
                >
                  {t('editProfile.welcomeMsg.secondary')}
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box
                      component="p"
                      className={
                        props.status &&
                        props.status['non_field_errors'] &&
                        classes.errorBox
                      }
                    >
                      {props.status && props.status['non_field_errors'] && (
                        <Box component="span" className={classes.error}>
                          {props.status['non_field_errors']}
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
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
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="username"
                      >
                        {t('editProfile.inputs.username.label')}
                      </InputLabel>
                      <ClickAwayListener
                        onClickAway={() => handleSetState(handleTooltipClose())}
                      >
                        <Tooltip
                          title={t('editProfile.tooltips.noRealName')}
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
                            ref={refs.username_el}
                            className={clsx(classes.customInputStyle)}
                            id="username"
                            name="username"
                            type="text"
                            value={
                              props.values.username ? props.values.username : ''
                            }
                            onClick={() => handleSetState(handleTooltipOpen())}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            label={t('editProfile.inputs.username.label')}
                          />
                        </Tooltip>
                      </ClickAwayListener>
                      <FormHelperText
                        className={classes.fieldHelperTextStyle}
                        error
                      >
                        {(props.status && props.status['username']) ||
                          (props.touched['username'] &&
                            props.errors['username'] &&
                            t(
                              `editProfile.inputs.username.errors.${props.errors['username']}`,
                            ))}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl
                      ref={refs.location_el}
                      className={clsx(classes.margin, classes.textField)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      margin="normal"
                      error={
                        (props.status && props.status['user_location']) ||
                        (props.touched['user_location'] &&
                          props.errors['user_location'])
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        id="user_location"
                      >
                        {t('editProfile.inputs.location.label')}
                      </InputLabel>
                      <Select
                        labelId="user_location"
                        id="user_location"
                        name="user_location"
                        className={clsx(classes.customInputStyle)}
                        value={
                          props.values.user_location
                            ? props.values.user_location
                            : ''
                        }
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        label="Location"
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
                      <FormHelperText
                        className={classes.fieldHelperTextStyle}
                        error
                      >
                        {(props.status && props.status['user_location']) ||
                          (props.touched['user_location'] &&
                            props.errors['user_location'] &&
                            t(
                              `editProfile.inputs.location.errors.${props.errors['user_location']}`,
                            ))}
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
                        (props.status && props.status['email']) ||
                        (props.touched['email'] && props.errors['email'])
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="email"
                      >
                        {t('editProfile.inputs.email.label')}
                      </InputLabel>
                      <OutlinedInput
                        ref={refs.email_el}
                        
                        className={clsx(classes.customInputStyle)}
                        id="email"
                        name="email"
                        type="text"
                        value={props.values.email ? props.values.email : ''}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        label={t('editProfile.inputs.email.label')}
                        />
                      <FormHelperText
                        className={classes.fieldHelperTextStyle}
                        error
                      >
                        {(props.status && props.status['email']) ||
                          (props.touched['email'] &&
                            props.errors['email'] &&
                            t(
                              `editProfile.inputs.email.errors.${props.errors['email']}`,
                            ))}
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
                        (props.status && props.status['phone']) ||
                        (props.touched['phone'] && props.errors['phone'])
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="phone"
                      >
                        {t('editProfile.inputs.phone.label')}
                      </InputLabel>
                      <OutlinedInput
                        ref={refs.phone_el}
                        
                        className={clsx(classes.customInputStyle)}
                        id="phone"
                        name="phone"
                        type="phone"
                        value={props.values.phone ? props.values.phone : ''}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        label={t('editProfile.inputs.phone.label')}
                      />
                      <FormHelperText
                        className={classes.fieldHelperTextStyle}
                        error
                      >
                        {(props.status && props.status['phone']) ||
                          (props.touched['phone'] &&
                            props.errors['phone'] &&
                            t(
                              `editProfile.inputs.phone.errors.${props.errors['phone']}`,
                            ))}
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
                        (props.status && props.status['password']) ||
                        (props.touched['password'] && props.errors['password'])
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="password"
                      >
                        {t('editProfile.inputs.password.label')}
                      </InputLabel>
                      <OutlinedInput
                        className={classes.customInputStyle}
                        id="password"
                        name="password"
                        type={show_password ? 'text' : 'password'}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() =>
                                handleSetState(handleClickShowPassword(state))
                              }
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {show_password ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label={t('editProfile.inputs.password.label')}
                      />
                      <FormHelperText
                        className={classes.fieldHelperTextStyle}
                        error
                      >
                        {(props.status && props.status['password']) ||
                          (props.touched['password'] &&
                            props.errors['password'] &&
                            t(
                              `editProfile.inputs.password.errors.${props.errors['password']}`,
                            ))}
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
                      error={
                        (props.status && props.status['bio']) ||
                        (props.touched['bio'] && props.errors['bio'])
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="bio"
                      >
                        {t('editProfile.inputs.bio.label')}
                      </InputLabel>
                      <OutlinedInput
                        ref={refs.bio_el}
                        className={clsx(classes.customInputStyle)}
                        id="bio"
                        name="bio"
                        type="text"
                        multiline
                        rows={6}
                        rowsMax={6}
                        value={props.values.bio ? props.values.bio : ''}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        label={t('editProfile.inputs.bio.label')}
                      />
                      <FormHelperText
                        className={classes.fieldHelperTextStyle}
                        error
                      >
                        <Typography
                          color="textSecondary"
                          variant="caption"
                          component="span"
                          className={classes.fieldHelperTextStyle}
                        >
                          {t('editProfile.inputs.bio.helpText')}
                        </Typography>
                        <br />
                        {(props.status && props.status['bio']) ||
                          (props.touched['bio'] &&
                            props.errors['bio'] &&
                            t(
                              `editProfile.inputs.bio.errors.${props.errors['bio']}`,
                            ))}
                      </FormHelperText>
                    </FormControl>
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
                      {t('editProfile.inputs.submit')}
                    </CustomButton>
                  </Grid>
                </Grid>
              <Grid container spacing={3}>
              <Grid item xs={12}>
                  <Link to="/profile" className={classes.textDecorationNone}>
                    <CustomButton
                      variant="outlined"
                      size="large"
                      secondaryButtonStyle
                      customButtonStyle
                      fullWidth
                    >
                      {t('editProfile.backToProfile')}
                    </CustomButton>
                  </Link>
                </Grid>
              </Grid>
              </form>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box className={classes.center}>
                    <Divider className={classes.divider} />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {t('editProfile.or')}
                    </Typography>
                    <Divider className={classes.divider} />
                  </Box>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                    <CustomButton
                      variant="outlined"
                      size="large"
                      secondaryButtonStyle
                      dangerButtonStyle
                      fullWidth
                      onClick={() =>
                        handleSetState(handleToggleDeleteAccountModal(state))
                      }
                    >
                      {t('profile.delete.label')}
                    </CustomButton>
                </Grid>
              </Grid>
            </CardContent>
          </CardActionArea>
        </Card>
      </Container>
    </Box>
            <Dialog
            open={open_delete_account_modal}
            onClose={() => handleSetState(handleToggleDeleteAccountModal(state))}
            aria-labelledby={t('profile.delete.ariaLabels.deleteAccount')}
          >
            <DialogTitle id="delete-project">
              {t('profile.delete.dialog.primary')}
            </DialogTitle>
            <Box
              component="p"
              className={dialog_error !== null && classes.errorBox}
            >
              {dialog_error !== null && (
                <Box component="span" className={classes.error}>
                  {dialog_error}
                </Box>
              )}
            </Box>{' '}
            <DialogContent>
              <Typography>{t('profile.delete.dialog.secondary')}</Typography>
              <FormControl
                className={clsx(classes.margin, classes.textField)}
                variant="outlined"
                size="medium"
                fullWidth
                margin="normal"
              >
                <InputLabel
                  className={classes.customLabelStyle}
                  htmlFor="username"
                >
                  {t('profile.delete.dialog.inputs.username.label')}
                </InputLabel>
                <OutlinedInput
                  className={classes.customInputStyle}
                  ref={username_check}
                  name="username"
                  type="text"
                  label={t('profile.delete.dialog.inputs.username.label')}
                />
                <FormHelperText className={classes.fieldHelperTextStyle} error>
                  {(props.status && props.status['username']) ||
                    (props.touched['username'] &&
                      props.errors['username'] &&
                      t(`profile.delete.dialog.inputs.username.errors.${props.errors['username']}`))}
                </FormHelperText>
              </FormControl>
              <FormControl
                className={clsx(classes.margin, classes.textField)}
                variant="outlined"
                size="medium"
                fullWidth
                margin="normal"
                error={
                  (props.status && props.status['password']) ||
                  (props.touched['password'] && props.errors['password'])
                }
              >
                <InputLabel className={classes.customLabelStyle} htmlFor="password">
                  {t('profile.delete.dialog.inputs.password.label')}
                </InputLabel>
                <OutlinedInput
                  className={classes.customInputStyle}
                  id="password"
                  name="password"
                  type={show_delete_account_password ? 'text' : 'password'}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() =>
                          handleSetState(handleClickShowDeleteAccountPassword(state))
                        }
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {show_delete_account_password ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label={t('profile.delete.dialog.inputs.password.label')}
                />
                <FormHelperText className={classes.fieldHelperTextStyle} error>
                  {(props.status && props.status['password']) ||
                    (props.touched['password'] &&
                      props.errors['password'] &&
                      t(`profile.delete.dialog.inputs.password.errors.${props.errors['password']}`))}
                </FormHelperText>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <CustomButton
                variant="outlined"
                onClick={() =>
                  handleSetState(handleToggleDeleteAccountModal(state))
                }
                color="primary"
                secondaryButtonStyle
              >
                {t('profile.delete.dialog.cancel')}
              </CustomButton>
              <CustomButton
                variant="contained"
                onClick={e => handleSetState(deleteAccount(username_check, props, toast))}
                dangerButtonStyle
                customButtonStyle
              >
                {t('profile.delete.dialog.proceed')}
              </CustomButton>
            </DialogActions>
          </Dialog>
    </>
  );
}

EditProfile.propTypes = {
  auth: PropTypes.object.isRequired,
  getAuthUser: PropTypes.func.isRequired,
  setAuthUser: PropTypes.func.isRequired,
  editUserProfile: PropTypes.func.isRequired,
  getLocations: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAuthUser: props => {
      return dispatch(AuthActions.getAuthUser(props));
    },
    editUserProfile: props => {
      return dispatch(UserActions.editUserProfile(props));
    },
    getLocations: _ => {
      return dispatch(AuthActions.getLocations());
    },
    deleteAccount: args => {
      return dispatch(AuthActions.deleteAccount(args));
    },
    login: args => {
      return dispatch(AuthActions.login(args));
    },
    logout: args => {
      return dispatch(AuthActions.logout(args));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  withFormik({
    mapPropsToValue: () => ({
      username: '',
      email: '',
      phone: '',
      password: '',
      user_location: '',
      bio: '',
    }),
    validationSchema,
  })(EditProfile),
);
