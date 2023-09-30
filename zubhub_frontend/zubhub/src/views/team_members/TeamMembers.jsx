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
import { Grid, Container, Box, Card, ButtonGroup, Typography, Avatar } from '@material-ui/core';

import { fetchPage, toggleFollow } from './teamMembersScripts';

import * as UserActions from '../../store/actions/userActions';
import CustomButton from '../../components/button/Button';
import ErrorPage from '../error/ErrorPage';
import LoadingPage from '../loading/LoadingPage';
import styles from '../../assets/js/styles/views/user_followers/userFollowersStyles';
import { ClickAwayListener } from '@material-ui/core';
import { Popper } from '@material-ui/core';
import * as  script from '../create_team/script'
import Step2 from '../create_team/step2/Step2';
import { useFormik } from 'formik';
import style from '../../assets/js/styles/views/profile/profileStyles'

const useStyles = makeStyles(styles);
const Styles = makeStyles(style)
/**
 * @function buildFollowers Component
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
const AddTeamMemberCard = (follower, classes, classe, groupname, id, props, state, handleSetState) => (
  <Link 
  className={classe.textDecorationNone}
  to={`/add/${groupname}`}
  >
  <Card
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      placeItems: 'center',
      paddingBottom: '1rem',
    }}
    className={classes.cardStyle}
  >
    <Box
      style={{ paddingTop: '1rem', display: 'block', placeItems: 'center', paddingLeft: '1rem', paddingRight: '2px' }}
    >
      <Typography component="h3" color="textPrimary" className={classes.userNameStyle}>
        {follower.title}
      </Typography>
      <Typography component="h3" color="textPrimary" style={{ textAlign: 'center', width: '18rem', fontSize: '1rem' }}>
        {follower.details}
      </Typography>
    </Box>
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
        {follower.buttonText}
      </CustomButton>
  
    </Box>
  </Card>
  </Link>
);
const buildFollowers = (updatedfollowers, open, classe, groupname, setOpen, classes, props, state, handleSetState) => {
  return (
    <>
      {updatedfollowers.map((follower, index) => (
        <Grid
          item
          className={classes.followersGridStyle}
          align="start"
          key={follower.id}
        >
          {index === 0
            ? AddTeamMemberCard(follower, classes, classe, groupname, props, state, handleSetState)
            : (
              <Card className={classes.cardStyle}>
                <div className={classes.editIconContainer} onClick={() => setOpen(!open)}>
                  <MdOutlineModeEdit size={30} className={classes.editIcon} />
                  {open && (
                    <ClickAwayListener onClickAway={() => setOpen(!open)}>
                      <Popper
                        open={open}
                        anchorEl={document.querySelector(`.${classes.editIconContainer}`)}
                        placement="bottom"
                        className={classes.popper}
                      >
                        <div className={classes.memberrole}>
                          {follower.role === 'admin' ? (
                            <div className={classes.roleItem}>
                              <GiCheckMark size={15} />
                              <h1 className={classes.checkedrole}>Admin</h1>
                            </div>
                          ) : (
                            <h1 className={classes.uncheckedRole}>Admin</h1>
                          )}
                          {follower.role === 'member' ? (
                            <div className={classes.roleItem}>
                              <GiCheckMark size={15} />
                              <h1 className={classes.checkedrole}>Member</h1>
                            </div>
                          ) : (
                            <h1 className={classes.uncheckedRole}>Member</h1>
                          )}
                          <hr style={{ paddingLeft: '6rem', paddingRight: '3rem', height: '1px' }} />
                          {
                            follower.additionalInfo.id !== props.auth.id ? (
                              <span className={classes.removeButton} onClick={() => alert("hello to the world")}>Remove</span>
                            ) : (
                              <span className={classes.removeButton} onClick={() => alert("hello to the world")}>Leave Team</span>
                            )
                          }
                        </div>
                      </Popper>
                    </ClickAwayListener>
                  )}
                </div>
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
                  {follower.additionalInfo.username}
                </Typography>
              </Card>
            )}
        </Grid>
      ))}
    </>
  );
}

/**
 * @function UserFollowers View
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function TeamMembers(props) {

  const classes = useStyles();
  const classe = Styles()

  const { groupname } = useParams();

  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState({
    followers: [],
    prev_page: null,
    next_page: null,
    loading: true,
    teamMembersIdAndRole: [],
  });

  const gpname = props.match.params.groupname
  if(groupname) {
  }
  const formik = useFormik(script.formikSchema)
  React.useEffect(() => {
    let obj = fetchPage(groupname, props);
    handleSetState(obj);
  }, []);

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


  // if (followers) {
  //   console.log(`I am trying to see the structure of the teamMembersIdAndRole ${JSON.stringify(teamMembersIdAndRole)}`);
  // }
  const updatedfollowers = [addNewMemberActionObject, ...teamMembersIdAndRole];
  const username = props.match.params.username;
  const { t } = props;
  if (loading) {
    return <LoadingPage />;
  } else if (followers && followers.length > 0) {
    return (
      <Box className={classes.root}>
        <Container className={classes.mainContainerStyle}>
          <Grid container spacing={3} justify="center">
            <Grid item xs={12}>
              <Typography className={classes.pageHeaderStyle} variant="h3" gutterBottom>
                {groupname}'s {t('Members')}
              </Typography>
            </Grid>
            {buildFollowers(updatedfollowers,  open,  classe, groupname, setOpen, classes, props, state, handleSetState)}
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

