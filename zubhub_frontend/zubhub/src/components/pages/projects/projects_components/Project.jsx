import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

class Project extends Component {
  toggle_like = (id) => {
    if (!this.props.auth.token) this.props.history.push("/login");
    this.props.api
      .toggle_like({ id, token: this.props.auth.token })
      .then((res) => this.props.updateProjects(res));
  };

  save_for_future = (id) => {
    if (!this.props.auth.token) this.props.history.push("/login");
    this.props.api
      .save_for_future({ id, token: this.props.auth.token })
      .then((res) => this.props.updateProjects(res));
  };

  render() {
    let { project } = this.props;
    return (
      <div>
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
            {this.props.auth.id in project.likes ? "Unlike" : "Like"}{" "}
            {project.likes.length}
          </button>
        </span>
        <span>
          <button onClick={(e, id = project.id) => this.save_for_future(id)}>
            {this.props.auth.id in project.saved_by ? "Unsave:" : "Save:"}{" "}
            {project.saved_by.length}
          </button>
        </span>
        &nbsp;
        <span>Views: {project.views_count}</span>&nbsp;
        <span>Comments: {project.comments_count}</span>&nbsp;
        <span>Creator: {project.creator.username}</span>&nbsp;
      </div>
    );
  }
}

export default Project;
