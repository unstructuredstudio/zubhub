import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { withFormik } from 'formik';
import * as Yup from 'yup';

import { toast } from 'react-toastify';

import { makeStyles } from '@material-ui/core/styles';
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
} from '@material-ui/core';

import CustomButton from '../../components/button/Button';
import * as AuthActions from '../../store/actions/authActions';
import * as UserActions from '../../store/actions/userActions';
import styles from '../../assets/js/styles/views/edit_profile/editProfileStyles';

const useStyles = makeStyles(styles);

const get_locations = props => {
  return props.get_locations({ t: props.t });
};

const getProfile = (refs, props) => {
  return props.get_auth_user(props).then(obj => {
    if (!obj.id) {
      return;
    } else {
      let init_email_and_phone = {};
      if (refs.usernameEl.current && obj.username) {
        props.setFieldValue('username', obj.username);
        refs.usernameEl.current.firstChild.value = obj.username;
      }

      if (refs.emailEl.current && obj.email) {
        props.setFieldValue('email', obj.email);
        refs.emailEl.current.firstChild.value = obj.email;
        init_email_and_phone['init_email'] = obj.email; //this is a hack: we need to find a better way of setting knowing when phone and email exists. state doesn't seem to work
      }

      if (refs.phoneEl.current && obj.phone) {
        props.setFieldValue('phone', obj.phone);
        refs.phoneEl.current.firstChild.value = obj.phone;
        init_email_and_phone['init_phone'] = obj.phone; //this is a hack: we need to find a better way of setting knowing when phone and email exists. state doesn't seem to work
      }

      if (obj.location) {
        props.setFieldValue('user_location', obj.location);
      }

      if (refs.bioEl.current && obj.bio) {
        props.setFieldValue('bio', obj.bio);
        refs.bioEl.current.firstChild.value = obj.bio;
      }

      props.setStatus(init_email_and_phone); //the hack continues
    }
  });
};

const editProfile = (e, props) => {
  e.preventDefault();
  if (props.values.user_location.length < 1) {
    props.validateField('user_location');
  } else {
    return props
      .edit_user_profile({ ...props.values, token: props.auth.token })
      .then(res => {
        toast.success(props.t('editProfile.toastSuccess'));
        props.history.push('/profile');
      })
      .catch(error => {
        const messages = JSON.parse(error.message);
        if (typeof messages === 'object') {
          const server_errors = {};
          Object.keys(messages).forEach(key => {
            if (key === 'non_field_errors') {
              server_errors['non_field_errors'] = messages[key][0];
            } else if (key === 'location') {
              server_errors['user_location'] = messages[key][0];
            } else {
              server_errors[key] = messages[key][0];
            }
          });
          props.setStatus({
            //this is a hack. we need to find a more react way of maintaining initial state for email and phone.
            init_email: props.status && props.status.init_email,
            init_phone: props.status && props.status.init_phone,
            ...server_errors,
          });
        } else {
          props.setStatus({
            non_field_errors: props.t('editProfile.errors.unexpected'),
          });
        }
      });
  }
};

const handleTooltipToggle = ({ toolTipOpen }) => {
  return { toolTipOpen: !toolTipOpen };
};

