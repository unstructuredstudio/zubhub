import React,{Component} from 'react';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import {withFormik} from 'formik';
import * as Yup from 'yup';


class PasswordResetConfirm extends Component{

  constructor(props){
    super(props);
    this.state = {
      error:null
    }
  }

  getUidAndToken=(queryString)=>{
    let uid = queryString.split("&&");
    let token = uid[1].split("=")[1];
    uid = uid[0].split("=")[1];
    return {uid, token};
  }

  resetPassword=(e)=>{
    e.preventDefault();
    let {uid, token} = this.getUidAndToken(this.props.location.search);
    this.props.api.password_reset_confirm({...this.props.values, uid, token})
    .then(res=>{
          console.log(res);
          toast.success("Congratulations! your password reset was successful! you will now be redirected to login");
          setTimeout(()=>{this.props.history.push("/login")},4000)
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
          <h1 className="entry-title">Password Reset Confirmation</h1>
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
                                <label htmlFor="new_password1">New Password</label>
                                <div className="um-clear"></div>
                              </div>
                              <div className="um-field-area">
                                <input autoComplete="off" className="um-form-field valid " type="password" name="new_password1" id="new_password1"  placeholder="New Password" onChange={this.props.handleChange}
                                            onBlur={this.props.handleBlur}/>
                              </div>
                              <p className="help-block text-danger">
                              {(this.props.touched['new_password1'] && this.props.errors['new_password1']) &&
                              <span className="text-danger">{this.props.errors['new_password1']}</span> }
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="um-row _um_row_1 " style={{Margin: '0 0 30px 0'}}>
                          <div className="um-col-1">
                            <div className="um-field um-field-user_login um-field-text um-field-type_text">
                              <div className="um-field-label">
                                <label htmlFor="new_password2">New Password Confirmation</label>
                                <div className="um-clear"></div>
                              </div>
                              <div className="um-field-area">
                                <input autoComplete="off" className="um-form-field valid " type="password" name="new_password2" id="new_password2"  placeholder="New Password Confirmation" onChange={this.props.handleChange}
                                            onBlur={this.props.handleBlur}/>
                              </div>
                              <p className="help-block text-danger">
                              {(this.props.touched['new_password2'] && this.props.errors['new_password2']) &&
                              <span className="text-danger">{this.props.errors['new_password2']}</span> }
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="um-col-alt">
                          <div className="um-left um-half">
                            <input type="submit" value="Reset Password" className="text-uppercase um-button btn btn-success btn-lg" onClick={this.resetPassword}/>
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
    new_password1:'',
    new_password2:''
  }),
  validationSchema: Yup.object().shape({
    new_password1:Yup.string().min(8,"your password is too short").required("input your password"),
    new_password2: Yup.string().oneOf([Yup.ref('new_password1'), null], 'Passwords must match').required("input a confirmation password")
  }),
  handleSubmit:(values,{setSubmitting}) =>{
  }
})(PasswordResetConfirm);
