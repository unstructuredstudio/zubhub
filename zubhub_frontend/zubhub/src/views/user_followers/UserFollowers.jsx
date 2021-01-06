import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {
  Grid,
  Container,
  Box,
  Card,
  ButtonGroup,
  Typography,
  Avatar,
} from "@material-ui/core";

import CustomButton from "../../components/button/Button";
import ErrorPage from "../error/ErrorPage";
import LoadingPage from "../loading/LoadingPage";
import styles from "../../assets/js/styles/views/user_followers/userFollowersStyles";

function UserFollowers(props) {
  const classes = makeStyles(styles)();

  const [state, setState] = React.useState({
    followers: [],
    prevPage: null,
    nextPage: null,
    loading: true,
  });

  React.useEffect(() => {
    fetchPage();
  }, []);

  const fetchPage = (page) => {
    let username = props.match.params.username;
    props.api
      .get_followers({ page, username })
      .then((res) => {
        if (Array.isArray(res.results)) {
          return setState({
            ...state,
            followers: res.results,
            prevPage: res.previous,
            nextPage: res.next,
            loading: false,
          });
        } else {
          res = Object.keys(res)
            .map((key) => res[key])
            .join("\n");
          throw new Error(res);
        }
      })
      .catch((error) => {
        setState({ ...state, loading: false });
        toast.warning(error.message);
      });
  };

  const toggle_follow = (e, id) => {
    e.preventDefault();
    if (!props.auth.token) {
      props.history.push("/login");
    } else {
      props.api
        .toggle_follow({ id, token: props.auth.token })
        .then((res) => {
          if (res.id) {
            let followers = state.followers.map((follower) =>
              follower.id !== res.id ? follower : res
            );
            return setState({ ...state, followers });
          } else {
            res = Object.keys(res)
              .map((key) => res[key])
              .join("\n");
            throw new Error(res);
          }
        })
        .catch((error) => {
          setState({ ...state, loading: false });
          if (error.message.startsWith("Unexpected")) {
            toast.warning(
              "An error occured while performing this action. Please try again later"
            );
          } else {
            toast.warning(error.message);
          }
        });
    }
  };

  const buildFollowers = (followers) =>
    followers.map((follower) => (
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        className={classes.followersGridStyle}
        align="center"
      >
        <Link
          className={classes.textDecorationNone}
          to={`/creators/${follower.username}`}
          key={follower.id}
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
                onClick={(e, id = follower.id) => toggle_follow(e, id)}
                primaryButtonStyle
              >
                {follower.followers.includes(props.auth.id)
                  ? "Unfollow"
                  : "Follow"}
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

  let { followers, prevPage, nextPage, loading } = state;
  let username = props.match.params.username;
  if (loading) {
    return <LoadingPage />;
  } else if (followers.length > 0) {
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
            {buildFollowers(followers)}
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
                onClick={(e, page = prevPage.split("?")[1]) => fetchPage(page)}
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
                onClick={(e, page = nextPage.split("?")[1]) => fetchPage(page)}
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
  api: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(UserFollowers);
