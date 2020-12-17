import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { toast } from "react-toastify";

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

  // toggle_like=(id)=>{
  //    if(!this.props.auth.token) this.props.history.push("/login");
  //    this.props.api.toggle_like({id, token: this.props.auth.token})
  //    .then(res=>{
  //      if(res.id){
  //        let {projects} = this.state;
  //        projects = projects.map(project=>project.id === res.id ? {...project, likes_count: res.likes.length} : project);
  //        return this.setState({projects});
  //      }
  //      else {
  //       res = Object.keys(res).map(key=>res[key]).join("\n");
  //       throw new Error(res);
  //      }
  //    })
  //    .catch(error=>{this.setState({loading: false}); toast.warning(error.message)})
  // }

  followers = (followers) =>
    followers.map((follower) => (
      <div key={follower.id}>
        <Link to={`/profile/${follower.username}`}>
          <img src={follower.avatar} alt={follower.username} />
          <h1>{follower.username}</h1>
        </Link>
        {/* <span><button onClick={(e, id = project.id)=>this.toggle_like(id)}>Likes: {project.likes_count}</button></span>&nbsp;
                <span>Views: {project.views_count}</span>&nbsp;
                <span>Comments: {project.comments_count}</span>&nbsp;
                <Link to={`/profile/${project.creator.username}`}><span>Creator: {project.creator.username}</span></Link>&nbsp; */}
      </div>
    ));

  render() {
    let { followers, prevPage, nextPage, loading } = this.state;
    if (loading) {
      return <div>Fetching followers ...</div>;
    } else if (followers.length > 0) {
      return (
        <>
          <h1>{this.props.match.params.username}'s Followers</h1>
          {this.followers(followers)}
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
          An error occured while fetching followers, please try again later
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

export default connect(mapStateToProps)(UserFollowers);
