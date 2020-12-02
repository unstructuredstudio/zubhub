import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import {connect} from 'react-redux';

class ProjectDetails extends Component {
    constructor(props){
        super(props);
        this.state = {
            project: {},
            loading: true
        }
    }

    componentDidMount(){

        this.props.api.get_project({id: this.props.match.params.id, token: this.props.auth.token})
        .then(res=>{
            if(res.title){
                return this.setState({project: res, loading: false})
            }
            else {
              res = Object.keys(res).map(key=>res[key]).join("\n");
              throw new Error(res);
            }
        })
        .catch(error=>{this.setState({loading: false}); toast.warning(error.message)})
      }

      toggle_like=(id)=>{
        if(!this.props.auth.token) this.props.history.push("/login");
        this.props.api.toggle_like({id, token: this.props.auth.token})
        .then(res=>{
          if(res.id){
            
            return this.setState({project: res});
          }
          else {
           res = Object.keys(res).map(key=>res[key]).join("\n");
           throw new Error(res);
          }
        })
        .catch(error=>{this.setState({loading: false}); toast.warning(error.message)})
     }

     add_comment=(e)=>{
       e.preventDefault();
       if(!this.props.auth.token) this.props.history.push("/login");
       let textarea = document.querySelector("#comment");
       let comment_text = textarea.value;
       this.props.api.add_comment({id: this.state.project.id, token: this.props.auth.token, text: comment_text})
       .then(res=>{
           if(res.id){
               textarea.value = "";
               return this.setState({project: res});
           }
           else {
               res = Object.keys(res).map(key=>res[key]).join("\n");
               throw new Error(res);
           }
       })
       .catch(error=>{this.setState({loading: false}); toast.warning(error.message)})
     }

    render(){
        let {project, loading} = this.state;
        if(loading){
            return <div>Getting project details</div>
        }
        else if(Object.keys(project).length > 0){
            return (
                <div>
                <iframe title="video" width="700" height="500"
                src={project.video}>
                </iframe>
                <h1>{project.title}</h1>
                <span>Views: {project.views_count}</span>&nbsp;
                <span><button onClick={(e, id = project.id)=>this.toggle_like(id)}>Likes: {project.likes.length}</button></span>&nbsp;
                <Link to={`/profile/${project.creator.username}`}><span>Creator: {project.creator.username}</span></Link>&nbsp;
                  <p>{project.description}</p>
                  <ul>
                      {
                       project.materials_used.split(",").map(material=><li>{material}</li>)
                      }
                  </ul>
                  <h2>Comments</h2>
                  <form>
                      <textarea name="comment" id="comment" cols="30" rows="10"></textarea>
                      <input type="submit" onClick={this.add_comment} value="Comment"/>
                  </form>
                  <ul>
                      {
                          project.comments.map(comment=><li key={comment.id}>{comment.text}</li>)
                      }
                  </ul>
               </div>
            )
        }
        else {
            return <div>An error occured while loading project details, please try again later</div>
        }
    }
}


const mapStateToProps = state =>{
    return {
      auth:state.auth,
    }
  }


export default connect(
    mapStateToProps
  )(ProjectDetails);
  