class API {
  constructor(){
    this.domain = "http://127.0.0.1:8000/api/"
  }

  request=({url = '/', method = 'GET', token, body})=>{

            if(method === 'GET' && !token){
              return fetch(this.domain + url, {
                method,
                xsrfCookieName: 'csrftoken',
                xsrfHeaderName: 'X-CSRFToken',
                withCredentials:'true',
                headers: new Headers({
                  'Content-Type': 'application/json'
                })
              })
            }
            else if(token && body){

              return fetch(this.domain + url, {
                    method,
                    xsrfCookieName: 'csrftoken',
                    xsrfHeaderName: 'X-CSRFToken',
                    withCredentials:'true',
                    headers: new Headers({
                      'Authorization':`Token ${token}`,
                      'Content-Type': 'application/json'
                    }),
                    body
                })
              }
            else if(token){
              return fetch(this.domain + url, {
                method,
                xsrfCookieName: 'csrftoken',
                xsrfHeaderName: 'X-CSRFToken',
                withCredentials:'true',
                headers: new Headers({
                  'Authorization':`Token ${token}`,
                  'Content-Type': 'application/json'
                })
            })
            }
            else if(body){
              return fetch(this.domain + url, {
                method,
                xsrfCookieName: 'csrftoken',
                xsrfHeaderName: 'X-CSRFToken',
                withCredentials:'true',
                headers: new Headers({
                  'Content-Type': 'application/json'
                }),
                body,
            })
            }
            }

  /**********************login with email and password******************************/
    login=({username, password})=>{
      let url = 'rest-auth/login/';
      let method = 'POST';
      let body = JSON.stringify({username, password});

      return this.request({url, method, body })
             .then(res=>res.json())
    }
    /****************************************************/

  /**********************logout******************************/
  logout=(token)=>{
    let url = "rest-auth/logout/";
    let method = "POST";
    return this.request({url, method, token})
           .then(res=>res.json())
    }
    /****************************************************/

/**********************signup******************************/
    signup=({username, email, dateOfBirth, user_location, password1, password2})=>{
      let url = 'rest-auth/registration/';
      let method = 'POST';
      let body = JSON.stringify({username, email, dateOfBirth, location: user_location, password1, password2});

      return this.request({url, method, body })
             .then(res=>res.json())
    }
    /****************************************************/


/*****************send email confirmation ******************/
send_email_confirmation=(key)=>{
  let url = 'rest-auth/registration/verify-email/';
  let method = 'POST';
  let body = JSON.stringify({key})

  return this.request({url, method, body})
         .then(res=>res.json())
}
/*******************************************************************/


/********************send password reset link********************************/
send_password_reset_link=(email)=>{
  let url = 'rest-auth/password/reset/';
  let method = 'POST';
  let body = JSON.stringify({email});

  return this.request({url, method, body})
         .then(res=>res.json())
}
/********************************************************************/

/********************password reset confirmation********************************/
password_reset_confirm=({new_password1, new_password2, uid, token})=>{
  let url = 'rest-auth/password/reset/confirm/';
  let method = 'POST';
  let body = JSON.stringify({new_password1, new_password2, uid, token});

  return this.request({url, method, body})
         .then(res=>res.json())
}
/********************************************************************/

/************************** get authenticated user's details **************************/
get_auth_user=(token)=>{
  console.log(token);
  let url = "creators/authUser/";
  return this.request({url, token})
         .then(res=>res.json())
}
/********************************************************************/


/************************** get user profile **************************/
get_user_profile=({username, token})=>{

  let url = `creators/${username}/`;
  if(token){
  return this.request({url, token})
         .then(res=>res.json())
  } else {
    return this.request({url})
           .then(res=>res.json())
  }
}

/************************** edit user profile **************************/
edit_user_profile=(profile)=>{
  let {username} = profile;

  let url = "creators/edit_creator/";
  let method = "PUT";
  let token = profile.token;
  let body = JSON.stringify({ username })
  return this.request({url, method, token, body})
         .then(res=>res.json())
}
/********************************************************************/

/************************** get all locations **************************/
get_locations=()=>{
  let url = "creators/locations/";
  return this.request({url})
         .then(res=> res.json())
}
/********************************************************************/

/************************** create project **************************/
create_project=({token, title, description, video, materials_used})=>{
  let url = "projects/create/";
  let method = "POST";
  let body = JSON.stringify({ title, description, video, materials_used })
  return this.request({url, method, token, body})
         .then(res=>res.json())
}

/************************** get projects **************************/
get_projects=(page)=>{
  let url = page ? `projects/?${page}` : `projects/`;
  return this.request({url})
         .then(res=>res.json())
}

/************************** get project **************************/
get_project=({id, token})=>{
  let url = `projects/${id}`;
  if(token){
  return this.request({url, token})
         .then(res=>res.json())
  }
  else {
    return this.request({url})
           .then(res=>res.json())
  }
}

/************************** like project **************************/
toggle_like=({id, token})=>{
  let url = `projects/${id}/toggle_like/`;
  
  return this.request({url, token})
         .then(res=>res.json())
  
  
}

/************************** add comment **************************/
add_comment=({id, text, token})=>{
  let url = `projects/${id}/add_comment/`;
  let method = "POST";
  let body = JSON.stringify({text})

  return this.request({url, method, body, token})
         .then(res=>res.json())
  
}

}


export default API;
