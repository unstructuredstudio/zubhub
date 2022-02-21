import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withFormik } from 'formik';

import 'react-toastify/dist/ReactToastify.css';

import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import {
  Grid,
  Box,
  Container,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  Typography,
  CircularProgress,
  FormHelperText,
  FormControl,
  FormControlLabel,
  OutlinedInput,
  Switch,
} from '@material-ui/core';

import {
  vars,
  validationSchema,
  handleBulkAddCheck,
  handleAddCSV,
  addGroupMembersNode,
  handleSubmit,
  handleAddGroupMembersFieldChange,
} from './addGroupMemberScripts';

import * as UserActions from '../../store/actions/userActions';
import csvLogo from '../../assets/images/csv.png';
import ErrorPage from '../error/ErrorPage';
import CustomButton from '../../components/button/Button';
import styles from '../../assets/js/styles/views/add_group_members/addGroupMembersStyles';
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);


/**
* @function buildGroupMembersNodes Component
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
const buildGroupMembersNodes = ({ props, refs, classes, common_classes }) => {
  if (props.values['group_members']) {
    return JSON.parse(props.values['group_members']).map((member, index) => (
      <OutlinedInput
        key={index}
        className={clsx(classes.customInputStyle, common_classes.marginTop1em)}
        type="text"
        onBlur={() => props.setFieldTouched('group_members', true)}
        onChange={e => handleAddGroupMembersFieldChange(e, props, refs)}
        value={member}
        placeholder={`${index + 1}.`}
      />
    ));
  } else {
    return ['', '', ''].map((_, index) => (
      <OutlinedInput
        key={index}
        className={clsx(classes.customInputStyle, common_classes.marginTop1em)}
        type="text"
        onBlur={() => props.setFieldTouched('group_members', true)}
        onChange={e => handleAddGroupMembersFieldChange(e, props, refs)}
        placeholder={`${index + 1}.`}
      />
    ));
  }
};


/**
* @function AddGroupMembers
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
function AddGroupMembers(props) {
  const refs = {
    add_group_members_el: React.useRef(null),
    drag_drop_el: React.useRef(null),
  };
  const classes = useStyles();
  const common_classes = useCommonStyles();

  const [state, setState] = React.useState({
    loading: true,
    error: null,
    csv: null,
    upload_dialog: false,
    bulk_add_checked: false,
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState({ ...state, ...obj });
      });
    }
  };

  const { upload_dialog, bulk_add_checked, csv } = state;
  const { t } = props;
  vars.csv_not_added = !csv;
  if (!props.auth.token) {
    return <ErrorPage error={t('addGroupMembers.errors.notLoggedIn')} />;
  } else if (props.auth.members_count === null) {
    return <ErrorPage error={t('addGroupMembers.errors.unauthorized')} />;
  } else {
    return (
      <Box className={classes.root}>
        <Container className={classes.containerStyle}>
          <Card className={classes.cardStyle}>
            <CardActionArea>
              <CardContent>
                <form
                  className="project-create-form"
                  name="create_project"
                  noValidate="noValidate"
                  onSubmit={e => handleSubmit(e, state, handleSetState, props)}
                >
                  <Typography
                    className={classes.titleStyle}
                    gutterBottom
                    variant="h5"
                    component="h2"
                    color="textPrimary"
                  >
                    {t('addGroupMembers.welcomeMsg.primary')}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                    className={classes.descStyle}
                  >
                    {t('addGroupMembers.welcomeMsg.secondary')}
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

                    <Grid item xs={12} className={common_classes.marginTop1em}>
                      <FormControl
                        variant="outlined"
                        size="small"
                        fullWidth
                        margin="small"
                        error={
                          (props.status && props.status['group_members']) ||
                          (props.touched['group_members'] &&
                            props.errors['group_members'])
                        }
                      >
                        <label htmlFor="add_group_members">
                          <Typography
                            color="textSecondary"
                            className={clsx(
                              classes.customLabelStyle,
                              common_classes.marginBottom1em,
                            )}
                          >
                            {t('addGroupMembers.inputs.groupMembers.label')}
                          </Typography>
                        </label>

                        <Grid container spacing={1} alignItems="flex-end">
                          {!bulk_add_checked ? (
                            <>
                              <Grid item xs={12} sm={8}>
                                <Box ref={refs.add_group_members_el}>
                                  {buildGroupMembersNodes({
                                    props,
                                    refs,
                                    classes,
                                    common_classes,
                                  })}
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={4}>
                                <CustomButton
                                  variant="outlined"
                                  size="large"
                                  onClick={e => addGroupMembersNode(e, props)}
                                  secondaryButtonStyle
                                  customButtonStyle
                                  fullWidth
                                >
                                  <AddIcon />{' '}
                                  {t(
                                    'addGroupMembers.inputs.groupMembers.addMore',
                                  )}
                                </CustomButton>
                              </Grid>
                              <FormHelperText
                                error
                                className={classes.fieldHelperTextStyle}
                              >
                                {(props.status &&
                                  props.status['group_members']) ||
                                  (props.touched['group_members'] &&
                                    props.errors['group_members'] &&
                                    t(
                                      `addGroupMembers.inputs.groupMembers.errors.${props.errors['group_members']}`,
                                    ))}
                              </FormHelperText>
                            </>
                          ) : (
                            <label
                              htmlFor="addcsv"
                              className={classes.addCSVStyles}
                            >
                              <Box
                                className={classes.CSVBoxStyles}
                                ref={refs.drag_drop_el}
                                onDragLeave={e => {
                                  refs.drag_drop_el.current.style.border =
                                    '1px dashed rgb(196, 194, 194)';
                                }}
                                onDragOver={e => {
                                  e.preventDefault();
                                  refs.drag_drop_el.current.style.border =
                                    '1px solid #878dcd';
                                }}
                                onDrop={e =>
                                  handleSetState(handleAddCSV(e, refs))
                                }
                              >
                                <img
                                  src={csvLogo}
                                  alt={
                                    csv
                                      ? csv.name
                                      : t(
                                          'addGroupMembers.inputs.groupMembers.addCSV',
                                        )
                                  }
                                />
                                <br />
                                {csv
                                  ? csv.name
                                  : t(
                                      'addGroupMembers.inputs.groupMembers.addCSV',
                                    )}
                                <FormHelperText
                                  error
                                  className={classes.fieldHelperTextStyle}
                                >
                                  {(props.status &&
                                    props.status['group_members']) ||
                                    (props.touched['group_members'] &&
                                      props.errors['group_members'] &&
                                      t(
                                        `addGroupMembers.inputs.groupMembers.errors.${props.errors['group_members']}`,
                                      ))}
                                </FormHelperText>
                                <input
                                  type="file"
                                  accept=".csv"
                                  style={{ display: 'none' }}
                                  id="addcsv"
                                  onChange={e =>
                                    handleSetState({
                                      csv: e.target.files[0],
                                    })
                                  }
                                />
                              </Box>
                            </label>
                          )}
                        </Grid>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <FormControlLabel
                        className={common_classes.floatLeft}
                        control={
                          <Switch
                            className={classes.bulkAddStyles}
                            checked={bulk_add_checked}
                            onChange={e =>
                              handleSetState(
                                handleBulkAddCheck(bulk_add_checked),
                              )
                            }
                          />
                        }
                        label={
                          <Typography
                            color="textSecondary"
                            className={classes.customLabelStyle}
                          >
                            {t('addGroupMembers.inputs.groupMembers.bulkAdd')}
                          </Typography>
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <CustomButton
                        variant="contained"
                        size="large"
                        type="submit"
                        primaryButtonStyle
                        customButtonStyle
                        fullWidth
                        className={common_classes.floatRight}
                      >
                        {t('addGroupMembers.inputs.submit')}
                      </CustomButton>
                    </Grid>
                  </Grid>
                </form>
                <Dialog
                  PaperProps={{
                    style: {
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      overflow: 'hidden',
                    },
                  }}
                  open={upload_dialog}
                  aria-label={t('addGroupMembers.ariaLabels.submitting')}
                >
                  <Box position="relative" display="inline-flex">
                    <CircularProgress
                      className={classes.uploadProgressStyle}
                      size={70}
                      thickness={6}
                    />
                  </Box>
                </Dialog>
              </CardContent>
            </CardActionArea>
          </Card>
        </Container>
      </Box>
    );
  }
}

AddGroupMembers.propTypes = {
  auth: PropTypes.object.isRequired,
  addMembers: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addMembers: args => {
      return dispatch(UserActions.addMembers(args));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  withFormik({
    mapPropsToValue: () => ({
      group_members: '',
    }),
    validationSchema,
  })(AddGroupMembers),
);
