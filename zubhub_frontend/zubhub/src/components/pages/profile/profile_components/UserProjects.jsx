import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import clsx from "clsx";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import Project from "../../projects/projects_components/Project";

const styles = (theme) => ({
  root: {
    paddingBottom: "2em",
    flex: "1 0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(to bottom, rgba(191,254,255,1) 0%, rgba(191,254,255,1) 20%, rgba(255,255,255,1) 77%, rgba(255,255,255,1) 100%)",
    "& .MuiGrid-root.MuiGrid-container": {
      width: "100%",
    },
  },
  pageHeaderStyle: {
    marginTop: "1em",
    fontWeight: "bold",
    textAlign: "center",
  },
  projectGridStyle: {
    marginBottom: "2em",
  },
  buttonGroupStyle: {
    marginTop: "2em",
  },
  primaryButtonStyle: {
    backgroundColor: "#00B8C4",
    borderRadius: 15,
    color: "white",
    "&:hover": {
      backgroundColor: "#03848C",
    },
  },
});

class UserProjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
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
      .get_user_projects({ page, username })
      .then((res) => {
        if (Array.isArray(res.results)) {
          return this.setState({
            projects: res.results,
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

  updateProjects = (res) => {
    res
      .then((res) => {
        if (res.id) {
          let { projects } = this.state;
          projects = projects.map((project) =>
            project.id === res.id ? res : project
          );
          return this.setState({ projects });
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

  render() {
    let { projects, prevPage, nextPage, loading } = this.state;
    let { classes } = this.props;
    let username = this.props.match.params.username;
    if (loading) {
      return <div>Fetching projects ...</div>;
    } else if (projects.length > 0) {
      return (
        <Box className={classes.root}>
          <Grid container>
            <Grid item xs={12}>
              <Typography
                className={classes.pageHeaderStyle}
                variant="h3"
                gutterBottom
              >
                {username}'s projects
              </Typography>
            </Grid>
            {projects.map((project) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                className={classes.projectGridStyle}
                align="center"
              >
                <Project
                  project={project}
                  key={project.id}
                  updateProjects={this.updateProjects}
                  {...this.props}
                />
              </Grid>
            ))}
          </Grid>
          <ButtonGroup
            aria-label="previous and next page buttons"
            className={classes.buttonGroupStyle}
          >
            {prevPage ? (
              <Button
                className={classes.primaryButtonStyle}
                size="large"
                startIcon={<NavigateBeforeIcon />}
                onClick={(e, page = prevPage.split("?")[1]) =>
                  this.fetchPage(page)
                }
              >
                Prev
              </Button>
            ) : null}
            {nextPage ? (
              <Button
                className={classes.primaryButtonStyle}
                size="large"
                endIcon={<NavigateNextIcon />}
                onClick={(e, page = nextPage.split("?")[1]) =>
                  this.fetchPage(page)
                }
              >
                Next
              </Button>
            ) : null}
          </ButtonGroup>
        </Box>
      );
    } else {
      return (
        <div>
          An error occured while fetching videos, please try again later
        </div>
      );
    }
  }
}

UserProjects.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(UserProjects));
