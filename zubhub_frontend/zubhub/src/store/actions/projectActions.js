import ZubhubAPI from '../../api';
import { toast } from 'react-toastify';
const API = new ZubhubAPI();

export const setProjects = projects => {
  return dispatch => {
    dispatch({
      type: 'SET_PROJECTS',
      payload: { all_projects: projects },
    });
  };
};

export const createProject = props => {
  return () => {
    return API.createProject(props).then(res => {
      if (!res.id) {
        throw new Error(JSON.stringify(res));
      } else {
        toast.success(props.t('createProject.createToastSuccess'));
        return props.history.push('/profile');
      }
    });
  };
};

export const updateProject = props => {
  return () => {
    return API.updateProject(props).then(res => {
      if (!res.id) {
        throw new Error(JSON.stringify(res));
      } else {
        toast.success(props.t('createProject.updateToastSuccess'));
        return props.history.push('/profile');
      }
    });
  };
};

export const deleteProject = args => {
  return () => {
    return API.deleteProject({ token: args.token, id: args.id }).then(res => {
      if (res.detail !== 'ok') {
        throw new Error(res.detail);
      } else {
        toast.success(args.t('projectDetails.deleteProjectToastSuccess'));
        return args.history.push('/profile');
      }
    });
  };
};

export const unpublishComment = args => {
  return () => {
    return API.unpublishComment({ token: args.token, id: args.id })
      .then(res => {
        if (res.text) {
          toast.success(args.t('comments.unpublishCommentToastSuccess'));
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
          toast.warning(args.t('comments.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
      });
  };
};

export const deleteComment = args => {
  return () => {
    return API.deleteComment({ token: args.token, id: args.id }).then(res => {
      if (res.detail !== 'ok') {
        throw new Error(res.detail);
      } else {
        toast.success(args.t('comments.deleteCommentToastSuccess'));
      }
    });
  };
};

export const getProject = args => {
  return () => {
    return API.getProject(args)
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

export const getProjects = args => {
  return dispatch => {
    return API.getProjects(args)
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

export const getCategories = args => {
  return () => {
    return API.getCategories()
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

export const searchProjects = args => {
  return () => {
    return API.searchProjects(args)
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

export const suggestTags = args => {
  return () => {
    return API.suggestTags(args.value)
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

export const getUserProjects = args => {
  return () => {
    return API.getUserProjects(args)
      .then(res => {
        if (Array.isArray(res.results)) {
          return {
            results: res.results,
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
          toast.warning(args.t('projects.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

export const getSaved = args => {
  return () => {
    return API.getSaved(args)
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

export const toggleLike = args => {
  return () => {
    return API.toggleLike(args)
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

export const toggleSave = args => {
  return () => {
    return API.toggleSave(args)
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

export const addComment = args => {
  return () => {
    return API.addComment(args)
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
          toast.warning(args.t('comments.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

export const setStaffPicks = staff_picks => {
  return dispatch => {
    dispatch({
      type: 'SET_PROJECTS',
      payload: { staff_picks },
    });
  };
};

export const setHero = hero => {
  return dispatch => {
    dispatch({
      type: 'SET_PROJECTS',
      payload: { hero },
    });
  };
};

export const getHero = args => {
  return dispatch => {
    return API.getHero()
      .then(res => {
        if (res.id) {
          dispatch(setHero(res));
          return { loading: false };
        } else {
          dispatch(setHero({}));
          return { loading: false };
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

export const getStaffPicks = args => {
  return dispatch => {
    return API.getStaffPicks()
      .then(res => {
        if (Array.isArray(res)) {
          dispatch(setStaffPicks(res));
          return { loading: false };
        } else if (res.detail === 'not found') {
          dispatch(setStaffPicks([]));
        } else {
          dispatch(setStaffPicks([]));
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

export const getStaffPick = args => {
  return () => {
    return API.getStaffPick(args)
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
