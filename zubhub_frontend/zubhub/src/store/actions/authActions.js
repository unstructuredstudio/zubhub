
export const setAuthUser =(auth_user)=>{
  return dispatch => {
    dispatch({
      type:'SET_AUTH_USER',
      payload:auth_user
    })
  }
}
