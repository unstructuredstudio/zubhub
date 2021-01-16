import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import { makeStyles } from '@material-ui/core/styles';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
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
import styles from '../../assets/js/styles/views/user_followers/userFollowersStyles';

const useStyles = makeStyles(styles);

const fetchPage = (page, props) => {
  const username = props.match.params.username;
  return props.get_followers({ page, username });
};

const toggle_follow = (e, props, state, id) => {
  e.preventDefault();
  if (!props.auth.token) {
    props.history.push('/login');
  } else {
    return props
      .toggle_follow({ id, token: props.auth.token })
      .then(res => {
        if (res.profile && res.profile.username) {
          const followers = state.followers.map(follower =>
            follower.id !== res.profile.id ? follower : res.profile,
          );
          return { followers };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(
            'An error occured while performing this action. Please try again later',
          );
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  }
};

const buildFollowers = (followers, classes, props, state, handleSetState) =>
  followers.map(follower => (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
      className={classes.followersGridStyle}
      align="center"
      key={follower.id}
    >
      <Link
        className={classes.textDecorationNone}
        to={`/creators/${follower.username}`}
      >
        <Card className={classes.cardStyle}>
          <Avatar
            className={classes.avatarStyle}
            src={follower.avatar}
            alt={follower.username}
          />
          {follower.id !== props.auth.id ? (
            <CustomButton
              variant="contained"
              onClick={(e, id = follower.id) =>
                handleSetState(toggle_follow(e, props, state, id))
              }
              primaryButtonStyle
            >
              {follower.followers.includes(props.auth.id)
                ? 'Unfollow'
                : 'Follow'}
            </CustomButton>
          ) : null}
          <Typography
            component="h3"
            color="textPrimary"
            className={classes.userNameStyle}
          >
            {follower.username}
          </Typography>
        </Card>
      </Link>
    </Grid>
  ));

function UserFollowers(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    followers: [],
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

  const { followers, prevPage, nextPage, loading } = state;
  const username = props.match.params.username;
  if (loading) {
    return <LoadingPage />;
  } else if (followers && followers.length > 0) {
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
                {username}'s followers
              </Typography>
            </Grid>
            {buildFollowers(followers, classes, props, state, handleSetState)}
          </Grid>
          <ButtonGroup
            aria-label="previous and next page buttons"
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
                Prev
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
                Next
              </CustomButton>
            ) : null}
          </ButtonGroup>
        </Container>
      </Box>
    );
  } else {
    return <ErrorPage error="user have not followers yet" />;
  }
}

UserFollowers.propTypes = {
  auth: PropTypes.object.isRequired,
  toggle_follow: PropTypes.func.isRequired,
  get_followers: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggle_follow: value => {
      return dispatch(UserActions.toggle_follow(value));
    },
    get_followers: value => {
      return dispatch(UserActions.get_followers(value));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserFollowers);
