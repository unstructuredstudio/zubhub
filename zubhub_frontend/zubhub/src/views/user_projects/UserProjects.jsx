import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {
  Grid,
  Box,
  ButtonGroup,
  Typography,
  Container,
} from "@material-ui/core";

import CustomButton from "../../components/button/Button";
import ErrorPage from "../error/ErrorPage";
import LoadingPage from "../loading/LoadingPage";
import Project from "../../components/project/Project";
import styles from "../../assets/js/styles/views/user_projects/userProjectsStyles";

function UserProjects(props) {
  const classes = makeStyles(styles)();

  const [state, setState] = React.useState({
    projects: [],
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
      .get_user_projects({ page, username })
      .then((res) => {
        if (Array.isArray(res.results)) {
          return setState({
            ...state,
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
        setState({ ...state, loading: false });
        toast.warning(error.message);
      });
  };

  const updateProjects = (res) => {
    res
      .then((res) => {
        if (res.id) {
          let { projects } = state;
          projects = projects.map((project) =>
            project.id === res.id ? res : project
          );
          return setState({ ...state, projects });
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

  let { projects, prevPage, nextPage, loading } = state;
  let username = props.match.params.username;
  if (loading) {
    return <LoadingPage />;
  } else if (projects.length > 0) {
    return (
      <Box className={classes.root}>
        <Container className={classes.mainContainerStyle}>
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
                  updateProjects={updateProjects}
                  {...props}
                />
              </Grid>
            ))}
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
    return <ErrorPage error="user have not created any projects yet" />;
  }
}

UserProjects.propTypes = {
  api: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(UserProjects);
