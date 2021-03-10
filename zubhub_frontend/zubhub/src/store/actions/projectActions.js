import ZubhubAPI from '../../api';
import { toast } from 'react-toastify';
const API = new ZubhubAPI();

export const set_projects = projects => {
  return dispatch => {
    dispatch({
      type: 'SET_PROJECTS',
      payload: { all_projects: projects },
    });
  };
};

export const create_project = props => {
  return () => {
    return API.create_project(props).then(res => {
      if (!res.id) {
        throw new Error(JSON.stringify(res));
      } else {
        toast.success(props.t('createProject.createToastSuccess'));
        return props.history.push('/profile');
      }
    });
  };
};

export const update_project = props => {
  return () => {
    return API.update_project(props).then(res => {
      if (!res.id) {
        throw new Error(JSON.stringify(res));
      } else {
        toast.success(props.t('createProject.updateToastSuccess'));
        return props.history.push('/profile');
      }
    });
  };
};

export const delete_project = args => {
  return () => {
    return API.delete_project({ token: args.token, id: args.id }).then(res => {
      if (res.detail !== 'ok') {
        throw new Error(res.detail);
      } else {
        toast.success(args.t('projectDetails.deleteToastSuccess'));
        return args.history.push('/profile');
      }
    });
  };
};

export const get_project = args => {
  return () => {
    return API.get_project(args)
      .then(res => {
        if (res.title) {
          return { project: res, loading: false };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('projectDetails.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

export const get_projects = args => {
  return dispatch => {
    return API.get_projects(args)
      .then(res => {
        if (Array.isArray(res.results)) {
          dispatch({
            type: 'SET_PROJECTS',
            payload: { all_projects: res },
          });
          return { loading: false };
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
        return { loading: false };
      });
  };
};

export const get_user_projects = args => {
  return () => {
    return API.get_user_projects(args)
      .then(res => {
        if (Array.isArray(res.results)) {
          return {
            results: res.results,
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
          toast.warning(args.t('projects.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

export const get_saved = args => {
  return () => {
    return API.get_saved(args)
      .then(res => {
        if (Array.isArray(res.results)) {
          return {
            ...res,
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
          toast.warning(args.t('savedProjects.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

export const toggle_like = args => {
  return () => {
    return API.toggle_like(args)
      .then(res => {
        if (res.title) {
          return { project: res };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('projectDetails.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }

        return { loading: false };
      });
  };
};

export const toggle_save = args => {
  return () => {
    return API.toggle_save(args)
      .then(res => {
        if (res.title) {
          return { project: res };
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
        return { loading: false };
      });
  };
};

export const add_comment = args => {
  return () => {
    return API.add_comment(args)
      .then(res => {
        if (res.title) {
          return { project: res };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('projectDetails.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};
