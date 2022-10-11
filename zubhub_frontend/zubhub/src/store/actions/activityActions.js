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

export const getActivities = t => {
  return async dispatch => {
    try {
      const res = await ActivityAPI.getActivities();
      const all_activities = res;
      const published = [];
      const unPublishedActivities = res.filter(item => {
        if (!item.publish) {
          return true;
        } else {
          published.push(item);
          return false;
        }
      });
      dispatch({
        type: at.SET_ACTIVITIES,
        payload: {
          all_activities: all_activities,
          published: published,
          unPublishedActivities: unPublishedActivities,
        },
      });
    } catch (error) {
      if (error.message.startsWith('Unexpected')) {
        toast.warning(t('projects.errors.unexpected'));
      } else {
        toast.warning(error.message);
      }
    }
  };
};

export const activityCountView = args => {
 
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
  console.log('toggle save', args)
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

export const activityTogglePublish = args => {
  return async dispatch => {
    try {
      const result = await ActivityAPI.activityTogglePublish(args);
     
      dispatch({
        type: at.SET_ACTIVITY,
        payload: { activity: result },
      });
      return result;
    } catch (error) {
      if (error.message.startsWith('Unexpected')) {
        toast.warning(args.t('projects.errors.unexpected'));
      } else {
        toast.warning(error.message);
      }
      return { error: error };
    }
  };
};
