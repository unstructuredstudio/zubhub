import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import { withFormik } from 'formik';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  ClickAwayListener,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { ArrowBack, ErrorOutline } from '@material-ui/icons'
import {
  deleteAccount,
  editProfile,
  getLocations,
  getTeamProfile,
  handleToggleDeleteAccountModal,
  handleTooltipClose,
  handleTooltipOpen,
  validationSchema,
} from './editTeamScripts';

import styles from '../../assets/js/styles/views/edit_team/editTeamStyles.js';
import { modalStyles } from '../../components/modals/modal.styles';
import CustomButton from '../../components/button/Button';
import { Modal } from '../../components'
import * as AuthActions from '../../store/actions/authActions';
import * as UserActions from '../../store/actions/userActions';

const useStyles = makeStyles(styles);
const useModalStyles = makeStyles(modalStyles)
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
  const modal_classes = useModalStyles();

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
                onSubmit={e => editProfile(e, groupname, props)}
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  color="textPrimary"
                  className={classes.titleStyle}
                >
                  {t('editTeam.label')}
                </Typography>
                <Grid container spacing={2}>
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
                    <Typography
                      className={classes.descStyle}
                      variant="h6"
                      color="textPrimary"
                      component="p"
                    >
                      {t('editTeam.inputs.name.label')}
                    </Typography>
                    <FormControl
                      className={clsx(classes.margin, classes.textField)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      margin="dense"
                      error={
                        (props.status && props.status['groupname']) ||
                        (props.touched['groupname'] && props.errors['groupname'])
                      }
                    >
                      <ClickAwayListener
                        onClickAway={() => handleSetState(handleTooltipClose())}
                      >
                        <Tooltip
                          title={t('editTeam.inputs.name.request')}
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
                            value={props.values?.groupname ?? ''}
                            onClick={() => handleSetState(handleTooltipOpen())}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
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
                          t('editTeam.inputs.name.errors.required'))
                        }
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
                      {t('editTeam.inputs.bio.label')}
                    </Typography>
                    <FormControl
                      className={clsx(classes.margin, classes.textField)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      margin="dense"
                      error={
                        (props.status && props.status['description']) ||
                        (props.touched['description'] && props.errors['description'])
                      }
                    >
                      <OutlinedInput
                        ref={refs.description_el}
                        className={clsx(classes.customInputStyle)}
                        id="description"
                        name="description"
                        type="text"
                        multiline
                        rows={6}
                        rowsMax={6}
                        placeholder={t('editTeam.bio.description')}
                        value={props.values?.description ?? ''}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                      />
                      <FormHelperText
                        className={classes.fieldHelperTextStyle}
                        error
                      >
                        {(props.status && props.status['description']) ||
                          (props.touched['description'] &&
                            props.errors['description'] &&
                            t(
                              `editTeam.inputs.bio.errors.${props.errors['bio']}`,
                            ))}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <CustomButton
                      className={classes.customButtonStyle}
                      variant="contained"
                      size="large"
                      primaryButtonStyle
                      type="submit"
                      fullWidth
                      customButtonStyle
                    >
                      {t('editTeam.actions.submit')}
                    </CustomButton>
                  </Grid>
                </Grid>
              </form>
              <Grid container spacing={2} className={classes.marginTop}>
                <Grid item xs={12}>
                  <Typography
                    className={classes.descStyle}
                    variant="h6"
                    color="textPrimary"
                    component="p"
                  >
                    {t('editTeam.delete.question')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    className={classes.bodyStyle}
                    variant="body2"
                    component="p"
                    color="textPrimary"
                  >
                    {t('editTeam.delete.information1')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    component="p"
                    color="textPrimary"
                    className={classes.bodyStyle}
                  >
                    {t('editTeam.delete.information2')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Link 
                    href="#!"
                    onClick={handleButtonClick}
                    className={classes.textDecorationNone}
                  >
                    <Typography
                      variant="body2"
                      component="p"
                      color="textPrimary"
                      className={clsx(classes.bodyStyle, classes.linkStyle)}
                    >
                    {t('editTeam.delete.confirmation')}
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
            </CardContent>
          </CardActionArea>
        </Card>
      </Container>
    </Box>
      <Modal.WithIcon
        icon={<ErrorOutline className={modal_classes.dialogIcon} />}
        open={open_delete_account_modal}
        onClose={() => handleSetState(handleToggleDeleteAccountModal(state))}
      >
        <DialogTitle>
          <Typography
            variant="h5"
            component="h2"
            className={modal_classes.coloredTitle}
          >
            {t('editTeam.delete.question')}              
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body2"
            component="p"
            color="textPrimary"
          >
            {t('editTeam.delete.information1')}
          </Typography>
        </DialogContent>
        <DialogActions className={modal_classes.dialogActionsStyle}>
          <CustomButton
            variant="outlined"
            onClick={() =>
              handleSetState(handleToggleDeleteAccountModal(state))
            }
            secondaryButtonStyle
            className={modal_classes.iconButton}
          >
            <ArrowBack className={modal_classes.buttonIcon} />
            {t('editTeam.delete.buttons.cancel')}
          </CustomButton>
          <CustomButton
            variant="contained"
            onClick={e =>
              handleSetState(deleteAccount(groupname, props, state))
            }
            primaryButtonStyle
            className={modal_classes.iconButton}
          >
            {t('editTeam.delete.buttons.confirm')}
          </CustomButton>
        </DialogActions>
      </Modal.WithIcon>
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
