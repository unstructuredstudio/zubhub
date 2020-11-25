
export const setAuthUser =(auth_user)=>{
  return dispatch => {
    dispatch({
      type:'SET_AUTH_USER',
      payload:auth_user
    })
  }
}

// export const login=(email,pass)=>{
//   return dispatch => {
//     API.login(email,pass,res=>{
//       console.log(res,"email: ",email,"password: ",pass);
//       dispatch({
//         type:'LOGIN',
//         payload:{response:res.response,signedin:res.signedin,error:res.error}
//       })
//     })
//   }
// }
//
// export const loginWithGoogleAuth=()=>{
//   return dispatch => {
//     API.loginWithGoogleAuth(res=>{
//       // console.log(res.response.user.email);
//       dispatch({
//         type:'LOGIN',
//         payload:{response:res.response,signedin:res.signedin,error:res.error}
//       })
//     })
//   }
// }
//
// export const loginWithFacebookAuth=()=>{
//   return dispatch=>{
//     API.loginWithFacebookAuth(res=>{
//       console.log(res);
//       dispatch({
//         type:'LOGIN',
//         payload:{response:res.response,signedin:res.signedin,error:res.error}
//       })
//     })
//   }
// }
//
// export const logout=()=>{
//   return dispatch=>{
//     API.logout(res=>{
//       console.log(res);
//       dispatch({
//         type:'LOGOUT',
//         payload:{response:res.response,signedin:res.signedin,error:res.error}
//       })
//     })
//   }
// }
//
// // auth/user-not-found"
// // auth/wrong-password
//
//
// export const signup =(values)=>{
//   return dispatch=>{
//     API.signup(values,res=>{
//       console.log(res);
//       dispatch({
//         type:'LOGIN',
//         payload:{response:res.response,signedin:res.signedin,error:res.error}
//       })
//     })
//   }
// }
