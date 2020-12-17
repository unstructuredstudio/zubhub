import React,{Component} from 'react';
import { toast } from 'react-toastify';
import {withFormik} from 'formik';

class EditProfile extends Component{
  
    updateProfile=(e)=>{
        e.preventDefault();
        this.props.api.edit_user_profile({token: this.props.auth.token, ...this.props.values})
        .then(res=>{
            if(res.username){
             this.props.setProfile(res);
             this.props.setReadOnly(true);
            }
            else {throw new Error("An error occured while updating your profile, please try again later")}
        })
        .catch(error=>toast.warning(error.message))
    }
  

  render(){
        return (
        <>
        <button onClick={(e, value=true)=>this.props.setReadOnly(value)}>X</button>

        <form name="profile" noValidate="noValidate" onSubmit={this.props.handleSubmit}>

            <label htmlFor="username">Username:</label>
            <input autoComplete="off" className="um-form-field valid " type="text" 
            name="username" id="username"  placeholder={this.props.profile.username} 
            onChange={this.props.handleChange} onBlur={this.props.handleBlur}/>
        
        <input type="submit" value="Save" onClick={this.updateProfile}/>
       </form>
       </>
       )
    }
}



export default withFormik({
        mapPropsToValue: ()=>({
            username: ''
        }),
        handleSubmit:(values,{setSubmitting}) =>{
        }
    })(EditProfile);