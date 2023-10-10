import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
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
  getTeamProfile,
} from './editTeamScripts';

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
function EditTeam(props) {
  const refs = {
    username_el: React.useRef(null),
    location_el: React.useRef(null),
    email_el: React.useRef(null),
    phone_el: React.useRef(null),
    bio_el: React.useRef(null),
  };
  const username_check= React.useRef(null);
  const history = useHistory();

  const [state, setState] = React.useState({
    locations: [],
    tool_tip_open: false,
    dialog_error: null,
    open_delete_account_modal: false,
    show_password: false,
  });
  const [info, setInfo] = React.useState({
    groupname:"",
    description:""
  });
  const { groupname } = useParams();
  
  React.useEffect(() => {
    getProfile(refs, props);
    const promises= getTeamProfile(groupname, props);
    
    handleSetState(getLocations(props));
    handleSetInfo(promises);

    // Promise.all(promises).then(values => {
    //   handleSetInfo({ ...values });
    // });
  }, []);

  const classes = useStyles();
  const { show_password } = state;

  const handleSetInfo = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setInfo(state => ({ ...state, ...obj }));
      });
    }
    
  };
  
  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { locations, tool_tip_open, open_delete_account_modal,dialog_error } = state;
  const { t } = props;
  const handleButtonClick = () => {
    handleSetState(handleToggleDeleteAccountModal(groupname,props,state));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await editProfile(e, groupname, info.groupname, info.description, props);
    if (success) {
      history.push(`/teams/${info.groupname}`);
    }
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
                onSubmit={handleSubmit}
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  color="textPrimary"
                  className={classes.titleStyle}
                >
                  {t('Edit Team')}
                </Typography>
                <Typography
                  className={classes.descStyle}
                  variant="body2"
                  color="textSecondary"
                  component="p"
                >
                  {'Do you want to make some changes to this team? Go ahead!'}
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
                  <Grid item xs={12} sm={12} md={12}>
                    <FormControl
                      className={clsx(classes.margin, classes.textField)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      margin="normal"
                      error={
                        (props.status && props.status['groupname']) ||
                        (props.touched['groupname'] && props.errors['groupname'])
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="groupname"
                      >
                        {t('Team Name')}
                      </InputLabel>
                      <ClickAwayListener
                        onClickAway={() => handleSetState(handleTooltipClose())}
                      >
                        <Tooltip
                          title={t('Enter your Team Name')}
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
                            id="groupname"
                            name="groupname"
                            type="text"
                            value={
                              info.groupname ? info.groupname : ''
                            }
                            onClick={() => handleSetState(handleTooltipOpen())}
                            onChange={event => setInfo({ ...info, groupname: event.target.value })}
                            onBlur={props.handleBlur}
                            label={t('Team Name')}
                          />
                        </Tooltip>
                      </ClickAwayListener>
                      <FormHelperText
                        className={classes.fieldHelperTextStyle}
                        error
                      >
                        {(props.status && props.status['groupname']) ||
                          (props.touched['groupname'] &&
                            props.errors['groupname'] &&
                          'Team name is required' )
                        }
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
                        value={info.description ? info.description : ''}
                        onChange={event => setInfo({ ...info, description: event.target.value })}
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
                          {'Tell us about your team!'}
                        </Typography>
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
                  handleSetState(deleteAccount(groupname, props, state))
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
  getTeamProfile: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getTeamProfile: args => {
      return dispatch(UserActions.getTeamProfile(args));
    },
    getAuthUser: props => {
      return dispatch(AuthActions.getAuthUser(props));
    },
    editTeam: props => {
      return dispatch(UserActions.editTeam(props));
    },
    deleteTeam: props => {
      return dispatch(UserActions.deleteTeam(props));
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
      groupname:'',
      description:''
    }),
    validationSchema,
  })(EditTeam),
);