function EditProfile(props) {
  const refs = {
    usernameEl: React.useRef(null),
    locationEl: React.useRef(null),
    emailEl: React.useRef(null),
    phoneEl: React.useRef(null),
    bioEl: React.useRef(null),
  };

  const [state, setState] = React.useState({
    locations: [],
    toolTipOpen: false,
  });

  React.useEffect(() => {
    getProfile(refs, props);
    handleSetState(get_locations(props));
  }, []);

  const classes = useStyles();

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState({ ...state, ...obj });
      });
    }
  };

  const { locations, toolTipOpen } = state;
  const { t } = props;

  return (
    <Box className={classes.root}>
      <Container className={classes.containerStyle}>
        <Card className={classes.cardStyle}>
          <CardActionArea>
            <CardContent>
              <form
                className="auth-form"
                name="signup"
                noValidate="noValidate"
                onSubmit={e => editProfile(e, props)}
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
                        shrink
                      >
                        {t('editProfile.inputs.username.label')}
                      </InputLabel>
                      <ClickAwayListener
                        onClickAway={() =>
                          handleSetState(handleTooltipToggle(state))
                        }
                      >
                        <Tooltip
                          title={t('editProfile.tooltips.noRealName')}
                          placement="top-start"
                          arrow
                          onClose={() =>
                            handleSetState(handleTooltipToggle(state))
                          }
                          PopperProps={{
                            disablePortal: true,
                          }}
                          open={toolTipOpen}
                          disableFocusListener
                          disableHoverListener
                          disableTouchListener
                        >
                          <OutlinedInput
                            ref={refs.usernameEl}
                            className={clsx(
                              classes.customInputStyle,
                              classes.staticLabelInputStyle,
                            )}
                            id="username"
                            name="username"
                            type="text"
                            onClick={() =>
                              handleSetState(handleTooltipToggle(state))
                            }
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            labelWidth={90}
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
                      ref={refs.locationEl}
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
                        shrink
                      >
                        {t('editProfile.inputs.location.label')}
                      </InputLabel>
                      <Select
                        labelId="user_location"
                        id="user_location"
                        name="user_location"
                        className={clsx(
                          classes.customInputStyle,
                          classes.staticLabelInputStyle,
                        )}
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
                        shrink
                      >
                        {t('editProfile.inputs.email.label')}
                      </InputLabel>
                      <OutlinedInput
                        ref={refs.emailEl}
                        disabled={
                          props.status && props.status['init_email']
                            ? true
                            : false
                        }
                        className={clsx(
                          classes.customInputStyle,
                          classes.staticLabelInputStyle,
                        )}
                        id="email"
                        name="email"
                        type="text"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        labelWidth={70}
                      />
                      <FormHelperText
                        className={classes.fieldHelperTextStyle}
                        error
                      >
                        {props.status && props.status['init_email'] && (
                          <Typography
                            color="textSecondary"
                            variant="caption"
                            component="span"
                            className={classes.fieldHelperTextStyle}
                          >
                            {t('editProfile.inputs.email.disabledHelperText')}
                          </Typography>
                        )}
                        <br />
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
                        shrink
                      >
                        {t('editProfile.inputs.phone.label')}
                      </InputLabel>
                      <OutlinedInput
                        ref={refs.phoneEl}
                        disabled={
                          props.status && props.status['init_phone']
                            ? true
                            : false
                        }
                        className={clsx(
                          classes.customInputStyle,
                          classes.staticLabelInputStyle,
                        )}
                        id="phone"
                        name="phone"
                        type="phone"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        labelWidth={70}
                      />
                      <FormHelperText
                        className={classes.fieldHelperTextStyle}
                        error
                      >
                        {props.status && props.status['init_phone'] && (
                          <Typography
                            color="textSecondary"
                            variant="caption"
                            component="span"
                            className={classes.fieldHelperTextStyle}
                          >
                            {t('editProfile.inputs.phone.disabledHelperText')}
                          </Typography>
                        )}
                        <br />
                        {(props.status && props.status['phone']) ||
                          (props.touched['phone'] &&
                            props.errors['phone'] &&
                            t(
                              `editProfile.inputs.phone.errors.${props.errors['phone']}`,
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
                        shrink
                      >
                        {t('editProfile.inputs.bio.label')}
                      </InputLabel>
                      <OutlinedInput
                        ref={refs.bioEl}
                        className={clsx(
                          classes.customInputStyle,
                          classes.staticLabelInputStyle,
                        )}
                        id="bio"
                        name="bio"
                        type="text"
                        multiline
                        rows={6}
                        rowsMax={6}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        labelWidth={50}
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
            </CardContent>
          </CardActionArea>
        </Card>
      </Container>
    </Box>
  );
}

EditProfile.propTypes = {
  auth: PropTypes.object.isRequired,
  get_auth_user: PropTypes.func.isRequired,
  set_auth_user: PropTypes.func.isRequired,
  edit_user_profile: PropTypes.func.isRequired,
  get_locations: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    get_auth_user: props => {
      return dispatch(AuthActions.get_auth_user(props));
    },
    edit_user_profile: props => {
      return dispatch(UserActions.edit_user_profile(props));
    },
    get_locations: props => {
      return dispatch(AuthActions.get_locations());
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
      user_location: '',
      bio: '',
    }),
    validationSchema: Yup.object().shape({
      username: Yup.string().required('required'),
      user_location: Yup.string().min(1, 'min').required('required'),
      email: Yup.string().email('invalid'),
      phone: Yup.string().test('phone_is_invalid', 'invalid', function (value) {
        return /^[+][0-9]{9,15}$/g.test(value) || !value ? true : false;
      }),
      bio: Yup.string().max(255, 'tooLong'),
    }),
  })(EditProfile),
);
