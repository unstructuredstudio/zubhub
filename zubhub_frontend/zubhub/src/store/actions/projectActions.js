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
        toast.success(args.t('projectDetails.deleteProjectToastSuccess'));
        return args.history.push('/profile');
      }
    });
  };
};

export const unpublish_comment = args => {
  return () => {
    return API.unpublish_comment({ token: args.token, id: args.id })
      .then(res => {
        if (res.id) {
          return res;
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
      });
  };
};

export const delete_comment = args => {
  return () => {
    return API.delete_comment({ token: args.token, id: args.id }).then(res => {
      if (res.detail !== 'ok') {
        throw new Error(res.detail);
      } else {
        toast.success(args.t('projectDetails.deleteCommentToastSuccess'));
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

export const get_categories = args => {
  return () => {
    return API.get_categories()
      .then(res => {
        if (Array.isArray(res) && res.length > 0 && res[0].name) {
          return { categories: res, loading: false };
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
                  
export const search_projects = args => {
  return () => {
    return API.search_projects(args)
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
            
export const suggest_tags = args => {
  return () => {
    return API.suggest_tags(args.value)
      .then(res => {
        if (Array.isArray(res)) {
          return res.length > 0
            ? { tag_suggestion: res }
            : { tag_suggestion_open: false };
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
        return { tag_suggestion_open: false };
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

export const set_staff_picks = staff_picks => {
  return dispatch => {
    dispatch({
      type: 'SET_PROJECTS',
      payload: { staff_picks },
    });
  };
};

export const get_staff_picks = args => {
  return dispatch => {
    return API.get_staff_picks()
      .then(res => {
        if (Array.isArray(res)) {
          dispatch(set_staff_picks(res));
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

export const get_staff_pick = args => {
  return () => {
    return API.get_staff_pick(args)
      .then(res => {
        if (res.id) {
          return {
            staff_pick: res,
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
