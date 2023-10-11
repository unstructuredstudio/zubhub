import React, { useState } from 'react';
import { Box, Paper, Grid, Typography, FormControl, TextField, makeStyles, Breadcrumbs, Link } from '@material-ui/core';
import Stack from '@mui/material/Stack';
// import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import styles from '../../assets/js/styles/index';
import PropTypes from 'prop-types';
import API from '../../api/api';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { useHistory } from 'react-router-dom';
import * as script from '../create_team/script';
import { useFormik } from 'formik';
import { connect } from 'react-redux';
import { CustomButton } from '../../components';
import * as addTeamMemberScript from './addTeamMemberScript';
import { toast } from 'react-toastify';
import addTeamMemberStyle from './addTeamMember.style';
import { createProjectStyle } from '../create_project/createProject.style';
import KeyboardBackspaceRoundedIcon from '@material-ui/icons/KeyboardBackspaceRounded';
import { useDomElementHeight } from '../../hooks/useDomElementHeight.hook';
import { GrFormNext } from 'react-icons/gr';
function AddTeamMembers(props) {
  const commonClasses = makeStyles(styles)();
  const { height } = useDomElementHeight('navbar-root');
  const classes = makeStyles(addTeamMemberStyle)({ height });
  // const addMemberStyle = makeStyles(createProjectStyle)()
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

  function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  }

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/" onClick={handleClick}>
      MUI
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="inherit"
      href="/material-ui/getting-started/installation/"
      onClick={handleClick}
    >
      Core
    </Link>,
    <Typography key="3" color="text.primary">
      Breadcrumb
    </Typography>,
  ];

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
    if (selectedAdmins.length > 0 || selectedMembers.length > 0) {
      try {
        const uploadMember = await addTeamMemberScript.addMember(
          { ...props, ...formik },
          selectedAdmins,
          selectedMembers,
        );
        if (uploadMember === 'success') {
          // Redirect to the desired URL on success
          const groupname = props.match.params.groupname;
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
    }
  };

  return (
    <Box
      marginY={6}
      style={{
        // width:'100vw',
        paddingLeft: '20px',
        paddingRight: '20px',
      }}
    >
      <Box className={classes.banner}>
        <div onClick={() => history.push(`/teams/${groupname}/members`)}>
          <KeyboardBackspaceRoundedIcon />
        </div>
      </Box>
{/* 
      <Box>
        <Stack spacing={2}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
          <Breadcrumbs separator="-" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
          <Breadcrumbs
        separator={<GrFormNext fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
        </Stack>
      </Box> */}
      <FormControl fullWidth className={classes.formContainer}>
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
          freeSolo
          onChange={(event, value) => {
            handleAdminSelect(event, value);
            formik.setFieldValue('admins', value);
          }}
          renderOption={option => <div onClick={event => handleAdminSelect(event, [option])}>{option.title}</div>}
          renderInput={params => (
            <Box className={classes.textfieldBox}>
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
                classes={{ root: classes.customTextField }}
              />
              <>
                <CustomButton variant="contained" margin="normal" primaryButtonStyleNoRadius onClick={submitMember}>
                  {`Add Admin`}
                </CustomButton>
              </>
            </Box>
          )}
        />

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
          freeSolo
          onChange={(event, value) => {
            handleMemberSelect(event, value);
            formik.setFieldValue('members', value);
          }}
          onInputChange={handleMemberInputChange}
          renderOption={option => <div onClick={event => handleMemberSelect(event, [option])}>{option.title}</div>}
          renderInput={params => (
            <Box className={classes.textfieldBox}>
              <TextField
                {...params}
                variant="outlined"
                name="members"
                placeholder="Enter team members' usernames"
                error={formik.touched.title && formik.errors.title ? true : false}
                helperText={formik.touched.title && formik.errors.title}
                classes={{ root: classes.customTextField }}
              />

              <CustomButton variant="contained" margin="normal" primaryButtonStyleNoRadius onClick={submitMember}>
                {`Add Member`}
              </CustomButton>
            </Box>
          )}
        />
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
