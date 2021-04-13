import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import { makeStyles } from '@material-ui/core/styles';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import AddIcon from '@material-ui/icons/Add';
import {
  Grid,
  Container,
  Box,
  Card,
  ButtonGroup,
  Typography,
  Avatar,
} from '@material-ui/core';

import * as UserActions from '../../store/actions/userActions';
import CustomButton from '../../components/button/Button';
import ErrorPage from '../error/ErrorPage';
import LoadingPage from '../loading/LoadingPage';
import styles from '../../assets/js/styles/views/group_members/groupMembersStyles';
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

const fetchPage = (page, props) => {
  const username = props.match.params.username;
  return props.get_members({ page, username, t: props.t });
};

const toggle_follow = (e, props, state, id) => {
  e.preventDefault();
  if (!props.auth.token) {
    props.history.push('/login');
  } else {
    return props
      .toggle_follow({ id, token: props.auth.token, t: props.t })
      .then(res => {
        if (res.profile && res.profile.username) {
          const members = state.members.map(member =>
            member.id !== res.profile.id ? member : res.profile,
          );
          return { members };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(props.t('groupMembers.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  }
};

const remove_member = (e, props, state, id) => {
  e.preventDefault();
  if (!props.auth.token) {
    props.history.push('/login');
  } else {
    return props
      .remove_member({ id, token: props.auth.token, t: props.t })
      .then(res => {
        if (res.profile && res.profile.username) {
          const { members } = state;
          members.forEach((creator, index) => {
            if (creator.id === res.profile.id) {
              members.splice(index, 1);
            }
          });
          return { members };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(props.t('groupMembers.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  }
};

const buildMembers = (members, style, props, state, handleSetState) =>
  members.map(member => (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
      className={style.classes.groupMembersGridStyle}
      align="center"
      key={member.id}
    >
      <Link
        className={style.commonClasses.textDecorationNone}
        to={`/creators/${member.username}`}
      >
        <Card className={style.classes.cardStyle}>
          <Avatar
            className={style.classes.avatarStyle}
            src={member.avatar}
            alt={member.username}
          />
          {member.id !== props.auth.id ? (
            <CustomButton
              variant="outlined"
              className={style.commonClasses.marginBottom1em}
              onClick={(e, id = member.id) =>
                handleSetState(toggle_follow(e, props, state, id))
              }
              secondaryButtonStyle
            >
              {member.followers.includes(props.auth.id)
                ? props.t('userFollowers.follower.unfollow')
                : props.t('userFollowers.follower.follow')}
            </CustomButton>
          ) : null}
          {props.auth.members_count !== null && props.match.params.username === props.auth.username ? (
            <CustomButton
              variant="outlined"
              onClick={(e, id = member.id) =>
                handleSetState(remove_member(e, props, state, id))
              }
              secondaryButtonStyle
            >
              {props.t('groupMembers.remove')}
            </CustomButton>
          ) : null}
          <Typography
            component="h3"
            color="textPrimary"
            className={style.classes.userNameStyle}
          >
            {member.username}
          </Typography>
        </Card>
      </Link>
    </Grid>
  ));

function GroupMembers(props) {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const [state, setState] = React.useState({
    members: [],
    prevPage: null,
    nextPage: null,
    loading: true,
  });

  React.useEffect(() => {
    handleSetState(fetchPage(null, props));
  }, []);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState({ ...state, ...obj });
      });
    }
  };

  const { members, prevPage, nextPage, loading } = state;
  const username = props.match.params.username;
  const { t } = props;
  if (loading) {
    return <LoadingPage />;
  } else if (members && members.length > 0) {
    return (
      <Box className={classes.root}>
        <Container className={classes.mainContainerStyle}>
          <Grid container spacing={3} justify="center">
            <Grid item xs={12}>
              <Typography
                className={classes.pageHeaderStyle}
                variant="h3"
                gutterBottom
              >
                {username}'s {t('groupMembers.title')}
              </Typography>

              {props.auth.members_count !== null && username === props.auth.username ? (
                <CustomButton
                  variant="contained"
                  className={commonClasses.floatRight}
                  startIcon={<AddIcon />}
                  primaryButtonStyle
                  onClick={() =>
                    props.history.push(`/creators/${username}/add-members`)
                  }
                >
                  {props.t('groupMembers.newMembers')}
                </CustomButton>
              ) : null}
            </Grid>
            {buildMembers(
              members,
              { classes, commonClasses },
              props,
              state,
              handleSetState,
            )}
          </Grid>
          <ButtonGroup
            aria-label={t('groupMembers.ariaLabels.prevNxtButtons')}
            className={classes.buttonGroupStyle}
          >
            {prevPage ? (
              <CustomButton
                className={classes.floatLeft}
                size="large"
                startIcon={<NavigateBeforeIcon />}
                onClick={(e, page = prevPage.split('?')[1]) => {
                  handleSetState({ loading: true });
                  handleSetState(fetchPage(page, props));
                }}
                primaryButtonStyle
              >
                {t('groupMembers.prev')}
              </CustomButton>
            ) : null}
            {nextPage ? (
              <CustomButton
                className={classes.floatRight}
                size="large"
                endIcon={<NavigateNextIcon />}
                onClick={(e, page = nextPage.split('?')[1]) => {
                  handleSetState({ loading: true });
                  handleSetState(fetchPage(page, props));
                }}
                primaryButtonStyle
              >
                {t('groupMembers.next')}
              </CustomButton>
            ) : null}
          </ButtonGroup>
        </Container>
      </Box>
    );
  } else {
    return (
      <>
        {props.auth.members_count !== null && username === props.auth.username ? (
          <CustomButton
            variant="contained"
            className={clsx(
              commonClasses.positionAbsolute,
              classes.floatingButtonStyle,
            )}
            startIcon={<AddIcon />}
            primaryButtonStyle
            onClick={() =>
              props.history.push(`/creators/${username}/add-members`)
            }
          >
            {props.t('groupMembers.newMembers')}
          </CustomButton>
        ) : null}
        <ErrorPage error={t('groupMembers.errors.noGroupMembers')} />
      </>
    );
  }
}

GroupMembers.propTypes = {
  auth: PropTypes.object.isRequired,
  toggle_follow: PropTypes.func.isRequired,
  get_members: PropTypes.func.isRequired,
  remove_member: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggle_follow: args => {
      return dispatch(UserActions.toggle_follow(args));
    },
    get_members: args => {
      return dispatch(UserActions.get_members(args));
    },
    remove_member: args => {
      return dispatch(UserActions.remove_member(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupMembers);
