import React,{Component} from 'react';
import {withFormik} from 'formik';
import { ToastContainer, toast } from 'react-toastify';

import * as Yup from 'yup';
import {connect} from 'react-redux';


class CreateProject extends Component{
  constructor(props){
    super(props);
    this.state = {
      error:null,
      image_upload: {
        upload_dialog: false,
        images_to_upload: 0,
        successful_uploads: 0,
        upload_info:{},
        upload_percent: 0,
        uploaded_images_url:[]
      }

    }
  }


  upload=(image)=>{
    let url = `https://api.cloudinary.com/v1_1/raymondndibe/upload`;
    let xhr = new XMLHttpRequest();
    let fd = new FormData();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  
    // Update progress (can be used to show progress indicator)
    xhr.upload.addEventListener("progress", e=> {
      let progress = Math.round((e.loaded * 100.0) / e.total);
      let {image_upload} = this.state;
      image_upload.upload_info[image.name] = progress;

      let total = 0;
        Object.keys(image_upload.upload_info).forEach(each=>{
          total = total + image_upload.upload_info[each];
        })

      total =  total/ Object.keys(image_upload.upload_info).length;
      image_upload.upload_percent = total;

      this.setState({image_upload})
      document.querySelector('#progress_bar').style.width = progress + "%";
    });
  
    xhr.onreadystatechange = e => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // File uploaded successfully
        let response = JSON.parse(xhr.responseText);
        let {secure_url, public_id} = response
        let {image_upload} = this.state;

        image_upload.uploaded_images_url.push({image_url: secure_url, public_id});
        image_upload.successful_uploads = image_upload.successful_uploads + 1;

        this.setState({image_upload},()=>{
          if(this.state.image_upload.images_to_upload === this.state.image_upload.successful_uploads){
            let {image_upload} = this.state;
            image_upload.upload_dialog = false;
            this.setState({image_upload});
            this.props.api.create_project({...this.props.values, token: this.props.auth.token, 
                                          images: this.state.image_upload.uploaded_images_url})
            .then(res=>{
              if(!res.title){
                res = Object.keys(res).map(key=>res[key]).join("\n");
                throw new Error(res);
              }
              toast.success("Your project was created successfully!!")
              return this.props.history.push("/")
            })
            .catch(error=>this.setState({error:error.message}))
          }
        });
      }
    };
  
    fd.append('upload_preset', 'zubhub_projects_images');
    fd.append('file', image);
    xhr.send(fd);
  }

  create_project=(e)=>{
    let image_field = this.imageFieldValidation();

    if(image_field.is_empty === true){
      this.props.setErrors({project_images:"please upload an image"});
    }
    else if(image_field.too_many_images === true){
      this.props.setErrors({project_images:"too many images uploaded"});
    }
    else if(image_field.image_size_too_large === true){
      this.props.setErrors({project_images:"one or more of your image is greater than 3mb"});
    }
    else {
      let project_images = document.querySelector("#project_images").files;
       document.querySelector("#progress_bar").styles.width = 0;

      let {image_upload} = this.state;
      image_upload.images_to_upload = project_images.length;
      image_upload.upload_dialog = true;
      this.setState({image_upload});

      for(let index = 0; index < project_images.length; index++){
        this.upload(project_images[index]);
      }
    }
  };

  imageFieldValidation=()=>{
    let image_field = document.querySelector("#project_images");

         if(image_field.files.length < 1){
           this.props.setErrors({project_images:"please upload an image"});
           return {is_empty:true}
         }

         else if(image_field.files.length > 5){
           this.props.setErrors({project_images:"too many images uploaded"});
          return {is_empty:false,too_many_images:true};
         }
      else{
        let image_size_too_large = false;

        for(let index  = 0; index < image_field.files.length; index++){
          if((image_field.files[index].size)/1000 > 3072){
            image_size_too_large = true;
          }
        }
        if(image_size_too_large){
        this.props.setErrors({project_images:"one or more of your image is greater than 3mb"});
        return {is_empty:false,too_many_images:false,image_size_too_large:image_size_too_large}
      }
      }
      return {is_empty:false,too_many_images:false,image_size_too_large:false}
     }


  render(){

    let {error, image_upload}=this.state;

    if(!this.props.auth.token){
        return <div> You are not logged in. Click on the signin button to get started</div>
    }
    else {
        return(
            <div>
              <ToastContainer/>
              {image_upload.upload_dialog ? 
              <div style={{width:"100vw", height:"100vh", backgroundColor: "rgba(0,0,0,0.3)",zIndex:"100",position:"absolute", top: "-5em", display:"flex",alignItems:"center"}}>
                <div id="progress_bar" style={{height: "1em", backgroundColor: "rgb(255,255,255)",borderRadius:"50px"}}></div></div>
              :
              null
            }

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
                                      <label htmlFor="project_images">Project Images</label>
                                      <div className="um-clear"></div>
                                    </div>
                                    <div className="um-field-area">
                                    <input type="file" accept="image/*" id="project_images" name="project_images" multiple
                                       onChange={this.imageFieldValidation} onBlur={this.props.handleBlur} />
                                    </div>
                                    <p className="help-block text-danger">
                                    {(this.props.touched['project_images'] && this.props.errors['project_images']) &&
                                    <span className="text-danger">{this.props.errors['project_images']}</span> }
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
  }
})(CreateProject));
