import React,{Component} from 'react';
import { toast } from 'react-toastify';

class ProjectDetails extends Component {
    constructor(props){
        super(props);
        this.state = {
            project: {},
            loading: true
        }
    }

    componentDidMount(){

        this.props.api.get_project(this.props.match.params.id)
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

    render(){
        let {project, loading} = this.state;
        if(loading){
            return <div>Getting project details</div>
        }
        else if(Object.keys(project).length > 0){
            return (
                <div>
                <iframe width="700" height="500"
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
            )
        }
        else {
            <div>An error occured while loading project details, please try again later</div>
        }
    }
}

export default ProjectDetails;