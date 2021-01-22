import ZubhubAPI from '../../api';
import { toast } from 'react-toastify';

const API = new ZubhubAPI();

export const setAuthUser = auth_user => {
  return dispatch => {
    dispatch({
      type: 'SET_AUTH_USER',
      payload: auth_user,
    });
  };
};

export const login = props => {
  return dispatch => {
    return API.login(props.values)
      .then(res => {
          if (!res.key) {
            throw new Error(JSON.stringify(res));
          }
        dispatch({
          type: 'SET_AUTH_USER',
          payload: { token: res.key },
        });
      })
      .then(() => props.history.push('/profile'))
  };
};

export const logout = props => {
  return dispatch => {
    API.logout(props.auth.token)
      .then(res => {
        dispatch({
          type: 'SET_AUTH_USER',
          payload: { token: null, username: null, id: null },
        });
      })
      .then(res => {
        props.history.push('/');
      })
      .catch(error => {
        toast.warning(
          'An error occured while signing you out. please try again',
        );
      });
  };
};

export const get_auth_user = props => {
  return dispatch => {
    return API.get_auth_user(props.auth.token)
      .then(res => {
        if (!res.username) {
          throw new Error(
            'an error occured while getting user profile, please try again later',
          );
        }

        dispatch({
          type: 'SET_AUTH_USER',
          payload: { ...props.auth, username: res.username, id: res.id },
        });
      })
      .catch(error => toast.warning(error.message));
  };
};

export const signup = props => {
  return dispatch => {
    return API.signup(props.values)
      .then(res => {
        if (!res.key) {
          throw new Error(JSON.stringify(res));
        }
        dispatch({
          type: 'SET_AUTH_USER',
          payload: { token: res.key },
        });
      })
      .then(() => props.history.push('/profile'))
  };
};

export const send_email_confirmation = (props, key) => {
  return () => {
    return API.send_email_confirmation(key)
      .then(res => {
        if (res.detail !== 'ok') {
          throw new Error(res.detail);
        } else {
        toast.success('Congratulations!, your email has been confirmed!');
        setTimeout(() => {
          props.history.push('/');
        }, 4000);
      }
      })
  };
};

export const send_password_reset_link = props => {
  return () => {
    return API.send_password_reset_link(props.values.email)
      .then(res => {
        if (res.detail !== "Password reset e-mail has been sent.") {
          throw new Error(JSON.stringify(res));
        } else {
        toast.success('We just sent a password reset link to your email!');
        setTimeout(() => {
          props.history.push('/');
        }, 4000);
      }
      })
  };
};

export const password_reset_confirm = props => {
  return () => {
    return API.password_reset_confirm(props)
      .then(res => {
        if (res.detail !== "Password has been reset with the new password.") {
          throw new Error(JSON.stringify(res));
        } 
        else {
        toast.success(
          'Congratulations! your password reset was successful! you will now be redirected to login',
        );
        setTimeout(() => {
          props.history.push('/login');
        }, 4000);
      }
      })
  };
};

export const get_locations = () => {
  return () => {
    return API.get_locations()
      .then(res => {
        if (Array.isArray(res) && res.length > 0 && res[0].name) {
          return { locations: res };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          return {
            error:
              'An error occured while performing this action. Please try again later',
          };
        } else {
          return { error: error.message };
        }
      });
  };
};
