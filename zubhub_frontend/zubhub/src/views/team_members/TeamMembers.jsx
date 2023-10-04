import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { MdOutlineModeEdit } from 'react-icons/md';
import { GiCheckMark } from 'react-icons/gi';
import { makeStyles } from '@material-ui/core/styles';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Grid, Container, Box, Card, ButtonGroup, Typography, Avatar, Button } from '@material-ui/core';

import { fetchPage, toggleFollow } from './teamMembersScripts';

import * as UserActions from '../../store/actions/userActions';
import CustomButton from '../../components/button/Button';
import ErrorPage from '../error/ErrorPage';
import LoadingPage from '../loading/LoadingPage';
import styles from '../../assets/js/styles/views/user_followers/userFollowersStyles';
import { ClickAwayListener } from '@material-ui/core';
import { Popper, Popover } from '@material-ui/core';
import * as script from '../create_team/script';
import Step2 from '../create_team/step2/Step2';
import { useFormik } from 'formik';
import style from '../../assets/js/styles/views/profile/profileStyles';
import { useHistory } from 'react-router-dom';
import * as  addTeamMemberScript from '../add_team_member/addTeamMemberScript'

const useStyles = makeStyles(styles);
const Styles = makeStyles(style);
/**
 * @function buildFollowers Component
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */

