import ZubhubAPI from '../../api';
import { toast } from 'react-toastify';

const API = new ZubhubAPI();

/**
 * @function setAuthUser
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const setAuthUser = auth_user => {
  return dispatch => {
    dispatch({
      type: 'SET_AUTH_USER',
      payload: auth_user,
    });
  };
};

/**
 * @function login
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */

export const login = args => {
  return dispatch => {
    return API.login(args.values)
      .then(res => {
        if (!res.key) {
          throw new Error(JSON.stringify(res));
        }
        dispatch({
          type: 'SET_AUTH_USER',
          payload: { token: res.key },
        });
      })
      .then(() => {
        const initialUrl = sessionStorage.getItem('initialUrl');
        if (initialUrl) {
          sessionStorage.removeItem('initialUrl')
          window.location.href = initialUrl;
        } else {
          args.history.push('/');
        }
      });
  };
};

/**
 * @function logout
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const logout = args => {
  return dispatch => {
    return API.logout(args.token)
      .then(_ => {
        dispatch({
          type: 'SET_AUTH_USER',
          payload: {
            token: null,
            username: null,
            id: null,
            avatar: null,
            members_count: null,
            tags: [],
          },
        });
      })
      .then(_ => {
        args.history.push('/');
      })
      .catch(_ => {
        toast.warning(args.t('pageWrapper.errors.logoutFailed'));
      });
  };
};

/**
 * @function getAuthUser
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getAuthUser = props => {
  return dispatch => {
      return API.getAuthUser(props.auth.token)
      .then(res => {
        if (!res.id) {
          dispatch(
            logout({
              token: props.auth.token,
              history: props.history,
              t: props.t,
            }),
          ).then(() => {
            props.history.push('/account-status');
          });
          throw new Error(props.t('pageWrapper.errors.unexpected'));
        } else {
          dispatch({
            type: 'SET_AUTH_USER',
            payload: {
              ...props.auth,
              username: res.username,
              id: res.id,
              avatar: res.avatar,
              members_count: res.members_count,
              tags: res.tags,
            },
          });
        }

        return res;
      })
      .catch(error => toast.warning(error.message));
  };
};


export const AccountStatus = args => {
  return () => {
    return API.getAccountStatus(args.token).catch(() => {
      toast.warning(args.t('pageWrapper.errors.unexpected'));
    });
  };
};

/**
 * @function signup
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const signup = args => {
  return dispatch => {
    return API.signup(args.values)
      .then(res => {
        if (!res.key) {
          throw new Error(JSON.stringify(res));
        }
        dispatch({
          type: 'SET_AUTH_USER',
          payload: { token: res.key },
        });
      })
      .then(() => args.history.push('/profile'));
  };
};

/**
 * @function sendEmailConfirmation
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const sendEmailConfirmation = args => {
  return () => {
    return API.sendEmailConfirmation(args.key).then(res => {
      if (res.detail !== 'ok') {
        throw new Error(res.detail);
      } else {
        toast.success(args.t('emailConfirm.toastSuccess'));
        setTimeout(() => {
          args.history.push('/');
        }, 4000);
      }
    });
  };
};

/**
 * @function sendPhoneConfirmation
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const sendPhoneConfirmation = args => {
  return () => {
    return API.sendPhoneConfirmation(args.key).then(res => {
      if (res.detail !== 'ok') {
        throw new Error(res.detail);
      } else {
        toast.success(args.t('phoneConfirm.toastSuccess'));
        setTimeout(() => {
          args.history.push('/');
        }, 4000);
      }
    });
  };
};

/**
 * @function sendPasswordResetLink
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const sendPasswordResetLink = args => {
  return () => {
    return API.sendPasswordResetLink(args.email).then(res => {
      if (res.detail !== 'ok') {
        throw new Error(JSON.stringify(res));
      } else {
        toast.success(args.t('passwordReset.toastSuccess'));
        setTimeout(() => {
          args.history.push('/');
        }, 4000);
      }
    });
  };
};

/**
 * @function passwordResetConfirm
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const passwordResetConfirm = args => {
  return () => {
    return API.passwordResetConfirm(args).then(res => {
      if (res.detail !== 'ok') {
        throw new Error(JSON.stringify(res));
      } else {
        toast.success(args.t('passwordResetConfirm.toastSuccess'));
        setTimeout(() => {
          args.history.push('/login');
        }, 4000);
      }
    });
  };
};

/**
 * @function getLocations
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getLocations = args => {
  return () => {
    return API.getLocations()
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
            error: args.t('signup.errors.unexpected'),
          };
        } else {
          return { error: error.message };
        }
      });
  };
};

/**
 * @function deleteAccount
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const deleteAccount = args => {
  return () => {
    return API.deleteAccount(args)
      .then(res => {
        if (res.detail !== 'ok') {
          throw new Error(res.detail);
        } else {
          toast.success(args.t('profile.delete.toastSuccess'));
          args.logout(args);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          return {
            dialog_error: args.t('profile.delete.errors.unexpected'),
          };
        } else {
          return { dialog_error: error.message };
        }
      });
  };
};

/**
 * @function getSignature
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getSignature = args => {
  return () => {
    const t = args.t;
    delete args.t;
    return API.getSignature(args)
      .then(res => {
        if (!res.signature) {
          throw new Error();
        } else {
          return res;
        }
      })
      .catch(() => {
        toast.warning(t('createProject.errors.unexpected'));
      });
  };
};
