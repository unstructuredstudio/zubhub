import ZubhubAPI from "../../api";
import * as ProjectActions from './projectActions';
import * as AuthActions from './authActions';
import { toast } from "react-toastify";

const API = new ZubhubAPI();


export const get_user_profile=(props)=>{
    return dispatch=>{
      let profile;
      return API.get_user_profile(props)
      .then((res) => {
        if (!res.username) {
          throw new Error(
            "an error occured while fetching user profile, please try again later"
          );
        } else {
          profile = res;
          return dispatch(ProjectActions.get_user_projects({
            username: res.username,
            limit: 4,
          }));
        }
      })
      .then((res) => {
          return {...res, profile, loading: false};
      })
      .catch((error) => {
        toast.warning(error.message);
        return { loading: false };
      });
    }
  }
  
  
  export const edit_user_profile=(props)=>{
    return dispatch=>{
      return API.edit_user_profile(props)
      .then((res) => {
        if (res.username) {
  
          dispatch(AuthActions.setAuthUser({
            username: res.username,
          }));
  
          return {profile:res}
  
        } else {
          throw new Error(
            "An error occured while updating your profile, please try again later"
          );
        }
      })
      .catch((error) => toast.warning(error.message));
    }
  }


export const toggle_follow=(props)=>{
    return ()=>{
        return API.toggle_follow(props)
        .then((res) => {
            if (res.username) {
              return { profile: res };
            } else {
              res = Object.keys(res)
                .map((key) => res[key])
                .join("\n");
              throw new Error(res);
            }
          })
          .catch((error) => {
            if (error.message.startsWith("Unexpected")) {
              toast.warning(
                "An error occured while performing this action. Please try again later"
              );
            } else {
              toast.warning(error.message);
            }
            return { loading: false };
          });
    }
}

export const get_followers=(value)=>{
    return ()=>{
        return API.get_followers(value)
        .then((res) => {
            if (Array.isArray(res.results)) {
              return {
                followers: res.results,
                prevPage: res.previous,
                nextPage: res.next,
                loading: false,
              };
            } else {
              res = Object.keys(res)
                .map((key) => res[key])
                .join("\n");
              throw new Error(res);
            }
          })
          .catch((error) => {
            toast.warning(error.message);
            return { loading: false };
          });
    }
}