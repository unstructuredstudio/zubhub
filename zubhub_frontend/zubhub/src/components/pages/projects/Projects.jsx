import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import { toast } from 'react-toastify';

class Projects extends Component {
    constructor(props){
        super(props);
        this.state = {
            projects: [],
            loading: true
        }
    }

    componentDidMount(){

      this.props.api.get_projects()
      .then(res=>{
          if(Array.isArray(res)){
              return this.setState({projects: res, loading: false})
          }
          else {
            res = Object.keys(res).map(key=>res[key]).join("\n");
            throw new Error(res);
          }
      })
      .catch(error=>{this.setState({loading: false}); toast.warning(error.message)})
    }

    projects=(projects)=>projects.map(project=>
            <Link to={`projects/${project.id}`}><div key={project.id}>
              <iframe width="200" height="150"
              src={project.video}>
              </iframe>
                <h1>{project.title}</h1>
                <p>{project.description}</p>
                <ul>
                    {
                     project.materials_used.split(",").map(material=><li>{material}</li>)
                    }
                </ul>
             </div>
             </Link>)

    render(){
        let {projects, loading} = this.state;
        if(loading){
            return (<div>Fetching projects ...</div>)
        }
        else if(projects.length > 0){
            return (
                <>
               {this.projects(projects)}
               </>
            )
        }
        else {
            return (<div>An error occured while fetching videos, please try again later</div>)
        }
    }
}

export default Projects;