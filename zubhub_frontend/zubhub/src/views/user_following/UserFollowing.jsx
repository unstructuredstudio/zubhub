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
  return props.get_following({ page, username });
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
          //   const following = state.following.map(creator =>
          //     creator.id !== res.profile.id ? creator : res.profile,
          //   );
          const { following } = state;
          following.forEach((creator, index) => {
            if (creator.id === res.profile.id) {
              following.splice(index, 1);
            }
          });
          return { following };
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

const buildFollowing = (following, classes, props, state, handleSetState) =>
  following.map(creator => (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
      className={classes.followersGridStyle}
      align="center"
      key={creator.id}
    >
      <Link
        className={classes.textDecorationNone}
        to={`/creators/${creator.username}`}
      >
        <Card className={classes.cardStyle}>
          <Avatar
            className={classes.avatarStyle}
            src={creator.avatar}
            alt={creator.username}
          />
          {creator.id !== props.auth.id ? (
            <CustomButton
              variant="contained"
              onClick={(e, id = creator.id) =>
                handleSetState(toggle_follow(e, props, state, id))
              }
              primaryButtonStyle
            >
              {creator.followers.includes(props.auth.id)
                ? 'Unfollow'
                : 'Follow'}
            </CustomButton>
          ) : null}
          <Typography
            component="h3"
            color="textPrimary"
            className={classes.userNameStyle}
          >
            {creator.username}
          </Typography>
        </Card>
      </Link>
    </Grid>
  ));

function UserFollowing(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    following: [],
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

  const { following, prevPage, nextPage, loading } = state;
  const username = props.match.params.username;
  if (loading) {
    return <LoadingPage />;
  } else if (following && following.length > 0) {
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
                Creators {username} is following
              </Typography>
            </Grid>
            {buildFollowing(following, classes, props, state, handleSetState)}
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
    return <ErrorPage error="Creator is not following anyone yet" />;
  }
}

UserFollowing.propTypes = {
  auth: PropTypes.object.isRequired,
  toggle_follow: PropTypes.func.isRequired,
  get_following: PropTypes.func.isRequired,
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
    get_following: value => {
      return dispatch(UserActions.get_following(value));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserFollowing);
