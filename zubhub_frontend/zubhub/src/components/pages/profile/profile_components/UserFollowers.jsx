import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import ErrorPage from "../../infos/ErrorPage";
import LoadingPage from "../../infos/LoadingPage";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

const styles = (theme) => ({
  root: {
    paddingBottom: "2em",
    flex: "1 0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,204,0,1)",
    background:
      "-moz-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)",
    background:
      "-webkit-gradient(left top, left bottom, color-stop(0%, rgba(255,204,0,1)), color-stop(25%, rgba(255,229,133,1)), color-stop(61%, rgba(255,255,255,1)), color-stop(100%, rgba(255,255,255,1)))",
    background:
      "-webkit-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)",
    background:
      "-o-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)",
    background:
      "-ms-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)",
    background:
      "linear-gradient(to bottom, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)",
    filter:
      "progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffcc00', endColorstr='#ffffff', GradientType=0 )",
    "& .MuiGrid-root.MuiGrid-container": {
      width: "100%",
    },
  },
  mainContainerStyle: {
    maxWidth: "2000px",
    width: "100%",
  },
  pageHeaderStyle: {
    marginTop: "1em",
    fontWeight: 900,
    textAlign: "center",
  },
  buttonGroupStyle: {
    paddingLeft: "2em",
    paddingRight: "2em",
    display: "block",
    marginTop: "2em",
    maxWidth: "2000px",
    width: "100%",
  },
  followersGridStyle: {
    marginBottom: "2em",
  },
  cardStyle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: 345,
    paddingTop: 0,
    paddingBottom: "0 !important",
    marginTop: "1em",
    marginBottom: "0",
    borderRadius: "15px",
    textAlign: "left",
    backgroundColor: "#ffffff",
  },
  avatarStyle: {
    width: "100%",
    height: "100%",
    paddingTop: "1.5em",
    paddingBottom: "1.5em",
    "& img": {
      width: "6em",
      backgroundColor: "white",
      height: "6em",
      borderRadius: "50%",
      boxShadow: `0 3px 5px 2px rgba(0, 0, 0, .12)`,
    },
  },
  userNameStyle: {
    margin: "0.5em",
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
  primaryButton: {
    backgroundColor: "#00B8C4",
    borderRadius: 15,
    color: "white",
    marginLeft: "1em",
    "&:hover": {
      backgroundColor: "#03848C",
    },
  },
  secondaryButton: {
    backgroundColor: "white",
    borderRadius: 15,
    borderColor: "#00B8C4",
    color: "#00B8C4",
    marginLeft: "1em",
    "&:hover": {
      color: "#03848C",
      borderColor: "#03848C",
      backgroundColor: "#F2F2F2",
    },
  },
  secondaryLink: {
    color: "#00B8C4",
    "&:hover": {
      color: "#03848C",
    },
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  textDecorationNone: {
    textDecoration: "none",
  },
  floatRight: {
    float: "right",
  },
  floatLeft: {
    float: "left",
  },
  displayNone: { display: "none" },
  largeLabel: {
    fontSize: "1.3rem",
  },
});

class UserFollowers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      followers: [],
      prevPage: null,
      nextPage: null,
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchPage();
  }

  fetchPage = (page) => {
    let username = this.props.match.params.username;
    this.props.api
      .get_followers({ page, username })
      .then((res) => {
        if (Array.isArray(res.results)) {
          return this.setState({
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
        this.setState({ loading: false });
        toast.warning(error.message);
      });
  };

  toggle_follow = (e, id) => {
    e.preventDefault();
    if (!this.props.auth.token) {
      this.props.history.push("/login");
    } else {
      this.props.api
        .toggle_follow({ id, token: this.props.auth.token })
        .then((res) => {
          if (res.id) {
            let followers = this.state.followers.map((follower) =>
              follower.id !== res.id ? follower : res
            );
            return this.setState({ followers });
          } else {
            res = Object.keys(res)
              .map((key) => res[key])
              .join("\n");
            throw new Error(res);
          }
        })
        .catch((error) => {
          this.setState({ loading: false });
          if (error.message.startsWith("Unexpected")) {
            toast.warning(
              this.props.t("userFollowers.others.errors.unexpected")
            );
          } else {
            toast.warning(error.message);
          }
        });
    }
  };

  followers = (followers) =>
    followers.map((follower) => (
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        className={this.props.classes.followersGridStyle}
        align="center"
      >
        <Link
          className={this.props.classes.textDecorationNone}
          to={`/creators/${follower.username}`}
          key={follower.id}
        >
          <Card className={this.props.classes.cardStyle}>
            <Avatar
              className={this.props.classes.avatarStyle}
              src={follower.avatar}
              alt={follower.username}
            />
            {follower.id !== this.props.auth.id ? (
              <Button
                className={this.props.classes.primaryButton}
                variant="contained"
                onClick={(e, id = follower.id) => this.toggle_follow(e, id)}
              >
                {follower.followers.includes(this.props.auth.id)
                  ? this.props.t("userFollowers.follower.unfollow")
                  : this.props.t("userFollowers.follower.follow")}
              </Button>
            ) : null}
            <Typography
              component="h3"
              color="textPrimary"
              className={this.props.classes.userNameStyle}
            >
              {follower.username}
            </Typography>
          </Card>
        </Link>
      </Grid>
    ));

  render() {
    let { followers, prevPage, nextPage, loading } = this.state;
    let { classes, t } = this.props;
    let username = this.props.match.params.username;
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
                  {username}'s {t("userFollowers.title")}
                </Typography>
              </Grid>
              {this.followers(followers)}
            </Grid>
            <ButtonGroup
              aria-label={t("userFollowers.aria_labels.prev_nxt_buttons")}
              className={classes.buttonGroupStyle}
            >
              {prevPage ? (
                <Button
                  className={clsx(
                    classes.primaryButtonStyle,
                    classes.floatLeft
                  )}
                  size="large"
                  startIcon={<NavigateBeforeIcon />}
                  onClick={(e, page = prevPage.split("?")[1]) =>
                    this.fetchPage(page)
                  }
                >
                  {t("userFollowers.prev")}
                </Button>
              ) : null}
              {nextPage ? (
                <Button
                  className={clsx(
                    classes.primaryButtonStyle,
                    classes.floatRight
                  )}
                  size="large"
                  endIcon={<NavigateNextIcon />}
                  onClick={(e, page = nextPage.split("?")[1]) =>
                    this.fetchPage(page)
                  }
                >
                  {t("userFollowers.next")}
                </Button>
              ) : null}
            </ButtonGroup>
          </Container>
        </Box>
      );
    } else {
      return <ErrorPage error={t("userFollower.others.errors.no_followers")} />;
    }
  }
}

UserFollowers.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(UserFollowers));
