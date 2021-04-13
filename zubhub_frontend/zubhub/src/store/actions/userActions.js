import ZubhubAPI from '../../api';
import * as ProjectActions from './projectActions';
import * as AuthActions from './authActions';
import { toast } from 'react-toastify';

const API = new ZubhubAPI();

export const get_user_profile = args => {
  return dispatch => {
    let profile;
    return API.get_user_profile(args)
      .then(res => {
        if (!res.username) {
          throw new Error(args.t('profile.errors.profileFetchError'));
        } else {
          profile = res;
          return dispatch(
            ProjectActions.get_user_projects({
              username: res.username,
              limit: 4,
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

export const edit_user_profile = args => {
  return dispatch => {
    return API.edit_user_profile(args).then(res => {
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

export const search_creators = args => {
  return () => {
    return API.search_creators(args)
      .then(res => {
        if (Array.isArray(res.results)) {
          return { ...res, loading: false, type: args.type };
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
        return { loading: false, type: args.type };
      });
  };
};

export const toggle_follow = args => {
  return () => {
    return API.toggle_follow(args)
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

export const remove_member = args => {
  return () => {
    return API.remove_member(args)
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

export const add_members = args => {
  return () => {
    return API.add_members(args).then(res => {
      if (!res.id) {
        throw new Error(JSON.stringify(res));
      } else {
        toast.success(args.t('addGroupMembers.createToastSuccess'));
        return args.history.push('/profile');
      }
    });
  };
};

export const get_members = args => {
  return () => {
    return API.get_members(args)
      .then(res => {
        if (Array.isArray(res.results)) {
          return {
            members: res.results,
            prevPage: res.previous,
            nextPage: res.next,
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

export const get_followers = args => {
  return () => {
    return API.get_followers(args)
      .then(res => {
        if (Array.isArray(res.results)) {
          return {
            followers: res.results,
            prevPage: res.previous,
            nextPage: res.next,
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

export const get_following = args => {
  return () => {
    return API.get_following(args)
      .then(res => {
        if (Array.isArray(res.results)) {
          return {
            following: res.results,
            prevPage: res.previous,
            nextPage: res.next,
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

export const send_group_invite_confirmation = args => {
  return () => {
    return API.send_group_invite_confirmation(args.key).then(res => {
      if (res.detail !== 'ok') {
        throw new Error(res.detail);
      } else {
        toast.success(args.t('emailConfirm.toastSuccess'));
        setTimeout(() => {
          args.history.push('/');
        }, 4000);
    }
 });

export const get_help = args => {
  return () => {
    return API.get_help()
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

export const get_privacy = args => {
  return () => {
    return API.get_privacy()
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

export const get_faqs = args => {
  return () => {
    return API.get_faqs()
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
