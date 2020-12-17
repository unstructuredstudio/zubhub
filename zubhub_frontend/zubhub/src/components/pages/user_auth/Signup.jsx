import React,{Component} from 'react';
import {withFormik} from 'formik';
import { Link, withRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import * as Yup from 'yup';
import {connect} from 'react-redux';
import * as AuthActions from '../../../store/actions/authActions';


class Signup extends Component{
  constructor(props){
    super(props);
    this.state = {
      locations: [],
      error:null
    }
  }

  componentDidMount(){
    this.props.api.get_locations()
    .then(res=>{
      if(Array.isArray(res) && res.length > 0 && res[0].name){
        console.log(res);
        return this.setState({locations: res})
      }
      else {
        res = Object.keys(res).map(key=>res[key]).join("\n");
        throw new Error(res)
      }
    })
    .catch(error=>this.setState({error:error.message}))
  }

  signup=(e)=>{
    console.log(this.props.values);
    if(this.props.values.location.length < 1){
      console.log("i was called",this.props.values.location.length);
      this.props.validateField("location")
    }
    else {
    this.props.api.signup(this.props.values)
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
    }};

  render(){

    let {error, locations}=this.state;
    return(
      <div>
        <ToastContainer/>
        <div className="empty-1" style={{backgroundColor:'#242424',
          WebKitBoxShadow:'0px 5px 5px 0px rgba(0,0,0,0.46)',MozBoxShadow:'0px 5px 5px 0px rgba(0,0,0,0.46)',
          boxShadow:'0px 5px 5px 0px rgba(0,0,0,0.46)'}}></div>
        <div id="content" className="site-content page-content">
        <div className="entry-header text-center">
          <h1 className="entry-title">Register</h1>
        </div>
        <div className="page-content">
          <div className="container">
            <div id="post-2018" className="post-2018 page type-page status-publish hentry">
              <div className="entry-content">
                <div className="page-content-body">
                  <p></p>
                  <div className="um um-register um-2010 uimob500" style={{Opacity: '1'}}>
                    <div className="um-form">
                      <form name="signup" noValidate="noValidate" onSubmit={this.props.handleSubmit}>
                        <p className="help-block text-danger">
                          {(error!==null) &&
                          <span className="text-danger">{error}</span> }
                          </p>
                        <div className="um-row _um_row_1 " style={{Margin: '0 0 30px 0'}}>
                          <div className="um-col-1">

                          <div className="um-field um-field-user_email um-field-text um-field-type_text">
                              <div className="um-field-label">
                                <label htmlFor="username">User Name</label>
                                <div className="um-clear"></div>
                              </div>
                              <div className="um-field-area">
                                <input autoComplete="off" className="um-form-field valid "
                                   type="text" name="username" id="username"  placeholder="username"
                                   onChange={this.props.handleChange} onBlur={this.props.handleBlur} />
                              </div>
                              <p className="help-block text-danger">
                              {(this.props.touched['username'] && this.props.errors['username']) &&
                              <span className="text-danger">{this.props.errors['username']}</span> }
                              </p>
                            </div>

                            <div className="um-field um-field-user_email um-field-text um-field-type_text">
                              <div className="um-field-label">
                                <label htmlFor="email">E-mail Address</label>
                                <div className="um-clear"></div>
                              </div>
                              <div className="um-field-area">
                                <input autoComplete="off" className="um-form-field valid "
                                   type="text" name="email" id="email"  placeholder="email"
                                   onChange={this.props.handleChange} onBlur={this.props.handleBlur} />
                              </div>
                              <p className="help-block text-danger">
                              {(this.props.touched['email'] && this.props.errors['email']) &&
                              <span className="text-danger">{this.props.errors['email']}</span> }
                              </p>
                            </div>

                            <div className="um-field um-field-user_email um-field-text um-field-type_text">
                              <div className="um-field-label">
                                <label htmlFor="dateOfBirth">Date Of Birth</label>
                                <div className="um-clear"></div>
                              </div>
                              <div className="um-field-area">
                                <input autoComplete="off" className="um-form-field valid "
                                   type="date" name="dateOfBirth" id="dateOfBirth"  placeholder="Date Of Birth"
                                   onChange={this.props.handleChange} onBlur={this.props.handleBlur} />
                              </div>
                              <p className="help-block text-danger">
                              {(this.props.touched['dateOfBirth'] && this.props.errors['dateOfBirth']) &&
                              <span className="text-danger">{this.props.errors['dateOfBirth']}</span> }
                              </p>
                            </div>

                            <div className="um-field um-field-user_email um-field-text um-field-type_text">
                              <div className="um-field-label">
                                <label htmlFor="user_location">Location</label>
                                <div className="um-clear"></div>
                              </div>
                              <div className="um-field-area">
                                <select className="um-form-field valid " id="user_location" name="user_location"
                                onChange={this.props.handleChange} onBlur={this.props.handleBlur} defaultValue="">
                                <option value="">------</option>
                                {locations.map(location=>
                                                     <option key={location.name} value={location.name}>
                                                       {location.name}
                                                     </option>
                                                     )}
                                </select>
                              </div>
                              <p className="help-block text-danger">
                              {(this.props.touched['location'] && this.props.errors['location']) &&
                              <span className="text-danger">{this.props.errors['location']}</span> }
                              </p>
                            </div>

                            <div className="um-field um-field-user_password um-field-password um-field-type_password">
                              <div className="um-field-label">
                                <label htmlFor="password2">Password</label>
                                <div className="um-clear"></div>
                              </div>
                              <div className="um-field-area">
                                <input className="um-form-field valid " type="password" name="password2"
                                   id="password2" placeholder="password"
                                     onChange={this.props.handleChange} onBlur={this.props.handleBlur} />
                              </div>
                              <p className="help-block text-danger">
                              {(this.props.touched['password2'] && this.props.errors['password2']) &&
                              <span className="text-danger">{this.props.errors['password2']}</span> }
                              </p>
                            </div>

                            <div className="um-field um-field-user_password um-field-password um-field-type_password" >
                              <div className="um-field-label">
                                <label htmlFor="password1">Confirm Password</label>
                                <div className="um-clear"></div>
                              </div>
                              <div className="um-field-area">
                                <input className="um-form-field valid " type="password" name="password1"
                                   id="password1"  placeholder="confirm password"
                                    onChange={this.props.handleChange} onBlur={this.props.handleBlur}/>
                              </div>
                              <p className="help-block text-danger">
                              {(this.props.touched['password1'] && this.props.errors['password1']) &&
                              <span className="text-danger">{this.props.errors['password1']}</span> }
                              </p>
                            </div>

                          </div>
                        </div>
                        <div className="um-col-alt">
                          <div className="um-left um-half">
                            <input type="submit" value="Signup" className="text-uppercase um-button btn btn-success btn-lg" id="um-submit-btn" onClick={this.signup}/>
                          </div>
                          <div className="um-right um-half"> <a href="/login" className="text-uppercase um-button btn btn-default btn-lg um-alt"> Login </a>
                          </div>
                          <div className="um-clear"></div>
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
    user_location:'',
    password1:'',
    password2:'',
  }),
  validationSchema: Yup.object().shape({
    email:Yup.string().email("invalid email").required("invalid email"),
    user_location:Yup.string().min(1,"your location is too short").required("please input your location"),
    password1:Yup.string().min(8,"your password is too short").required("input your password"),
    password2: Yup.string().oneOf([Yup.ref('password1'), null], 'Passwords must match').required("input a confirmation password")
  }),
  handleSubmit:(values,{setSubmitting}) =>{
    //console.log("you've submitted the form. this are the submitted values: ",JSON.stringify(values));
  }
})(Signup));
