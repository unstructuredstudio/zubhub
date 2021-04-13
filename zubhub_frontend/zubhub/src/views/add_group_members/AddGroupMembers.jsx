import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withFormik } from 'formik';
import * as Yup from 'yup';

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
  OutlinedInput,
  FormHelperText,
  FormControl,
  FormControlLabel,
  Switch,
} from '@material-ui/core';

import * as UserActions from '../../store/actions/userActions';
import csvLogo from '../../assets/images/csv.png';
import ErrorPage from '../error/ErrorPage';
import CustomButton from '../../components/button/Button';
import styles from '../../assets/js/styles/views/add_group_members/addGroupMembersStyles';
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

let csv_not_added = true;

const handleAddGroupMembersFieldChange = (e, props, refs) => {
  const children = refs.addGroupMembersEl.current.children;
  let arr = [];
  for (let index = 0; index < children.length; index++) {
    if (children[index].children[0].value) {
      arr.push(children[index].children[0].value);
    } else {
      if (index >= 1) {
        arr.push('');
      }
    }
  }

  props.setFieldValue('group_members', JSON.stringify(arr), true);
};

const handleBulkAddCheck = bulkAddChecked => ({
  bulkAddChecked: !bulkAddChecked,
});

const handleAddCSV = (e, refs) => {
  e.preventDefault();
  if (e.dataTransfer.items[0].getAsFile() !== null) {
    return { csv: e.dataTransfer.items[0].getAsFile() };
  } else {
    refs.dragDropEl.current.style.border = '1px dashed rgb(196, 194, 194)';
  }
};

const buildGroupMembersNodes = ({ props, refs, classes, commonClasses }) => {
  if (props.values['group_members']) {
    return JSON.parse(props.values['group_members']).map((member, index) => (
      <OutlinedInput
        key={index}
        className={clsx(classes.customInputStyle, commonClasses.marginTop1em)}
        type="text"
        onBlur={() => props.setFieldTouched('group_members', true)}
        onChange={e => handleAddGroupMembersFieldChange(e, props, refs)}
        value={member}
        placeholder={`${index + 1}.`}
      />
    ));
  } else {
    return ['', '', ''].map((member, index) => (
      <OutlinedInput
        key={index}
        className={clsx(classes.customInputStyle, commonClasses.marginTop1em)}
        type="text"
        onBlur={() => props.setFieldTouched('group_members', true)}
        onChange={e => handleAddGroupMembersFieldChange(e, props, refs)}
        placeholder={`${index + 1}.`}
      />
    ));
  }
};

const addGroupMembersNode = (e, props) => {
  e.preventDefault();
  let group_members = props.values['group_members'];
  if (!group_members) {
    props.setFieldValue('group_members', '["","","",""]');
  } else {
    group_members = JSON.parse(group_members);
    group_members.push('');
    props.setFieldValue('group_members', JSON.stringify(group_members));
  }
};

function AddGroupMembers(props) {
  const refs = {
    addGroupMembersEl: React.useRef(null),
    dragDropEl: React.useRef(null),
  };
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const [state, setState] = React.useState({
    loading: true,
    error: null,
    csv: null,
    upload_dialog: false,
    bulkAddChecked: false,
  });

  const submit = () => {
    let { upload_dialog, csv } = state;
    upload_dialog = true;
    handleSetState({ upload_dialog });
    csv = csv ? csv : new File([''], 'empty');
    let group_members = null;

    if (props.values['group_members']) {
      group_members = JSON.parse(props.values['group_members']).filter(value =>
        value ? true : false,
      );
    } else {
      group_members = [];
    }

    const data = new FormData();
    data.append('csv', csv);
    data.append('group_members', JSON.stringify(group_members));

    props
      .add_members({
        data,
        token: props.auth.token,
        t: props.t,
        history: props.history,
      })
      .catch(error => {
        const messages = JSON.parse(error.message);
        if (typeof messages === 'object') {
          const server_errors = {};
          Object.keys(messages).forEach(key => {
            if (key === 'non_field_errors') {
              server_errors['non_field_errors'] = messages[key][0];
            } else {
              server_errors[key] = messages[key][0];
            }
          });
          props.setStatus({ ...server_errors });
        } else {
          props.setStatus({
            non_field_errors: props.t('addGroupMembers.errors.unexpected'),
          });
        }
      });

    upload_dialog = !upload_dialog;

    handleSetState({ upload_dialog });
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!props.auth.token) {
      props.history.push('/login');
    } else {
      props.setFieldTouched('group_members');

      props.validateForm().then(errors => {
        if (Object.keys(errors).length > 0) {
          return;
        } else {
          submit();
        }
      });
    }
  };

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState({ ...state, ...obj });
      });
    }
  };

  const { upload_dialog, bulkAddChecked, csv } = state;
  const { t } = props;
  csv_not_added = !csv;
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
                  onSubmit={handleSubmit}
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

                    <Grid item xs={12} className={commonClasses.marginTop1em}>
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
                              commonClasses.marginBottom1em,
                            )}
                          >
                            {t('addGroupMembers.inputs.groupMembers.label')}
                          </Typography>
                        </label>

                        <Grid container spacing={1} alignItems="flex-end">
                          {!bulkAddChecked ? (
                            <>
                              <Grid item xs={12} sm={8}>
                                <Box ref={refs.addGroupMembersEl}>
                                  {buildGroupMembersNodes({
                                    props,
                                    refs,
                                    classes,
                                    commonClasses,
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
                                ref={refs.dragDropEl}
                                onDragLeave={e => {
                                  refs.dragDropEl.current.style.border =
                                    '1px dashed rgb(196, 194, 194)';
                                }}
                                onDragOver={e => {
                                  e.preventDefault();
                                  refs.dragDropEl.current.style.border =
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
                        className={commonClasses.floatLeft}
                        control={
                          <Switch
                            className={classes.bulkAddStyles}
                            checked={bulkAddChecked}
                            onChange={e =>
                              handleSetState(handleBulkAddCheck(bulkAddChecked))
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
                        className={commonClasses.floatRight}
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
  add_members: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    add_members: args => {
      return dispatch(UserActions.add_members(args));
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
    validationSchema: Yup.object().shape({
      group_members: Yup.string().test('empty', 'required', value => {
        let is_empty = true;

        value &&
          JSON.parse(value).forEach(member => {
            if (member) {
              is_empty = false;
            }
          });

        is_empty &= csv_not_added;

        return !is_empty;
      }),
    }),
  })(AddGroupMembers),
);
