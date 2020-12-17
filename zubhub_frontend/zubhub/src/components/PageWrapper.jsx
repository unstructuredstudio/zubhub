import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import { withAPI } from './api';
// import { AuthUserContext } from '../components/session';

import { ToastContainer, toast } from 'react-toastify';

import * as AuthActions from '../store/actions/authActions';

import unstructuredLogo from '../assets/images/logos/unstructured-logo.png';
import logo from '../assets/images/logos/logo.png';


class PageWrapper extends Component {

  constructor(props){
    super(props);

    this.state = {
      username: null
    }
  }

  componentDidMount(){
    if(this.props.auth.token){
    this.props.api.get_auth_user(this.props.auth.token)
    .then(res=>{
      if(!res.username){
        throw new Error("an error occured while getting user profile, please try again later")
      }
      this.props.set_auth_user({...this.props.auth, username: res.username})
    })
    .catch(error=>toast.warning(error.message))
    }
  }

  logout=(e)=>{
    // e.preventDefault();
    this.props.api.logout(this.props.auth.token)
    .then(res=>{
      this.props.set_auth_user({token:null, username: null})})
    .catch(error=>{
      toast.warning("An error occured while signing you out. please try again")
    })

  }


render(){
return (
  <div>
    <ToastContainer/>
    <header className="App-header">
      <Link to="/"><img src={logo} className="App-logo" alt="logo" /></Link>
      <div className="float-right">
          {!this.props.auth.token ?
            <>
            <Link className="btn btn-success" to="/login">Sign In</Link>
            <Link className="btn btn-primary" to="/signup">Sign Up</Link>
            </>
            :
            <>
            <Link to="/profile"><img src={`https://robohash.org/${this.props.auth.username}`} className="profile_image" aria-label="creator profile"/></Link>
            <Link className="btn btn-danger" onClick={this.logout}>Logout</Link>
            </>
          }
        </div>
    </header>

		{this.props.children}

    <footer className="footer-distributed">
      <div className="footer-right">

      </div>

      <div className="footer-left">

      </div>
      <img src={unstructuredLogo} className="footer-logo" alt="unstructured-studio-logo" />
    </footer>
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
)(withAPI(PageWrapper));
