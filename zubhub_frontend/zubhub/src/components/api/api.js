class API {
  constructor(){
    this.domain = "http://127.0.0.1:8000/api/"
  }

  request=({url = '/', method = 'GET', token, body})=>{
            if(method === 'GET'){
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
    signup=({username, email, first_name, last_name,
            phone, dateOfBirth, location, password1, password2})=>{
      let url = 'rest-auth/registration/';
      let method = 'POST';
      let body = JSON.stringify({username, email, first_name, phone, 
                dateOfBirth, location, last_name, password1, password2});

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

/************************** create project **************************/
create_project=({token, title, description, video, materials_used})=>{
  let url = "projects/create/";
  let method = "POST";
  let body = JSON.stringify({ title, description, video, materials_used })
  return this.request({url, method, token, body})
         .then(res=>res.json())
}

}


export default API;
