import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import ErrorPage from "../infos/ErrorPage";
import LoadingPage from "../infos/LoadingPage";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import clsx from "clsx";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Project from "./projects_components/Project";
import { Container } from "@material-ui/core";

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
  mainContainerStyle: {
    maxWidth: "2000px",
    width: "100%",
  },
  buttonGroupStyle: {
    paddingLeft: "2em",
    paddingRight: "2em",
    display: "block",
    marginTop: "2em",
    maxWidth: "2000px",
    width: "100%",
  },
  primaryButtonStyle: {
    backgroundColor: "#00B8C4",
    borderRadius: 15,
    color: "white",
    "&:hover": {
      backgroundColor: "#03848C",
    },
  },
  floatRight: {
    float: "right",
  },
  floatLeft: {
    float: "left",
  },
});

class Projects extends Component {
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
    this.props.api
      .get_projects(page)
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
    if (loading) {
      return <LoadingPage />;
    } else if (projects.length > 0) {
      return (
        <Box className={classes.root}>
          <Container class={classes.mainContainerStyle}>
            <Grid container spacing={3} justify="center">
              {projects.map((project) => (
                <Grid item xs={12} sm={6} md={4} lg={3} align="center">
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
                  Prev
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
                  Next
                </Button>
              ) : null}
            </ButtonGroup>
          </Container>
        </Box>
      );
    } else {
      return (
        <ErrorPage error="An error occured while fetching Projects, please try again later" />
      );
    }
  }
}

Projects.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Projects));
