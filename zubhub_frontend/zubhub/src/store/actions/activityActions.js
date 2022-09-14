import { toast } from 'react-toastify';
import API from '../../api/api';
import * as at from '../actionTypes';
let ActivityAPI = new API();

export const setActivities = activities => {
  return dispatch => {
    dispatch({
      type: at.SET_ACTIVITIES,
      payload: { all_activities: activities },
    });
  };
};

export const setActivity = activity => {
  return dispatch => {
    dispatch({
      type: at.SET_ACTIVITY,
      payload: { activity: activity },
    });
  };
};

export const getActivities = () => {
  return async dispatch => {
    const res = await ActivityAPI.getActivities();
    console.log('from reducer actions', res);
    dispatch({
      type: at.SET_ACTIVITIES,
      payload: { all_activities: res },
    });
  };
};

export const activityCountView = args => {
  console.log('from activity count views actions', args);
  return async dispatch => {
    try {
      const result = await ActivityAPI.activityToggleSave(args);
      dispatch({
        type: at.SET_ACTIVITY,
        payload: { activity: result },
      });
      return { loading: false };
    } catch (error) {
      if (error.message.startsWith('Unexpected')) {
        toast.warning(args.t('projects.errors.unexpected'));
      } else {
        toast.warning(error.message);
      }
      return { loading: false };
    }
  };
};

export const activityToggleSave = args => {
  console.log('from activity save actions', args);
  return async dispatch => {
    try {
      const result = await ActivityAPI.activityToggleSave(args);
      dispatch({
        type: at.SET_ACTIVITY,
        payload: { activity: result },
      });
      return { loading: false };
    } catch (error) {
      if (error.message.startsWith('Unexpected')) {
        toast.warning(args.t('projects.errors.unexpected'));
      } else {
        toast.warning(error.message);
      }
      return { loading: false };
    }
  };

  // return () => {
  //   return  API.activityToggleSave(args)
  //     .then(res => {
  //       if (res.title) {
  //         setActivity(res);
  //         return { loading: false };
  //       }
  //       // else {
  //       //   res = Object.keys(res)
  //       //     .map(key => res[key])
  //       //     .join('\n');
  //       //   throw new Error(res);
  //       // }
  //     })
  //     .catch(error => {
  //       if (error.message.startsWith('Unexpected')) {
  //         toast.warning(args.t('projects.errors.unexpected'));
  //       } else {
  //         toast.warning(error.message);
  //       }
  //       return { loading: false };
  //     });
  // };
};
