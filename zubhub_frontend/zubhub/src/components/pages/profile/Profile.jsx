import React,{Component} from 'react';
import {connect} from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { Link, withRouter } from 'react-router-dom';
import EditProfile from './profile_components/EditProfile';
import * as AuthActions from '../../../store/actions/authActions';

class Profile extends Component{
  constructor(props){
    super(props);
    this.state={
        profile: {},
        readOnly: true,
        loading: true
    }
  }

  componentDidMount(){
    if(this.props.auth.token){
        this.props.api.get_auth_user(this.props.auth.token)
        .then(res=>{
          if(!res.username){
            throw new Error("an error occured while getting user profile, please try again later")
          }
          this.setState({profile: res, loading: false})
        })
        .catch(error=>{toast.warning(error.message); this.setState({loading: false})})
        }
  }

 setReadOnly=value=>this.setState({readOnly: value})

 setProfile=value=>{
                  this.setState({profile: value});
                  this.props.set_auth_user({...this.props.auth, username: value.username})
                }

  render(){
      let {profile, loading, readOnly} = this.state;
      
      if(this.props.auth.token){

          if(loading){
            return <div>
                    fetching user profile...........
                    </div>
            }
            else if(Object.keys(profile).length > 0) {
                         return <>
                            {
                             readOnly ? <button onClick={(e, value = false)=>this.setReadOnly(value)}>Edit</button>
                             :
                             <EditProfile profile={profile} setProfile={value=>this.setProfile(value)} 
                             setReadOnly={value=>this.setReadOnly(value)} {...this.props} />
                            }

                            <button><Link to="/projects/create">Create Project</Link></button>
                            <img src={profile.avatar} alt="profile"/>
                            
                            <div>Username: {profile.username}</div>
                        
                    
                            <div>Email: {profile.email}</div>
                        
                            <div>First Name: {profile.first_name}</div>
                        
                            <div>Last Name: {profile.last_name}</div>
                            
                            <div>Phone: {profile.phone}</div>
                    
                            <div>Date Of Birth: {profile.dateOfBirth}</div>
                    
                            <div>Location: {profile.location}</div>
                    
                            <div>Bio: {profile.bio}</div>
                            </>
                } else {
                    return <div>
                            Couldn't fetch profile, try again later
                            </div>
                }
            } else {
                    return <div>You are not logged in. Click on sign in to get started</div>
                }
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
    )(Profile);