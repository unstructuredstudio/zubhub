import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { toast } from "react-toastify";

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

  toggle_like = (id) => {
    if (!this.props.auth.token) this.props.history.push("/login");
    this.props.api
      .toggle_like({ id, token: this.props.auth.token })
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

  toggle_save = (id) => {
    if (!this.props.auth.token) this.props.history.push("/login");
    this.props.api
      .toggle_save({ id, token: this.props.auth.token })
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

  projects = (projects) =>
    projects.map((project) => (
      <div key={project.id}>
        <Link to={`projects/${project.id}`}>
          <iframe
            title="video"
            width="200"
            height="150"
            src={project.video}
          ></iframe>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
        </Link>
        <span>
          <button onClick={(e, id = project.id) => this.toggle_like(id)}>
            {project.likes.includes(this.props.auth.id) ? "Unlike:" : "Like:"}{" "}
            {project.likes.length}
          </button>
        </span>
        <span>
          <button onClick={(e, id = project.id) => this.toggle_save(id)}>
            {project.saved_by.includes(this.props.auth.id)
              ? "Unsave:"
              : "Save:"}{" "}
            {project.saved_by.length}
          </button>
        </span>
        &nbsp;
        <span>Views: {project.views_count}</span>&nbsp;
        <span>Comments: {project.comments_count}</span>&nbsp;
        <Link to={`/profile/${project.creator.username}`}>
          <span>Creator: {project.creator.username}</span>
        </Link>
        &nbsp;
      </div>
    ));

  render() {
    let { projects, prevPage, nextPage, loading } = this.state;
    if (loading) {
      return <div>Fetching projects ...</div>;
    } else if (projects.length > 0) {
      return (
        <>
          {this.projects(projects)}
          <hr />
          <div>
            {prevPage ? (
              <button
                onClick={(e, page = prevPage.split("?")[1]) =>
                  this.fetchPage(page)
                }
              >
                Prev
              </button>
            ) : null}
            {nextPage ? (
              <button
                onClick={(e, page = nextPage.split("?")[1]) =>
                  this.fetchPage(page)
                }
              >
                Next
              </button>
            ) : null}
          </div>
        </>
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

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(Projects);
