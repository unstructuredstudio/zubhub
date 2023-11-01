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
  const groupname = props.match.params.groupname;
  const { username, token } = props.auth;
  const [teamProfile, setTeamProfile] = useState({});
  const [projects, setProjects] = useState([]);
  const [initialSelected, setInitialSelected] = useState([])
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const currentUserRole = teamProfile?.members?.find(m => m.member === username)?.role;
    if (!isLoading && currentUserRole !== 'admin') {
      props.history.push(`/teams/${teamProfile.groupname}`);
    }
  }, [teamProfile.groupname, teamProfile?.members, username, props.history, isLoading]);

  const handleProjectClick = useCallback(
    (project) => {
      const isAdded = selectedProjects.some((p) => p.id === project.id);
      if (isAdded) {
        setSelectedProjects(prevSelectedProjects => prevSelectedProjects.filter(p => p.id !== project.id));
      } else {
        setSelectedProjects(prevSelectedProjects => [...prevSelectedProjects, project]);
      }
    },
    [selectedProjects],
  );

  const handleSave = useCallback(async () => {
    const unselectedProjects = initialSelected?.filter(project => !selectedProjects.some(p => p.id === project.id));
    const newlySelected = selectedProjects?.filter(project => !initialSelected.some(p => p.id === project.id));

    const args = {
      token: token,
      payload: {
      groupname: groupname,
      description: teamProfile?.description,
      add_projects: newlySelected.length > 0 ? newlySelected : null,
      remove_projects: unselectedProjects.length > 0 ? unselectedProjects : null,
      }
    };

    try {
      const response = await API.updateTeamProjects(args);
      toast.success('Updated successfully');

      if (response.status === 200) {
        props.history.push(`/teams/${username}`);
      }
    } catch (error) {
      toast.warning(error.message);
      console.error('Error updating projects', error);
    }
  }, []);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const teamResponse = await API.getTeamProfile({ groupname, ...props });
        const userResponse = await API.getUserProjects({ username, ...props });
        setTeamProfile(teamResponse);
        setIsLoading(false)
        setInitialSelected(teamResponse?.projects)
        setSelectedProjects(teamResponse?.projects)
        setProjects([...userResponse.results, ...selectedProjects]);
      } catch (error) {
        toast.warning(`Error fetching projects ${error.message}`);
        console.error('Error fetching projects:', error);
      }
    }

    fetchProjects();
  }, [username]);

  const checkStatus = (projectId) => {
    return selectedProjects?.some((project) => project.id === projectId);
  }

  return (
    <>
      <label htmlFor="" className={commonClasses.title2} style={{ alignItems: 'center' }}>
        Select a project to Add. Unselect to Remove
      </label>
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {Array.isArray(projects) &&
          projects.map((project, index) => (
            <Grid item xs={12} sm={6} md={6} className={classes.projectGridStyle} align="center" key={project.id}>
              <div
                onClick={() => handleProjectClick(project)}
                style={{ position: 'relative', marginLeft: '16px', marginRight: '16px', cursor: 'pointer' }}
              >
                <Project project={project} {...props} nonLinkable />
                  <Backdrop
                    open={true}
                    style={{
                      position: 'absolute',
                      backgroundColor: checkStatus(project.id) ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
                      backdropFilter: checkStatus(project.id) ? 'blur(5px)' : 'none',
                      borderRadius: '15px',
                      cursor: 'pointer',
                      zIndex: 1,
                      top: 0,
                      left: 0,
                    }}
                  >
                    {
                      checkStatus(project.id) && (
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
