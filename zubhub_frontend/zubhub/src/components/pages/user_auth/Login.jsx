import React,{Component} from 'react';
import { Redirect, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import {withFormik} from 'formik';
import * as Yup from 'yup';
import {connect} from 'react-redux';
import * as AuthActions from '../../../store/actions/authActions';


class Login extends Component{

  constructor(props){
    super(props);
    this.state = {
      error:null
    }
  }

  login=(e)=>{
    this.props.api.login(this.props.values)
    .then(res=>{
      if(!res.key){
        res = Object.keys(res).map(key=>res[key]).join("\n");
        throw new Error(res);
      }
      return this.props.set_auth_user({token:res.key})
    })
    .then(val=>this.props.api.get_auth_user(this.props.auth.token))
    .then(res=>this.props.set_auth_user({...this.props.auth, username: res.username}))
    .then(val=>this.props.history.push("/profile"))
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
          <h1 className="entry-title">Login</h1>
        </div>
        <div className="page-content">
          <div className="container">
            <div id="post-2018" className="post-2018 page type-page status-publish hentry">
              <div className="entry-content">
                <div className="page-content-body">
                  <p></p>
                  <div className="um um-register um-2010 uimob500" style={{Opacity: '1'}}>
                    <div className="um-form">
                      <form name="login" noValidate="noValidate" onSubmit={this.props.handleSubmit}>
                        <p className="help-block text-danger">
                          {error!==null &&
                          <span className="text-danger">{error}</span> }
                          </p>
                        <div className="um-row _um_row_1 " style={{Margin: '0 0 30px 0'}}>
                          <div className="um-col-1">
                            <div className="um-field um-field-user_login um-field-text um-field-type_text">
                              <div className="um-field-label">
                                <label htmlFor="username">Username Or Email</label>
                                <div className="um-clear"></div>
                              </div>
                              <div className="um-field-area">
                                <input autoComplete="off" className="um-form-field valid " type="text" 
                                name="username" id="username"  placeholder="Username Or Email" 
                                onChange={this.props.handleChange} onBlur={this.props.handleBlur}/>
                              </div>
                              <p className="help-block text-danger">
                              {(this.props.touched['username'] && this.props.errors['username']) &&
                              <span className="text-danger">{this.props.errors['username']}</span> }
                              </p>
                            </div>

                            <div className="um-field um-field-user_password um-field-password um-field-type_password">
                              <div className="um-field-label">
                                <label htmlFor="password">Password</label>
                                <div className="um-clear"></div>
                              </div>
                              <div className="um-field-area">
                                <input className="um-form-field valid " type="password" name="password" id="password" 
                                placeholder="password"  onChange={this.props.handleChange} onBlur={this.props.handleBlur}/>
                              </div>
                              <p className="help-block text-danger">
                                {(this.props.touched['password'] && this.props.errors['password']) &&
                                <span className="text-danger">{this.props.errors['password']}</span> }
                                </p>
                            </div>
                          </div>
                        </div>
                        <div className="um-col-alt">
                          <div className="um-left um-half">
                            <input type="submit" value="Login" className="text-uppercase um-button btn btn-success btn-lg" onClick={this.login}/>
                          </div>
                          <div className="um-right um-half"> <Link to="/signup" className="text-uppercase um-button btn btn-default btn-lg um-alt"> Register </Link>
                          </div>
                          <div className="um-clear"></div>
                        </div>
                      </form>
                      <div className="um-col-alt">
                        <div className="um-right um-half">
                          <Link to="/password-reset"><button className="text-uppercase um-button btn btn-warning btn-lg um-alt">Forgot Password?</button></Link>
                        </div>
                        <div className="um-clear"></div>
                      </div>
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


const mapStateToProps = state =>{
  return {
    auth:state.auth,
  }
}

const mapDispatchToProps = dispatch =>{
  return {
    set_auth_user:(auth_user)=>{
      dispatch(AuthActions.setAuthUser(auth_user))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
  )(withFormik({
  mapPropsToValue: ()=>({
    email:'',
    password:'',
  }),
  validationSchema: Yup.object().shape({
    email:Yup.string().email("invalid email").required("invalid email"),
    password:Yup.string().min(8,"your password is too short").required("input your password"),
  }),
  handleSubmit:(values,{setSubmitting}) =>{
    //console.log("you've submitted the form. this are the submitted values: ",JSON.stringify(values));
  }
})(Login));
