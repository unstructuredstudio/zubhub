import React,{Component} from 'react';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import {withFormik} from 'formik';
import * as Yup from 'yup';


class EmailConfirm extends Component{

  constructor(props){
    super(props);
    this.state = {
      error:null,
      username:null,
      key:null
    }
  }

  componentDidMount(){
      let {username, key} = this.getUsernameAndKey(this.props.location.search)
      this.setState({username, key})
  }

  getUsernameAndKey=(queryString)=>{
    let username = queryString.split("&&");
    let key = username[1].split("=")[1];
    username = username[0].split("=")[1];
    return {username, key};
  }



  confirmEmail=(e)=>{
    e.preventDefault();
    this.props.api.send_email_confirmation(this.state.key)
    .then(res=>{
          toast.success("Congratulations!, your email has been confirmed!");
          setTimeout(()=>{this.props.history.push("/")},4000)
    })
    .catch(error=>this.setState({error:error.message}))
  }

  render(){
    let {error, username}=this.state;

    return(

      <div>
        <ToastContainer/>
        <div className="empty-1" style={{backgroundColor:'#242424',
          WebKitBoxShadow:'0px 5px 5px 0px rgba(0,0,0,0.46)',MozBoxShadow:'0px 5px 5px 0px rgba(0,0,0,0.46)',
          boxShadow:'0px 5px 5px 0px rgba(0,0,0,0.46)'}}></div>
        <div id="content" className="site-content page-content">
        <div className="entry-header text-center">
        <p className="help-block text-danger">
            {error!==null &&
            <span className="text-danger">{error}</span> }
        </p>
          <h1 className="entry-title">Email Confirmation</h1>
          Please Confirm that you are {username} and that the email belongs to you:
        </div>
        <div className="page-content">
          <div className="container">
            <div id="post-2018" className="post-2018 page type-page status-publish hentry">
              <div className="entry-content">
                <div className="page-content-body">
                  <p></p>
                  <div className="um um-register um-2010 uimob500" style={{Opacity: '1'}}>
                    <div className="um-form">
                      <form name="password_reset" noValidate="noValidate">
                        <div className="um-col-alt">
                          <div className="um-left um-half">
                            <input type="submit" value="Confirm" className="text-uppercase um-button btn btn-success btn-lg" onClick={this.confirmEmail}/>
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


  export default EmailConfirm;
