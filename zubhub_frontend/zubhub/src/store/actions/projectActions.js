import ZubhubAPI from '../../api';
import { toast } from 'react-toastify';
const API = new ZubhubAPI();


/**
* @function setProjects
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const setProjects = projects => {
  return dispatch => {
    dispatch({
      type: 'SET_PROJECTS',
      payload: { all_projects: projects },
    });
  };
};



/**
* @function createProject
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const createProject = (props, redirect = true) => {
  return () => {
    return API.createProject(props).then(res => {
      if (!res.id) {
        console.log(res);
        throw new Error(JSON.stringify(res));
      } else {
        console.log("I'm here!");
        if (redirect) {
          toast.success(props.t('createProject.createToastSuccess'));
          return props.history.push('/profile');
        }
      }
    });
  };
};



/**
* @function shouldUploadToLocal
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const shouldUploadToLocal = args => {
  return () => {
    return API.shouldUploadToLocal(args).then(res => {
      if (res.local === undefined) {
        throw new Error();
      } else {
        return res;
      }
    })
      .catch(() => {
        toast.warning(args.t('createProject.errors.unexpected'))
      })
  }
};



/**
* @function updateProject
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const updateProject = (props, redirect) => {
  return () => {
    return API.updateProject(props).then(res => {
      if (!res.id) {
        throw new Error(JSON.stringify(res));
      } else {
        if (redirect) {
          toast.success(props.t('createProject.updateToastSuccess'));
          return props.history.push('/profile');
        }
      }
    });
  };
};

/**
* @function deleteProject
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
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


/**
* @function unpublishComment
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
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


/**
* @function deleteComment
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
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



/**
* @function getProject
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
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



/**
* @function getProjects
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
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


/**
* @function getCategories
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
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



/**
* @function searchProjects
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
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



/**
* @function suggestTags
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
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


/**
* @function getUserProjects
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
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


/**
* @function getSaved
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
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


/**
* @function toggleLike
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
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



/**
* @function toggleSave
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
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



/**
* @function addComment
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
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



/**
* @function setStaffPicks
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const setStaffPicks = staff_picks => {
  return dispatch => {
    dispatch({
      type: 'SET_PROJECTS',
      payload: { staff_picks },
    });
  };
};


/**
* @function setHero
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const setHero = hero => {
  return dispatch => {
    dispatch({
      type: 'SET_PROJECTS',
      payload: { hero },
    });
  };
};



/**
* @function getHero
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const getHero = args => {
  return dispatch => {
    return API.getHero()
      .then(res => {
        dispatch(setHero(res));
        return { loading: false };
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



/**
* @function getStaffPicks
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
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


/**
* @function getStaffPick
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
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
