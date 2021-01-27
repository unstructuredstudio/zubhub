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
        toast.success('Your project was created successfully!!');
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
        toast.success('Your project was updated successfully!!');
        return props.history.push('/profile');
      }
    });
  };
};

export const delete_project = props => {
  return () => {
    const { auth, id } = props;
    return API.delete_project({ token: auth.token, id }).then(res => {
      if (res.detail !== 'ok') {
        throw new Error(res.detail);
      } else {
        toast.success('Your project was deleted successfully!!');
        return props.history.push('/profile');
      }
    });
  };
};

export const get_project = value => {
  return () => {
    return API.get_project(value)
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
        toast.warning(error.message);
        return { loading: false };
      });
  };
};

export const get_projects = page => {
  return dispatch => {
    return API.get_projects(page)
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
        toast.warning(error.message);
        return { loading: false };
      });
  };
};

export const get_user_projects = props => {
  return () => {
    return API.get_user_projects(props)
      .then(res => {
        if (Array.isArray(res.results)) {
          return { ...res, loading: false };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        toast.warning(error.message);
        return { loading: false };
      });
  };
};

export const get_saved = value => {
  return () => {
    return API.get_saved(value)
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
          toast.warning(
            'An error occured while performing this action. Please try again later',
          );
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

export const toggle_like = props => {
  return () => {
    return API.toggle_like(props)
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
          toast.warning(
            'An error occured while performing this action. Please try again later',
          );
        } else {
          toast.warning(error.message);
        }

        return { loading: false };
      });
  };
};

export const toggle_save = props => {
  return () => {
    return API.toggle_save(props)
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
          toast.warning(
            'An error occured while performing this action. Please try again later',
          );
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

export const add_comment = props => {
  return () => {
    return API.add_comment(props)
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
          toast.warning(
            'An error occured while performing this action. Please try again later',
          );
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};
