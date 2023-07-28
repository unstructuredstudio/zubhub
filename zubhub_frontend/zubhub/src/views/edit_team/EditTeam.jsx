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
} from './editTeamScripts';

import CustomButton from '../../components/button/Button';
import * as AuthActions from '../../store/actions/authActions';
import * as UserActions from '../../store/actions/userActions';
import styles from '../../assets/js/styles/views/edit_profile/editProfileStyles';
import { calculateLabelWidth } from '../../assets/js/utils/scripts';

const useStyles = makeStyles(styles);

/**
 * @function EditProfile View
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function EditTeam(props) {
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
  });

  React.useEffect(() => {
    getProfile(refs, props);
    handleSetState(getLocations(props));
  }, []);

  const classes = useStyles();
  const { show_password } = state;

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { locations, tool_tip_open, open_delete_account_modal,dialog_error, } = state;
  const { t } = props;
  const handleButtonClick = () => {
    handleSetState(handleToggleDeleteAccountModal(state));
  };
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
                  {t('Edit Team Info')}
                </Typography><br></br>
                <Typography
                  className={classes.descStyle}
                  variant="h6"
                  color="textPrimary"
                  component="p"
                >
                  {t('Team Name')}
                </Typography>
                <Grid container spacing={3}>
                  
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
                  
                  <Grid item xs={12} sm={12} md={12}>
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
                        {t('Team Name')}
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
                            labelWidth={calculateLabelWidth(
                              t('Team Name'),
                              document,
                            )}
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
                    </Grid><Grid item xs={12} sm={12} md={12}>
                    <Typography
                    className={classes.descStyle}
                    variant="h6"
                    color="textPrimary"
                    component="p"
                    >
                    {t('About Team')}
                  </Typography>
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
                        labelWidth={calculateLabelWidth(
                          t('editProfile.inputs.bio.label'),
                          document,
                        )}
                      />
                      <FormHelperText
                        className={classes.fieldHelperTextStyle}
                        error
                      >
                      
                        {(props.status && props.status['bio']) ||
                          (props.touched['bio'] &&
                            props.errors['bio'] &&
                            t(
                              `editProfile.inputs.bio.errors.${props.errors['bio']}`,
                            ))}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <Typography
                    className={classes.descStyle}
                    variant="h6"
                    color="textPrimary"
                    component="p"
                    >
                    {t('Delete Team Profile?')}
                  </Typography>
                  <Typography
                  // gutterBottom
                  variant="body2"
                  component="p"
                  color="textSecondary"
                  className={classes.descStyle}
                >
                    {t('Deleting your Team will remove all members and admins from this Team. Deleting a Team is Permanent and data associated with the Team cannot be recovered.')}
                  </Typography>
                  <br></br>
                  <Typography
                  // gutterBottom
                  variant="body2"
                  component="p"
                  color="textSecondary"
                  className={classes.descStyle}
                >
                    {t('Deleting your team will also delete any job or talent search associated with this team.')}
                  </Typography>
                </Grid>
                </Grid>
              <Grid container spacing={3}>
              
              </Grid>
              </form>
              <br></br><br></br>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                <a href="#!" onClick={handleButtonClick}>
                  {t('I want to delete this team’s profile')}
                </a>
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
              {t('Delete Team Profile?')}
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
              <Typography>{t('Deleting your Team will remove all members and admins from this Team. Deleting a Team is Permanent and data associated with the Team cannot be recovered.')}</Typography>
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
                onClick={e =>
                  handleSetState(deleteAccount(username_check, props, state))
                }
                primaryButtonStyle
                customButtonStyle
              >
                {t('Delete')}
              </CustomButton>
            </DialogActions>
          </Dialog>
    </>
  );
}

EditTeam.propTypes = {
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
      email:'',
      phone:'',
      password: '',
      user_location: '',
      bio: '',
    }),
    validationSchema,
  })(EditTeam),
);
