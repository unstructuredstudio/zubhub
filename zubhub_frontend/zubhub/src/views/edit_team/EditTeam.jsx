import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { withFormik } from 'formik';

import { makeStyles } from '@material-ui/core/styles';

import {
  Grid,
  Box,
  Container,
  Card,
  CardActionArea,
  CardContent,
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
    description_el: React.useRef(null),
    groupname_el: React.useRef(null),
  };

  const [state, setState] = React.useState({
    locations: [],
    tool_tip_open: false,
    dialog_error: null,
    open_delete_account_modal: false,
  });
  const { groupname } = useParams();
  React.useEffect(() => {
    getTeamProfile(groupname, refs, props);
    handleSetState(getLocations(props)); 
  }, []);

  const classes = useStyles();
  
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
                onSubmit={e => editProfile(e, groupname, props)}
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
                            ref={refs.groupname_el}
                            className={clsx(classes.customInputStyle)}
                            id="groupname"
                            name="groupname"
                            type="text"
                            value={props.values.groupname ? props.values.groupname : ''}
                            onClick={() => handleSetState(handleTooltipOpen())}
                            onChange={props.handleChange}
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
                        (props.status && props.status['description']) ||
                        (props.touched['description'] && props.errors['description'])
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="description"
                      >
                        {t('editProfile.inputs.bio.label')}
                      </InputLabel>
                      <OutlinedInput
                        ref={refs.description_el}
                        className={clsx(classes.customInputStyle)}
                        id="description"
                        name="description"
                        type="text"
                        multiline
                        rows={6}
                        rowsMax={6}
                        value={props.values.description ? props.values.description : ''}
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
                          {'Tell us about your team!'}
                        </Typography>
                        {(props.status && props.status['description']) ||
                          (props.touched['description'] &&
                            props.errors['description'] &&
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  withFormik({
    mapPropsToValue: () => ({
      groupname:'',
      description:''
    }),
    validationSchema,
  })(EditTeam),
);
