import React, { Component } from "react";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { Link, withRouter } from "react-router-dom";
import EditProfile from "./profile_components/EditProfile";
import * as AuthActions from "../../../store/actions/authActions";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {},
      projects: [],
      readOnly: true,
      loading: true,
    };
  }

  componentDidMount() {
    let username = this.props.match.params.username;

    if (!username) {
      username = this.props.auth.username;
    } else if (this.props.auth.username === username)
      this.props.history.replace("/profile");

    this.props.api
      .get_user_profile({ username, token: this.props.auth.token })
      .then((res) => {
        if (!res.username) {
          throw new Error(
            "an error occured while getting user profile, please try again later"
          );
        }
        this.setState({ profile: res });
        return this.props.api.get_user_projects({
          username: res.username,
          limit: 3,
        });
      })
      .then((res) => {
        if (Array.isArray(res.results)) {
          return this.setState({ projects: res.results, loading: false });
        } else {
          res = Object.keys(res)
            .map((key) => res[key])
            .join("\n");
          throw new Error(res);
        }
      })
      .catch((error) => {
        toast.warning(error.message);
        this.setState({ loading: false });
      });
  }

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

  toggle_follow = (id) => {
    if (!this.props.auth.token) this.props.history.push("/login");
    this.props.api
      .toggle_follow({ id, token: this.props.auth.token })
      .then((res) => {
        if (res.id) {
          return this.setState({ profile: res });
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
            Likes: {project.likes_count}
          </button>
        </span>
        &nbsp;
        <span>Views: {project.views_count}</span>&nbsp;
        <span>Comments: {project.comments_count}</span>&nbsp;
        <span>Creator: {project.creator.username}</span>&nbsp;
      </div>
    ));

  setReadOnly = (value) => this.setState({ readOnly: value });

  setProfile = (value) => {
    this.setState({ profile: value });
    this.props.set_auth_user({ ...this.props.auth, username: value.username });
  };

  render() {
    let { profile, projects, loading, readOnly } = this.state;

    if (loading) {
      return <div>fetching user profile...........</div>;
    } else if (Object.keys(profile).length > 0) {
      return (
        <>
          {this.props.auth.username === profile.username ? (
            readOnly ? (
              <button onClick={(e, value = false) => this.setReadOnly(value)}>
                Edit
              </button>
            ) : (
              <EditProfile
                profile={profile}
                setProfile={(value) => this.setProfile(value)}
                setReadOnly={(value) => this.setReadOnly(value)}
                {...this.props}
              />
            )
          ) : (
            <>
              <button onClick={(e, id = profile.id) => this.toggle_follow(id)}>
                {profile.followers.includes(this.props.auth.id)
                  ? "Unfollow: "
                  : "Follow: "}{" "}
              </button>
            </>
          )}
          <Link to={`/profile/${profile.username}/followers`}>
            Followers: {profile.followers.length}
          </Link>

          {this.props.auth.username === profile.username ? (
            <button>
              <Link to="/projects/create">Create Project</Link>
            </button>
          ) : null}

          <img src={profile.avatar} alt="profile" />

          <div>Username: {profile.username}</div>

          <div>
            {this.props.auth.username === profile.username
              ? `Email: ${profile.email}`
              : null}
          </div>

          <div>
            {this.props.auth.username === profile.username
              ? `Date Of Birth: ${profile.dateOfBirth}`
              : null}
          </div>

          <div>
            {this.props.auth.username === profile.username
              ? `Location: ${profile.location}`
              : null}
          </div>

          <div>Bio: {profile.bio}</div>
          <Link to="/projects/saved">Saved Projects</Link>
          <h2>Latest projects of {profile.username}</h2>
          {this.projects(projects)}
          <Link to={`/profile/${profile.username}/projects`}>
            View all projects of {profile.username}
          </Link>
        </>
      );
    } else {
      return <div>Couldn't fetch profile, try again later</div>;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    set_auth_user: (auth_user) => {
      dispatch(AuthActions.setAuthUser(auth_user));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
