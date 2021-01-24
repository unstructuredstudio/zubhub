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
  return props.get_locations();
};

const getProfile = (refs, props) => {
  return props.get_auth_user(props).then(obj => {
    if (!obj.id) {
      return obj;
    } else {
      props.setFieldValue('username', obj.username);
      if (refs.usernameEl.current)
        refs.usernameEl.current.firstChild.value = obj.username;

      props.setFieldValue('bio', obj.bio);
      if (refs.bioEl.current) refs.bioEl.current.firstChild.value = obj.bio;

      if (obj.dateOfBirth) {
        props.setFieldValue('dateOfBirth', obj.dateOfBirth);
      }

      if (obj.location) {
        props.setFieldValue('user_location', obj.location);
      }
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
        toast.success('Your profile was updated successfully!!');
        props.history.push('/profile');
      })
      .catch(error => {
        const messages = JSON.parse(error.message);
        if (typeof messages === 'object') {
          let non_field_errors;
          Object.keys(messages).forEach(key => {
            if (key === 'non_field_errors') {
              non_field_errors = { error: messages[key][0] };
            } else if (key === 'location') {
              props.setFieldTouched('user_location', true, false);
              props.setFieldError('user_location', messages[key][0]);
            } else {
              props.setFieldTouched(key, true, false);
              props.setFieldError(key, messages[key][0]);
            }
          });
          return non_field_errors;
        } else {
          return {
            error:
              'An error occured while performing this action. Please try again later',
          };
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
    bioEl: React.useRef(null),
    dobEl: React.useRef(null),
    locationEl: React.useRef(null),
  };

  const [state, setState] = React.useState({
    error: null,
    locations: [],
    current_location: '',
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

  const { error, locations, toolTipOpen } = state;

  return (
    <Box className={classes.root}>
      <Container maxWidth="sm">
        <Card className={classes.cardStyle}>
          <CardActionArea>
            <CardContent>
              <form
                className="auth-form"
                name="signup"
                noValidate="noValidate"
                onSubmit={e => handleSetState(editProfile(e, props))}
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  color="textPrimary"
                  className={classes.titleStyle}
                >
                  Edit Profile
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Have changes to make to your Profile? go ahead!
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box component="p" className={error && classes.errorBox}>
                      {error && (
                        <Box component="span" className={classes.error}>
                          {error}
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
                        props.touched['username'] && props.errors['username']
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="username"
                        shrink={props.values['username'] ? true : false}
                      >
                        Username
                      </InputLabel>
                      <ClickAwayListener
                        onClickAway={() =>
                          handleSetState(handleTooltipToggle(state))
                        }
                      >
                        <Tooltip
                          title="Do not use your real name here!"
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
                            className={
                              props.values['username']
                                ? clsx(
                                    classes.customInputStyle,
                                    classes.staticLabelInputStyle,
                                  )
                                : classes.customInputStyle
                            }
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
                      <FormHelperText error>
                        {props.touched['username'] && props.errors['username']}
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
                        props.touched['dateOfBirth'] &&
                        props.errors['dateOfBirth']
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="dateOfBirth"
                        shrink={props.values['dateOfBirth'] ? true : false}
                      >
                        Date Of Birth
                      </InputLabel>
                      <OutlinedInput
                        ref={refs.dobEl}
                        className={
                          props.values['dateOfBirth']
                            ? clsx(
                                classes.customInputStyle,
                                classes.staticLabelInputStyle,
                              )
                            : classes.customInputStyle
                        }
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={
                          props.values['dateOfBirth']
                            ? props.values['dateOfBirth']
                            : ''
                        }
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        labelWidth={90}
                      />
                      <FormHelperText error>
                        {props.touched['dateOfBirth'] &&
                          props.errors['dateOfBirth']}
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
                      error={props.touched['bio'] && props.errors['bio']}
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="bio"
                        shrink={props.values['bio'] ? true : false}
                      >
                        Bio
                      </InputLabel>
                      <OutlinedInput
                        ref={refs.bioEl}
                        className={
                          props.values['bio']
                            ? clsx(
                                classes.customInputStyle,
                                classes.staticLabelInputSmallStyle,
                              )
                            : classes.customInputStyle
                        }
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
                      <FormHelperText error>
                        <Typography
                          color="textSecondary"
                          variant="caption"
                          component="span"
                        >
                          Tell us something interesting about you! You can share
                          what care about, your hobbies, things you have been
                          working on recently, etc.
                        </Typography>
                        <br />
                        {props.touched['bio'] && props.errors['bio']}
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
                        props.touched['user_location'] &&
                        props.errors['user_location']
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        id="user_location"
                        shrink={props.values['user_location'] ? true : false}
                      >
                        Location
                      </InputLabel>
                      <Select
                        labelId="user_location"
                        id="user_location"
                        name="user_location"
                        className={
                          props.values['user_location']
                            ? clsx(
                                classes.customInputStyle,
                                classes.staticLabelInputStyle,
                              )
                            : classes.customInputStyle
                        }
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
                      <FormHelperText error>
                        {props.touched['user_location'] &&
                          props.errors['user_location']}
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
                    >
                      Edit Profile
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
                      OR
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
                      fullWidth
                    >
                      Back To Profile
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
      username: Yup.string().required('please input your username'),
      dateOfBirth: Yup.date()
        .max(new Date(), "your date of birth can't be greater than today")
        .required('please input your date of birth'),
      bio: Yup.string().max(
        255,
        "your bio shouldn't be more than 255 characters",
      ),
      user_location: Yup.string()
        .min(1, 'your location is too short')
        .required('please input your location'),
    }),
  })(EditProfile),
);
