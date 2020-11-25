import React,{Component} from 'react';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import {withFormik} from 'formik';
import * as Yup from 'yup';


class PasswordReset extends Component{

  constructor(props){
    super(props);
    this.state = {
      error:null
    }
  }



  sendPasswordResetLink=(e)=>{
    e.preventDefault();
    this.props.api.send_password_reset_link(this.props.values.email)
    .then(res=>{
          toast.success("We just sent a password reset link to your email!");
          setTimeout(()=>{this.props.history.push("/")},4000)
    })
    .catch(error=>this.setState({error:error.message}))
  }

  render(){
    let {error}=this.state;

    return(

      <div>
        <ToastContainer/>
        <div className="empty-1" style={{backgroundColor:'#242424',
          WebKitBoxShadow:'0px 5px 5px 0px rgba(0,0,0,0.46)',MozBoxShadow:'0px 5px 5px 0px rgba(0,0,0,0.46)',
          boxShadow:'0px 5px 5px 0px rgba(0,0,0,0.46)'}}></div>
        <div id="content" className="site-content page-content">
        <div className="entry-header text-center">
          <h1 className="entry-title">Password Reset</h1>
        </div>
        <div className="page-content">
          <div className="container">
            <div id="post-2018" className="post-2018 page type-page status-publish hentry">
              <div className="entry-content">
                <div className="page-content-body">
                  <p></p>
                  <div className="um um-register um-2010 uimob500" style={{Opacity: '1'}}>
                    <div className="um-form">
                      <form name="password_reset" noValidate="noValidate" onSubmit={this.props.handleSubmit}>
                        <p className="help-block text-danger">
                          {error!==null &&
                          <span className="text-danger">{error}</span> }
                          </p>
                        <div className="um-row _um_row_1 " style={{Margin: '0 0 30px 0'}}>
                          <div className="um-col-1">
                            <div className="um-field um-field-user_login um-field-text um-field-type_text">
                              <div className="um-field-label">
                                <label htmlFor="email">Email</label>
                                <div className="um-clear"></div>
                              </div>
                              <div className="um-field-area">
                                <input autoComplete="off" className="um-form-field valid " type="text" name="email" id="email"  placeholder="email" onChange={this.props.handleChange}
                                            onBlur={this.props.handleBlur}/>
                              </div>
                              <p className="help-block text-danger">
                              {(this.props.touched['email'] && this.props.errors['email']) &&
                              <span className="text-danger">{this.props.errors['email']}</span> }
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="um-col-alt">
                          <div className="um-left um-half">
                            <input type="submit" value="Send Reset Link" className="text-uppercase um-button btn btn-success btn-lg" onClick={this.sendPasswordResetLink}/>
                          </div>
                        </div>
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


  export default withFormik({
  mapPropsToValue: ()=>({
    email:''
  }),
  validationSchema: Yup.object().shape({
    email:Yup.string().email("invalid email").required("email required"),
  }),
  handleSubmit:(values,{setSubmitting}) =>{
  }
})(PasswordReset);