/**
 * @function UserFollowers View
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function TeamMembers(props) {
  const classes = useStyles();
  const classe = Styles();
 const token = props.auth.token
  const groupname  = props.match.params.groupname;

  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState({
    followers: [],
    prev_page: null,
    next_page: null,
    loading: true,
    editted:false,
    deleted:false,
    teamMembersIdAndRole: [],
  });

  const [updatedRole, setUpdatedRole] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState({});

  const handleClick = (event, memberId) => {
    setAnchorEl(prevAnchorEl => ({
      ...prevAnchorEl,
      [memberId]: event.currentTarget,
    }));
  };

  const handleClose = memberId => {
    setAnchorEl(prevAnchorEl => ({
      ...prevAnchorEl,
      [memberId]: null,
    }));
  };

 
 
  React.useEffect(() => {
    let obj = fetchPage(groupname, props);
    handleSetState(obj);
  }, [groupname, props, state.deleted, state.editted]);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  let addNewMemberActionObject = {
    title: 'Invite new team Members',
    details: `you can invite new team members by adding the people you worked on a project with`,
    buttonText: ' Add team members',
  };
  const { followers, teamMembersIdAndRole, prev_page, next_page, loading } = state;

  const updatedfollowers = [addNewMemberActionObject, ...teamMembersIdAndRole];
  const username = props.match.params.username;
  const { t } = props;

 

  const history = useHistory();

  const updateRole = async (username, role) => { 
    const member = {
      member:username,
      role:role
    }
    try {
      const uploadMember = await addTeamMemberScript.updatedMemberRole({...props},member);

      if (uploadMember.includes('User Updated')) {
        // Redirect to the desired URL on success
        const groupname = props.match.params.groupname
        setUpdatedRole(true)
        setState(state => ({ ...state, editted:true}))
        toast.success(
          `user updated successfully`
        )
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


 
  const deleteMember = async (groupname,username,token) => {
    try {
      const response = await addTeamMemberScript.removeMember(groupname,username,token,{...props,...teamMembersIdAndRole})
      console.log();
      console.log(JSON.stringify(response));
      if (response === 'success') {
        // Redirect to the desired URL on success
        const groupname = props.match.params.groupname
        setState(state => ({ ...state, deleted:true}))
        toast.success(
          `user deleted successfully`
        )

        history.push(`/teams/${groupname}/members`);
      } else {
        const apiError = response;
        toast.error(
          `An unexpected error occurred. Please check if you have entered all details properly and try again.`,
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  if (loading) {
    return <LoadingPage />;
  } else if (followers && followers.length > 0) {
    return (
      <Box className={classes.root} >
        <Container className={classes.mainContainerStyle}>
          <Grid container spacing={3} justify="center" >
            <Grid item xs={12}>
              <Typography className={classes.pageHeaderStyle} variant="h3" gutterBottom>
                {groupname}'s {t('Members')}
              </Typography>
            </Grid>

            {updatedfollowers.map((follower, index) => (
              <Grid item className={classes.followersGridStyle} align="start" key={follower.id}>
                {index === 0 ?
                (
                  // <AddTeamMemberCard classes={classes} groupname={groupname} props={props}/>
                  <Card
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                    placeItems: 'center',
                    paddingTop: '1rem',
                    borderRadius:'15px',
                    marginTop:'1rem',
                  }}
                  className={classes.cardStyle}
                  >
                  <Box
                    style={{ paddingTop: '1rem', display:'block', placeItems: 'center', paddingLeft: '0.5rem', paddingRight: '0.5rem', }}
                    >
                    <Typography component="h3" color="textPrimary"
                     style={{
                      fontSize:'1.5rem',
                      fontWeight:'bold',
                      fontFamily:'sans-serif',
                      marginBottom:'1rem'
                    }}
                    
                    >
                      {`Invite new team Members`}
                    </Typography>
                    <Typography component="h3" color="textPrimary" style={{ textAlign: 'center', width: '18rem', fontSize: '1rem' }}>
                      {`you can invite new team members by adding the people you worked on a project with`}
                    </Typography>
                  </Box>
                  <Link 
                // className={classe.textDecorationNone}
              to={`/add/${groupname}`}
              >
                  <Box
                    style={{
                      display: 'block',
                      placeItems: 'center',
                      paddingLeft: '1rem',
                      paddingRight: '2px',
                      paddingBottom: '1.5rem',
                    }}
                    >
                    
                    <CustomButton variant="contained" primaryButtonStyle>
                      {` Add team members`}
                    </CustomButton>
                
                  </Box>
                </Link>
                </Card>
                ) : (
                  <Card className={classes.cardStyle}>
                      <ClickAwayListener onClickAway={() => setOpen(!open)}>
                    <div
                      style={{
                        margin: '1rem',
                      }}
                      key={index}
                    >
                      {/* <Button variant="contained" onClick={event => handleClick(event, index)}> */}
                      <div className={classes.editIconContainer} onClick={event => handleClick(event, index)}>
                  <MdOutlineModeEdit size={30} className={classes.editIcon} />
                  </div> 
                      <Popover
                        open={Boolean(anchorEl[index])}
                        anchorEl={anchorEl[index]}
                        onClose={() => handleClose(index)}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left',
                        }}
                      >
                       <div className={classes.memberrole}>
                          {follower.role === 'admin' ? (
                            <div className={classes.roleItem}>
                              <GiCheckMark size={15} />
                              <h1 className={classes.checkedrole}>Admin</h1>
                            </div>
                          ) : (
                            <h1 className={classes.uncheckedRole}   onClick={()=>updateRole(follower.additionalInfo.username,'admin')}>Admin</h1>
                          )}
                          {follower.role === 'member' ? (
                            <div className={classes.roleItem}>
                              <GiCheckMark size={15} />
                              <h1 className={classes.checkedrole}>Member</h1>
                            </div>
                          ) : (
                            <h1 className={classes.uncheckedRole} onClick={()=>updateRole(follower.additionalInfo.username,'member')}>Member</h1>
                          )}
                          <hr style={{ paddingLeft: '6rem', paddingRight: '3rem', height: '1px' }} />
                          {
                            follower.role !== 'admin' ? (
                              <span className={classes.removeButton}  onClick={() => deleteMember(groupname, follower.additionalInfo.username, token)}>Remove</span>
                            ) : (
                              <span className={classes.removeButton}onClick={() => deleteMember(groupname, follower.additionalInfo.username, token)}>Leave Team</span>
                            )
                          }
                        </div>
                      </Popover>
                    </div>
                    </ClickAwayListener>
                  
                    <Avatar
                      className={classes.avatarStyle}
                      src={follower.additionalInfo.avatar}
                      alt={follower.additionalInfo.username}
                    />
                    {follower.additionalInfo.id !== props.auth.id ? (
                      <CustomButton
                        variant="contained"
                        onClick={(e, id = follower.additionalInfo.id) =>
                          handleSetState(toggleFollow(e, props, state, id, toast))
                        }
                        primaryButtonStyle
                      >
                        {follower.additionalInfo.followers.includes(props.auth.id)
                          ? props.t('userFollowers.follower.unfollow')
                          : props.t('userFollowers.follower.follow')}
                      </CustomButton>
                    ) : null}
                    <Typography component="h3" color="textPrimary" className={classes.userNameStyle}>
                      {follower.additionalInfo.username.slice(0,9)}
                    </Typography>
                  </Card>
                )}
              </Grid>
            ))}
          </Grid>
          <ButtonGroup aria-label={t('userFollowers.ariaLabels.prevNxtButtons')} className={classes.buttonGroupStyle}>
            {prev_page ? (
              <CustomButton
                className={classes.floatLeft}
                size="large"
                startIcon={<NavigateBeforeIcon />}
                onClick={(e, page = prev_page.split('?')[1]) => {
                  handleSetState({ loading: true });
                  handleSetState(fetchPage(page, props));
                }}
                primaryButtonStyle
              >
                {t('userFollowers.prev')}
              </CustomButton>
            ) : null}
            {next_page ? (
              <CustomButton
                className={classes.floatRight}
                size="large"
                endIcon={<NavigateNextIcon />}
                onClick={(e, page = next_page.split('?')[1]) => {
                  handleSetState({ loading: true });
                  handleSetState(fetchPage(page, props));
                }}
                primaryButtonStyle
              >
                {t('userFollowers.next')}
              </CustomButton>
            ) : null}
          </ButtonGroup>
        </Container>
      </Box>
    );
  } else {
    return <ErrorPage error={t('This team has no members')} />;
  }
}

TeamMembers.propTypes = {
  auth: PropTypes.object.isRequired,
  toggleFollow: PropTypes.func.isRequired,
  getFollowers: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleFollow: args => {
      return dispatch(UserActions.toggleFollow(args));
    },
    getTeamMembers: args => {
      return dispatch(UserActions.getTeamMembers(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamMembers);
