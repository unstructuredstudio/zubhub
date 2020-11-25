import React,{Component} from 'react';
import {withFormik} from 'formik';
import { Link, withRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import * as Yup from 'yup';
import {connect} from 'react-redux';


class CreateProject extends Component{
  constructor(props){
    super(props);
    this.state = {
      error:null
    }
  }

  create_project=(e)=>{
    this.props.api.create_project({token: this.props.auth.token, ...this.props.values})
    .then(res=>{
      if(!res.title){
        res = Object.keys(res).map(key=>res[key]).join("\n");
        throw new Error(res);
      }
      toast.success("Your project was created successfully!!")
      return this.props.history.push("/")
    })
    .catch(error=>this.setState({error:error.message}))
  };

  render(){

    let {error}=this.state;
    if(!this.props.auth.token){
        return <div> You are not logged in. Click on the signin button to get started</div>
    }
    else {
        return(
            <div>
              <ToastContainer/>
              <div className="empty-1" style={{backgroundColor:'#242424',
                WebKitBoxShadow:'0px 5px 5px 0px rgba(0,0,0,0.46)',MozBoxShadow:'0px 5px 5px 0px rgba(0,0,0,0.46)',
                boxShadow:'0px 5px 5px 0px rgba(0,0,0,0.46)'}}></div>
              <div id="content" className="site-content page-content">
              <div className="entry-header text-center">
                <h1 className="entry-title">Create Project</h1>
              </div>
              <div className="page-content">
                <div className="container">
                  <div id="post-2018" className="post-2018 page type-page status-publish hentry">
                    <div className="entry-content">
                      <div className="page-content-body">
                        <p></p>
                        <div className="um um-register um-2010 uimob500" style={{Opacity: '1'}}>
                          <div className="um-form">
                            <form name="create_project" noValidate="noValidate" onSubmit={this.props.handleSubmit}>
                              <p className="help-block text-danger">
                                {(error!==null) &&
                                <span className="text-danger">{error}</span> }
                                </p>
                              <div className="um-row _um_row_1 " style={{Margin: '0 0 30px 0'}}>
                                <div className="um-col-1">
      
                                <div className="um-field um-field-user_email um-field-text um-field-type_text">
                                    <div className="um-field-label">
                                      <label htmlFor="title">Title</label>
                                      <div className="um-clear"></div>
                                    </div>
                                    <div className="um-field-area">
                                      <input autoComplete="off" className="um-form-field valid "
                                         type="text" name="title" id="title"  placeholder="Project Title"
                                         onChange={this.props.handleChange} onBlur={this.props.handleBlur} />
                                    </div>
                                    <p className="help-block text-danger">
                                    {(this.props.touched['title'] && this.props.errors['title']) &&
                                    <span className="text-danger">{this.props.errors['title']}</span> }
                                    </p>
                                  </div>
      
                                  <div className="um-field um-field-user_email um-field-text um-field-type_text">
                                    <div className="um-field-label">
                                      <label htmlFor="description">Description</label>
                                      <div className="um-clear"></div>
                                    </div>
                                    <div className="um-field-area">
                                      <textarea autoComplete="off" className="um-form-field valid "name="description" 
                                      id="description"  placeholder="Project Description"
                                      onChange={this.props.handleChange} onBlur={this.props.handleBlur} />
                                    </div>
                                    <p className="help-block text-danger">
                                    {(this.props.touched['description'] && this.props.errors['description']) &&
                                    <span className="text-danger">{this.props.errors['description']}</span> }
                                    </p>
                                  </div>
                                  <div className="um-field um-field-first_name um-field-text um-field-type_text">
                                    <div className="um-field-label">
                                      <label htmlFor="video">Video URL</label>
                                      <div className="um-clear"></div>
                                    </div>
                                    <div className="um-field-area">
                                      <input autoComplete="off" className="um-form-field valid "
                                         type="text" name="video" id="video"  placeholder="Video URL"
                                         onChange={this.props.handleChange} onBlur={this.props.handleBlur} />
                                    </div>
                                    <p className="help-block text-danger">
                                    {(this.props.touched['video'] && this.props.errors['video']) &&
                                    <span className="text-danger">{this.props.errors['video']}</span> }
                                    </p>
                                  </div>
                                  <div className="um-field um-field-user_email um-field-text um-field-type_text">
                                    <div className="um-field-label">
                                      <label htmlFor="materials_used">Materials Used</label>
                                      <div className="um-clear"></div>
                                    </div>
                                    <div className="um-field-area">
                                      <textarea autoComplete="off" className="um-form-field valid "
                                        name="materials_used" id="materials_used"  placeholder="ie: wire, knife, soldering iron"
                                         onChange={this.props.handleChange} onBlur={this.props.handleBlur} />
                                    </div>
                                    <p className="help-block text-danger">
                                    {(this.props.touched['materials_used'] && this.props.errors['materials_used']) &&
                                    <span className="text-danger">{this.props.errors['materials_used']}</span> }
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <input type="submit" value="Create Project" className="text-uppercase um-button btn btn-success btn-lg" id="um-submit-btn" onClick={this.create_project}/>
                            
                            </form>
                          </div>
                        </div>
                        <br/>
                        <p></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          )
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
  )(withFormik({
  mapPropsToValue: ()=>({
    title:'',
    description:'',
    video:'',
    materials_used: ''
  }),
  validationSchema: Yup.object().shape({
    title: Yup.string().max(100, "your project title shouldn't be more than 100 characters").required("title is required"),
    video: Yup.string().url("you are required to submit a video url here").max(1000, "your video url shouldn't be more than 1000 characters").required("video url is required"),
    description: Yup.string().max(10000,"your description shouldn't be more than 10,000 characters"),
    materials_used: Yup.string().max(10000, "your materials used shouldn't be more than 10,000 characters").required("materials used is required")
  }),
  handleSubmit:(values,{setSubmitting}) =>{
    //console.log("you've submitted the form. this are the submitted values: ",JSON.stringify(values));
  }
})(CreateProject));
