import ZubhubAPI from '../../api';
import * as ProjectActions from './projectActions';
import * as AuthActions from './authActions';
import { toast } from 'react-toastify';

const API = new ZubhubAPI();

/**
 * @function getUserProfile
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getUserProfile = args => {
  return dispatch => {
    let profile;
    return API.getUserProfile(args)
      .then(res => {
        if (!res.username) {
          throw new Error(args.t('profile.errors.profileFetchError'));
        } else {
          profile = res;
          return dispatch(
            ProjectActions.getUserProjects({
              username: res.username,
              limit: 4,
              token: args.token,
              t: args.t
            }),
          );
        }
      })
      .then(res => {
        return { ...res, profile, loading: false };
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('profile.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

/**
 * @function editUserProfile
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const editUserProfile = args => {
  return dispatch => {
    return API.editUserProfile(args).then(res => {
      if (res.id) {
        dispatch(
          AuthActions.setAuthUser({
            avatar: res.avatar,
            username: res.username,
          }),
        );

        return { profile: res };
      } else {
        throw new Error(JSON.stringify(res));
      }
    });
  };
};

/**
 * @function suggestCreators
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const suggestCreators = args => {
  return () => {
    return API.searchCreators(args)
      .then(res => {
        if (Array.isArray(res.results)) {
          return res.results.length > 0
            ? { creator_suggestion: res.results }
            : { creator_suggestion_open: false };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('profile.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { creator_suggestion_open: false };
      });
  };
};

/**
 * @function searchCreators
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const searchCreators = args => {
  return () => {
    return API.searchCreators(args)
      .then(res => {
        if (Array.isArray(res.results)) {
          return { ...res, loading: false, tab: args.tab };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('projects.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false, tab: args.tab };
      });
  };
};

/**
 * @function toggleFollow
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const toggleFollow = args => {
  return () => {
    return API.toggleFollow(args)
      .then(res => {
        if (res.username) {
          return { profile: res };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('profile.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

/**
 * @function removeMember
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const removeMember = args => {
  return () => {
    return API.removeMember(args)
      .then(res => {
        if (res.username) {
          return { profile: res };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('groupMembers.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

/**
 * @function addMembers
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const addMembers = args => {
  return () => {
    return API.addMembers(args).then(res => {
      if (!res.id) {
        throw new Error(JSON.stringify(res));
      } else {
        toast.success(args.t('addGroupMembers.createToastSuccess'));
        return args.history.push('/profile');
      }
    });
  };
};

/**
 * @function getMembers
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getMembers = args => {
  return () => {
    return API.getMembers(args)
      .then(res => {
        if (Array.isArray(res.results)) {
          return {
            members: res.results,
            prev_page: res.previous,
            next_page: res.next,
            loading: false,
          };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('groupMembers.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

/**
 * @function getFollowers
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getFollowers = args => {
  return () => {
    return API.getFollowers(args)
      .then(res => {
        if (Array.isArray(res.results)) {
          return {
            followers: res.results,
            prev_page: res.previous,
            next_page: res.next,
            loading: false,
          };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('profile.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

/**
 * @function getFollowing
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getFollowing = args => {
  return () => {
    return API.getFollowing(args)
      .then(res => {
        if (Array.isArray(res.results)) {
          return {
            following: res.results,
            prev_page: res.previous,
            next_page: res.next,
            loading: false,
          };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('profile.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

/**
 * @function addComment
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const addComment = args => {
  return () => {
    return API.addProfileComment(args)
      .then(res => {
        if (res.username) {
          return { profile: res, loading: false };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('comments.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

/**
 * @function sendGroupInviteConfirmation
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const sendGroupInviteConfirmation = args => {
  return () => {
    return API.sendGroupInviteConfirmation(args.key).then(res => {
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
 * @function getHelp
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getHelp = args => {
  return () => {
    return API.getHelp()
      .then(res => {
        if (res) {
          return { help: res, loading: false };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('signup.errors.unexpected'));
          return {
            loading: false,
          };
        } else {
          toast.warning(args.t('signup.errors.unexpected'));
          return { loading: false };
        }
      });
  };
};

/**
 * @function getPrivacy
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getPrivacy = args => {
  return () => {
    return API.getPrivacy()
      .then(res => {
        if (res) {
          return { privacy: res, loading: false };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('signup.errors.unexpected'));
          return {
            loading: false,
          };
        } else {
          toast.warning(args.t('signup.errors.unexpected'));
          return { loading: false };
        }
      });
  };
};

/**
 * @function getFaqs
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getFaqs = args => {
  return () => {
    return API.getFaqs()
      .then(res => {
        if (res) {
          return { faqs: res, loading: false };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('signup.errors.unexpected'));
          return {
            loading: false,
          };
        } else {
          toast.warning(args.t('signup.errors.unexpected'));
          return { loading: false };
        }
      });
  };
};

/**
 * @function getAmbassadors
 * @author Srishti Sethi <srishti@unstructured.studio>
 *
 * @todo - describe function's signature
 */
 export const getAmbassadors = args => {
  return () => {
    return API.getAmbassadors()
      .then(res => {
        if (res) {
          return { ambassadors: res, loading: false };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('signup.errors.unexpected'));
          return {
            loading: false,
          };
        } else {
          console.log('sorry')
          toast.warning(args.t('signup.errors.unexpected'));
          return { loading: false };
        }
      });
  };
};
