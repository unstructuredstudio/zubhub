import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Grid, makeStyles, Backdrop } from '@material-ui/core';
import styles from '../../assets/js/styles'
import { customStyles } from './styles';
import Project from '../../components/project/Project';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ZubhubAPI from '../../api/api';
import CustomButton from '../../components/button/Button';
import { toast } from 'react-toastify';

/**
 * @function AddTeamProject
 * @author  Gift <giftnamulika@gmail.com>
 *
 * @todo - describe method's signature
 */
function AddTeamProject(props) {
  const API = new ZubhubAPI();

  console.log(props);
  const commonClasses = makeStyles(styles)();
  const classes = makeStyles(customStyles)();
  const { username, token } = props.auth;
  const groupname = props.match.params.groupname;
  const [teamProfile, setTeamProfile] = useState({});
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState(teamProfile?.projects ?? []);

  const handleProjectClick = useMemo(
    () => projectId => {
      const isAdded = selectedProjects.includes(projectId);
      if (isAdded) {
        setSelectedProjects(prevSelectedProjects => prevSelectedProjects.filter(p => p.id === projectId));
      } else {
        setSelectedProjects(prevSelectedProjects => [...prevSelectedProjects, projectId]);
      }
    },
    [selectedProjects],
  );

  const handleSave = useCallback(async () => {
    // const payload = {
    //   groupname: groupname,
    //   data: {
    //     add_projects: selectedProjects,
    //     remove_projects: projects.filter(p => !selectedProjects.includes(p.id)),
    //   },
    //   token: props.auth.token,
    // };

    const payload = {
      token: token,
      groupname: groupname,
      description: teamProfile?.description,
      // description: "Your Group Description", // Replace with the actual description
      add_projects: selectedProjects.map(project => ({ id: project })),
      remove_projects: projects
        .filter(project => !selectedProjects.some(selectedProject => selectedProject.id === project))
        .map(project => ({ id: project })),
    };

    try {
      const response = await API.addTeamProjects(payload);
      toast.success('Successfully added new projects');

      if (response.status === 200) {
        props.history.push(`/teams/${username}`);
      }
    } catch (error) {
      toast.warning(error.message);
      console.error('Error saving projects', error);
    }
  }, [projects, props.auth.token, props.match.params.groupname, selectedProjects]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const teamResponse = await API.getTeamProfile({ groupname, ...props });
        const userResponse = await API.getUserProjects({ username, ...props });
        setTeamProfile(teamResponse);
        setProjects(userResponse.results);
        console.log(teamResponse, 'response');
        setSelectedProjects(teamResponse?.projects?.map(p => p.id));
      } catch (error) {
        toast.warning(`Error fetching projects ${error.message}`);
        console.error('Error fetching projects:', error);
      }
    }

    fetchProjects();
  }, [username]);

  console.log(selectedProjects, 'Selected');
  console.log(projects, 'Available');
  return (
    <>
      <label htmlFor="" className={commonClasses.title2} style={{ alignItems: 'center' }}>
        Select a project to Add. Unselect to Remove
      </label>
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {Array.isArray(projects) &&
          projects.map(project => (
            <Grid item xs={12} sm={6} md={6} className={classes.projectGridStyle} align="center" key={project.id}>
              <div
                onClick={() => handleProjectClick(project.id)}
                style={{ position: 'relative', marginLeft: '16px', marginRight: '16px', cursor: 'pointer' }}
              >
                <Project project={project} {...props} nonLinkable />
                  <Backdrop
                    open={true}
                    style={{
                      position: 'absolute',
                      backgroundColor: selectedProjects?.includes(project.id) ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
                      backdropFilter: selectedProjects?.includes(project.id) ? 'blur(5px)' : 'none',
                      borderRadius: '15px',
                      cursor: 'pointer',
                      zIndex: 1,
                      top: 0,
                      left: 0,
                    }}
                  >
                    {
                      selectedProjects?.includes(project.id) && (
                        <span
                        style={{
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <CheckCircleIcon style={{ color: 'white', marginRight: '5px' }} />
                        Project Added
                      </span>
                      )
                    }
                  </Backdrop>
                {/* )} */}
              </div>
            </Grid>
          ))}
      </Grid>
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '4rem' }}>
        <CustomButton primaryButtonOutlinedStyle>Cancel</CustomButton>
        <CustomButton primaryButtonStyle onClick={handleSave}>
          Save
        </CustomButton>
      </div>
    </>
  );
}

AddTeamProject.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
    projects: state.projects,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AddTeamProject);
