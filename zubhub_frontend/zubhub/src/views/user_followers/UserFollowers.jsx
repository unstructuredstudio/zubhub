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

import { fetchPage, toggleFollow } from './userFollowersScripts';

import * as UserActions from '../../store/actions/userActions';
import CustomButton from '../../components/button/Button';
import ErrorPage from '../error/ErrorPage';
import LoadingPage from '../loading/LoadingPage';
import styles from '../../assets/js/styles/views/user_followers/userFollowersStyles';

const useStyles = makeStyles(styles);

/**
 * @function buildFollowers Component
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
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
                handleSetState(toggleFollow(e, props, state, id, toast))
              }
              primaryButtonStyle
            >
              {follower.followers.includes(props.auth.id)
                ? props.t('userFollowers.follower.unfollow')
                : props.t('userFollowers.follower.follow')}
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

/**
 * @function UserFollowers View
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function UserFollowers(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    followers: [],
    prev_page: null,
    next_page: null,
    loading: true,
  });

  React.useEffect(() => {
    handleSetState(fetchPage(null, props));
  }, []);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { followers, prev_page, next_page, loading } = state;
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
              <Typography
                className={classes.pageHeaderStyle}
                variant="h3"
                gutterBottom
              >
                {username}'s {t('userFollowers.title')}
              </Typography>
            </Grid>
            {buildFollowers(followers, classes, props, state, handleSetState)}
          </Grid>
          <ButtonGroup
            aria-label={t('userFollowers.ariaLabels.prevNxtButtons')}
            className={classes.buttonGroupStyle}
          >
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
    return <ErrorPage error={t('userFollowers.errors.noFollowers')} />;
  }
}

UserFollowers.propTypes = {
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
    getFollowers: args => {
      return dispatch(UserActions.getFollowers(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserFollowers);
