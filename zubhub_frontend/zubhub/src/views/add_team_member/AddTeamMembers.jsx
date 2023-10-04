import React, { useState, useEffect } from 'react';
import { Box, Paper, Grid, InputBase, Typography, FormControl, TextField, makeStyles, Chip } from '@material-ui/core';
import styles from '../../assets/js/styles/index';
import PropTypes from 'prop-types';
import API from '../../api/api';
import * as UserActions from '../../store/actions/userActions';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { useHistory } from 'react-router-dom';
import * as script from '../create_team/script';
import { useFormik } from 'formik';
import { connect } from 'react-redux';
import { CustomButton } from '../../components';
import * as addTeamMemberScript from './addTeamMemberScript';
import { toast } from 'react-toastify';

function AddTeamMembers(props) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const commonClasses = makeStyles(styles)();
  const api = new API();
  const [adminsInputValue, setAdminsInputValue] = useState('');
  const [membersInputValue, setMembersInputValue] = useState('');
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [adminSuggestions, setAdminSuggestions] = useState([]);
  const [memberSuggestions, setMemberSuggestions] = useState([]);

  const groupname = props.match.params.groupname;
  const formik = useFormik(script.formikSchema);


  const handleAdminSelect = (event, value) => {
    setSelectedAdmins(value);
    setAdminsInputValue('');
  };

  const handleMemberSelect = (event, value) => {
    setSelectedMembers(value);
    setMembersInputValue('');
  };
  
  const handleAdminsInputChange = async event => {
    const value = event.target.value;
    setAdminsInputValue('');

    // Perform API call to get admin suggestions based on the input value
    try {
      const completions = await api.autocompleteCreators({ query: value });
      const suggestions = completions.map(({ username, avatar }) => ({
        title: username,
        image: avatar,
        link: `/creators/${username}`,
      }));
      setAdminSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching admin suggestions:', error);
      setAdminSuggestions([]);
    }
  };

  const handleMemberInputChange = async event => {
    const value = event.target.value;
    setMembersInputValue('');

    // Perform API call to get member suggestions based on the input value
    try {
      const completions = await api.autocompleteCreators({ query: value });
      const suggestions = completions.map(({ username, avatar }) => ({
        title: username,
        image: avatar,
        link: `/creators/${username}`,
      }));
      setMemberSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching member suggestions:', error);
      setMemberSuggestions([]);
    }
  };

  const history = useHistory();
  const submitMember = async () => {
    try {
      const uploadMember = await addTeamMemberScript.addMember({ ...props, ...formik });
      // console.log(JSON.stringify(`heeeeeeeeeeeee  and the ${JSON.stringify(uploadMember)}`));
      if (uploadMember === 'success') {
        // Redirect to the desired URL on success
        const groupname = props.match.params.groupname
        // const teamGroupName = formik.values.groupname; // Get the groupname from props
        history.push(`/teams/${groupname}/members`);
      } else {
        const apiError = uploadMember;
        toast.error(
          `An unexpected error occurred. Please check if you have entered all details properly and try again.`,
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      marginY={6}
      style={{
        // backgroundColor:'purple',
        // width:'100vw',
        paddingLeft: '20px',
        paddingRight: '20px',
      }}
    >
      <FormControl fullWidth>
        <label
          style={{
            fontFamily: 'sans-serif',
            fontSize: '1.5rem',
            fontStyle: 'normal',
            fontWeight: 'bold',
          }}
        >
          Invite New Team Member <span className={commonClasses.colorRed}>*</span>
        </label>
        <br />
        <Grid item xs={12} className={commonClasses.commonClasses}>
          <Paper
            style={{
              padding: '16px',
            }}
          >
            <Typography
              gutterBottom
              component="h3"
              variant="p"
              color="textPrimary"
              className={commonClasses.commonClasses}
            >
              {'Admin'}
            </Typography>
            <div style={{ display: 'flex', alignItems: '' }}>
              <ErrorOutlineIcon style={{ marginRight: '8px', fontWeight: 'normal', fontSize: '18px' }} />
              <span>
                {
                  'Admins can assign admin status to other team members, add and remove team members, add team to a project, delete team profile'
                }
              </span>
            </div>
          </Paper>
          <br></br>
        </Grid>
        <Autocomplete
          multiple // Allow multiple selections
          options={adminSuggestions}
          getOptionLabel={option => option.title}
          value={selectedAdmins}
          onChange={(event, value) => {
            handleAdminSelect(event, value);
            formik.setFieldValue('admins', value);
          }}
          renderOption={option => <div onClick={event => handleAdminSelect(event, [option])}>{option.title}</div>}
          renderInput={params => (
            <TextField
              {...params}
              variant="outlined"
              name="admins"
              placeholder="Enter team admins' usernames"
              value={adminsInputValue}
              onChange={handleAdminsInputChange}
              onBlur={() => setAdminSuggestions([])}
              error={formik.touched.title && formik.errors.title ? true : false}
              helperText={formik.touched.title && formik.errors.title}
            />
          )}
        />

        {/* <Box className={classes.tagsViewStyle}>
            {selectedAdmins.map((admin, index) => (
              <Chip
                key={index}
                label={admin.title}
                onDelete={() => setSelectedAdmins((admins) => admins.filter((a) => a !== admin))}
                color="secondary"
                variant="outlined"
              />
            ))}
          </Box> */}

        <Grid item xs={12}>
          {' '}
          <br></br>
          <br></br>{' '}
        </Grid>
        <Grid item xs={12} className={commonClasses.commonClasses}>
          <Paper className={commonClasses.commonClasses} style={{ padding: '16px' }}>
            <Typography
              gutterBottom
              component="h3"
              variant="p"
              color="textPrimary"
              className={commonClasses.commonClasses}
            >
              {'Member'}
            </Typography>
            <div style={{ display: 'flex', alignItems: '' }}>
              <ErrorOutlineIcon style={{ marginRight: '8px', fontWeight: 'normal', fontSize: '18px' }} />
              <span>{'Members can add team to a project, view team members and leave at their convenience'}</span>
            </div>
          </Paper>
          <br></br>
        </Grid>
        <Autocomplete
          multiple // Allow multiple selections
          options={memberSuggestions}
          getOptionLabel={option => option.title}
          value={selectedMembers}
          onChange={(event, value) => {
            handleMemberSelect(event, value);
            formik.setFieldValue('members', value);
          }}
          onInputChange={handleMemberInputChange}
          renderOption={option => <div onClick={event => handleMemberSelect(event, [option])}>{option.title}</div>}
          renderInput={params => (
            <TextField
              {...params}
              variant="outlined"
              name="members"
              placeholder="Enter team members' usernames"
              error={formik.touched.title && formik.errors.title ? true : false}
              helperText={formik.touched.title && formik.errors.title}
            />
          )}
        />

        {/* <Box className={classes.tagsViewStyle}>
            {selectedMembers.map((member, index) => (
              <Chip
                key={index}
                label={member.title}
                onDelete={() => setSelectedMembers((members) => members.filter((m) => m !== member))}
                color="secondary"
                variant="outlined"
              />
            ))}
          </Box> */}

        <Box
          style={{
            width: 'fit',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'end',
            alignItems: 'end',
            marginTop: '1rem',
          }}
        >
          <CustomButton variant="contained" primaryButtonStyle onClick={submitMember}>
            {`Add Member`}
          </CustomButton>
        </Box>
      </FormControl>
    </Box>
  );
}

AddTeamMembers.propTypes = {
  auth: PropTypes.object.isRequired,
  addMembersToTeam: PropTypes.func.isRequired,
};
const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(AddTeamMembers);
