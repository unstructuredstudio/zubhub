import React, { useState, useEffect } from 'react';
import { Box, Paper, Grid, InputBase, Typography, FormControl, TextField, makeStyles, Chip } from '@material-ui/core';
import styles from '../../../assets/js/styles';
import API from '../../../api/api';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

export default function Step2({ formik }) {
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

  const { values: { members, admins} } = formik

  const allMembers = [...(admins ? admins : []), ...(members ? members : [])]

  const handleAdminSelect = (event, value) => {
    setSelectedAdmins(value);
    setAdminsInputValue('');
  };

  const handleMemberSelect = (event, value) => {
    setSelectedMembers(value);
    setMembersInputValue('');
  };


  const handleAdminsInputChange = async (event) => {
    const value = event.target.value;
    setAdminsInputValue('');

    // Perform API call to get admin suggestions based on the input value
    try {
      const completions = await api.autocompleteCreators({ query: value });
      const suggestions = completions.map(({ username, avatar, id }) => ({
        title: username,
        image: avatar,
        link: `/creators/${username}`,
        id
      }));
      
      const filteredSuggestions = suggestions.filter(({ id }) => 
        !allMembers.some(member => member.id === id)
      );
      setAdminSuggestions(filteredSuggestions);
    } catch (error) {
      console.error('Error fetching admin suggestions:', error);
      setAdminSuggestions([]);
    }
  };

  const handleMemberInputChange = async (event) => {
    const value = event.target.value;
    setMembersInputValue('');

    // Perform API call to get member suggestions based on the input value
    try {
      const completions = await api.autocompleteCreators({ query: value });
      const suggestions = completions.map(({ username, avatar, id }) => ({
        title: username,
        image: avatar,
        link: `/creators/${username}`,
        id
      }));

      const filteredSuggestions = suggestions.filter(({ id }) => 
        !allMembers.some(member => member.id === id)
      );
      setMemberSuggestions(filteredSuggestions);
    } catch (error) {
      console.error('Error fetching member suggestions:', error);
      setMemberSuggestions([]);
    }
  };

  // const handleAdminSelect = (admin) => {
  //   setAdminsInputValue(admin.title);
  //   setAdminSuggestions([]);
  // };

  // const handleMemberSelect = (member) => {
  //   setMembersInputValue(member.title);
  //   setMemberSuggestions([]);
  // };

  return (
    <Box marginY={6}>
      <FormControl fullWidth>
      <label className={commonClasses.commonClasses}>
           Invite Team Members <span className={commonClasses.colorRed}>*</span>
          </label>
          <br />
          <Grid item xs={12} className={commonClasses.commonClasses}>
            <Paper className={commonClasses.commonClasses} style={{ padding: '16px' }}>
                <Typography
                gutterBottom
                component="h3"
                variant="p"
                color="textPrimary"
                className={commonClasses.commonClasses}
                >
                {('Admin')}
                </Typography>
                {/* <ErrorOutlineIcon /> {('Admins can assign admin status to other team members, add and remove team members, add team to a project, delete team profile')} */}
                <div style={{ display: 'flex', alignItems: '' }}>
                  <ErrorOutlineIcon style={{ marginRight: '8px', fontWeight: 'normal', fontSize: '18px'  }} />
                  <span>
                    {('Admins can assign admin status to other team members, add and remove team members, add team to a project, delete team profile')}
                  </span>
                </div>
            </Paper><br></br></Grid>
            <Autocomplete
          multiple // Allow multiple selections
          options={adminSuggestions}
          getOptionLabel={(option) => option.title}
          value={selectedAdmins}
          onChange={(event, value) => {
            handleAdminSelect(event, value);
            formik.setFieldValue('admins', value); 
          }}
          renderOption={(option) => (
            <div onClick={(event) => handleAdminSelect(event, [option])}>
              {option.title}
            </div>
          )}
          renderInput={(params) => (
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


        <Grid item xs={12}> <br></br><br></br> </Grid>
          <Grid item xs={12} className={commonClasses.commonClasses}>
            <Paper className={commonClasses.commonClasses} style={{ padding: '16px' }}>
                <Typography
                gutterBottom
                component="h3"
                variant="p"
                color="textPrimary"
                className={commonClasses.commonClasses}
                >
                {('Member')}
                </Typography>
                <div style={{ display: 'flex', alignItems: '' }}>
                  <ErrorOutlineIcon style={{ marginRight: '8px', fontWeight: 'normal', fontSize: '18px'  }} />
                  <span>
                  {('Members can add team to a project, view team members and leave at their convenience')}
                  </span>
                </div>
            </Paper><br></br></Grid>
            <Autocomplete
          multiple // Allow multiple selections
          options={memberSuggestions}
          getOptionLabel={(option) => option.title}
          value={selectedMembers}
          onChange={(event, value) => {
            handleMemberSelect(event, value);
            formik.setFieldValue('members', value);
          }}
          onInputChange={handleMemberInputChange}
          renderOption={(option) => (
            <div onClick={(event) => handleMemberSelect(event, [option])}>
              {option.title}
            </div>
          )}
          renderInput={(params) => (
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
      </FormControl>
    </Box>
  );
}