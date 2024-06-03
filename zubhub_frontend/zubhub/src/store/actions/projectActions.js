import { toast } from 'react-toastify';
import ZubhubAPI from '../../api';

const API = new ZubhubAPI();

/**
 * @function setProjects
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const setProjects = projects => dispatch => {
  dispatch({
    type: 'SET_PROJECTS',
    payload: { all_projects: projects },
  });
};

/**
 * @function createProject
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const createProject = props => () =>
  API.createProject(props).then(res => {
    if (!res.id) {
      throw new Error(JSON.stringify(res));
    } else {
      return res;
    }
  });

/**
 * @function shouldUploadToLocal
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const shouldUploadToLocal = args => () =>
  API.shouldUploadToLocal(args)
    .then(res => {
      if (res.local === undefined) {
        throw new Error();
      } else {
        return res;
      }
    })
    .catch(() => {
      toast.warning(args.t('createProject.errors.unexpected'));
    });

/**
 * @function updateProject
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const updateProject = props => () =>
  API.updateProject(props).then(res => {
    if (!res.id) {
      throw new Error(JSON.stringify(res));
    } else {
      return res;
      // toast.success(props.t('createProject.updateToastSuccess'));
    }
  });

/**
 * @function deleteProject
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const deleteProject = args => () =>
  API.deleteProject({ token: args.token, id: args.id }).then(res => {
    if (res.detail !== 'ok') {
      throw new Error(res.detail);
    } else {
      toast.success(args.t('projectDetails.deleteProjectToastSuccess'));
      return args.navigate('/profile');
    }
  });

/**
 * @function unpublishComment
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const unpublishComment = args => () =>
  API.unpublishComment({ token: args.token, id: args.id })
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

/**
 * @function deleteComment
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const deleteComment = args => () =>
  API.deleteComment({ token: args.token, id: args.id }).then(res => {
    if (res.detail !== 'ok') {
      throw new Error(res.detail);
    } else {
      toast.success(args.t('comments.deleteCommentToastSuccess'));
    }
  });

/**
 * @function getProject
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getProject = args => () =>
  API.getProject(args)
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

/**
 * @function getProjects
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getProjects = args => dispatch =>
  API.getProjects(args)
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

export const getMoreProjects = args => () =>
  API.getMoreProjects(args)
    .then(res => {
      if (Array.isArray(res)) {
        return {
          results: res,
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
        toast.warning(args.t('projectDetails.errors.unexpected'));
      } else {
        toast.warning(error.message);
      }
      return { loading: false };
    });

/**
 * @function getCategories
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getCategories = args => () =>
  API.getCategories()
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

/**
 * @function searchProjects
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const searchProjects = args => () =>
  API.searchProjects(args)
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

export const searchTags = args => () =>
  API.searchTags(args)
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
      console.error(error);
      if (error.message.startsWith('Unexpected')) {
        toast.warning(args.t('projects.errors.unexpected'));
      } else {
        toast.warning(error.message);
      }
      return { loading: false, tab: args.tab };
    });

/**
 * @function suggestTags
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const suggestTags = args => () =>
  API.suggestTags(args.value)
    .then(res => {
      if (Array.isArray(res)) {
        return res.length > 0 ? { tag_suggestion: res } : { tag_suggestion_open: false };
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

/**
 * @function getUserProjects
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getUserProjects = args => () =>
  API.getUserProjects(args)
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

/**
 * @function getUserProjects
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getUserDrafts = args =>
  API.getUserDrafts(args)
    .then(res => {
      if (Array.isArray(res.results)) {
        return {
          drafts: res.results,
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

/**
 * @function getSaved
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getSaved = args => () =>
  API.getSaved(args)
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

/**
 * @function toggleLike
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const toggleLike = args => () =>
  API.toggleLike(args)
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

/**
 * @function toggleSave
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const toggleSave = args => () =>
  API.toggleSave(args)
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

/**
 * @function addComment
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const addComment = args => () =>
  API.addComment(args)
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

/**
 * @function setStaffPicks
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const setStaffPicks = staff_picks => dispatch => {
  dispatch({
    type: 'SET_PROJECTS',
    payload: { staff_picks },
  });
};

/**
 * @function setHero
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const setHero = hero => dispatch => {
  dispatch({
    type: 'SET_PROJECTS',
    payload: { hero },
  });
};

/**
 * @function setZubhub
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const setZubhub = zubhub => dispatch => {
  dispatch({
    type: 'SET_PROJECTS',
    payload: { zubhub },
  });
};

/**
 * @function getHero
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getHero = args => dispatch =>
  API.getHero()
    .then(res => {
      if (res.id || res.title !== undefined) {
        const { header_logo_url, footer_logo_url, site_mode } = res;
        delete res.header_logo_url;
        delete res.footer_logo_url;
        delete res.site_mode;

        dispatch(setHero(res));
        dispatch(setZubhub({ header_logo_url, footer_logo_url, site_mode }));
        return { loading: false };
      } else {
        throw new Error();
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

/**
 * @function getStaffPicks
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getStaffPicks = args => dispatch =>
  API.getStaffPicks(args)
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

/**
 * @function getStaffPick
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getStaffPick = args => () =>
  API.getStaffPick(args)
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
