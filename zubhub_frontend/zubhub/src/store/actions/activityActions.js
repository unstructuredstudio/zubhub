import { toast } from 'react-toastify';

import API from '../../api/api';
import * as at from '../actionTypes';

const ActivityAPI = new API();

export const setActivities = activities => dispatch => {
  dispatch({
    type: at.SET_ACTIVITIES,
    payload: { all_activities: activities },
  });
};

export const setActivity = activity => dispatch => {
  dispatch({
    type: at.SET_ACTIVITY,
    payload: { activity },
  });
};

export const getMyActivities = ({ t, token }) => {
  console.log('getMyActivities', token);
  return async dispatch =>
    ActivityAPI.getMyActivities(token)
      .then(res => {
        console.log('result', res);

        if (res.status >= 200 && res.status < 300) {
          const response = res.json();
          response.then(all => {
            console.log('all', all);
            dispatch({
              type: at.SET_ACTIVITIES,
              payload: {
                userActivities: all,
              },
            });
          });
        } else if (res.status === 403 && res.statusText === 'Forbidden') {
          toast.warning(t('activityDetails.activity.delete.dialog.forbidden'));
        } else {
          toast.warning(t('activities.errors.dialog.serverError'));
        }
      })
      .catch(() => {
        toast.warning(t('activities.errors.dialog.serverError'));
      });
};

export const getUnPublishedActivities = ({ t, token }) => {
  console.log('getUnPublishedActivities', token);
  return async dispatch =>
    ActivityAPI.getUnPublishedActivities(token)
      .then(res => {
        console.log('result', res);

        if (res.status >= 200 && res.status < 300) {
          const response = res.json();
          response.then(all => {
            console.log('all', all);
            dispatch({
              type: at.SET_ACTIVITIES,
              payload: {
                unPublishedActivities: all,
              },
            });
          });
        } else if (res.status === 403 && res.statusText === 'Forbidden') {
          toast.warning(t('activityDetails.activity.delete.dialog.forbidden'));
        } else {
          toast.warning(t('activities.errors.dialog.serverError'));
        }
      })
      .catch(() => {
        toast.warning(t('activities.errors.dialog.serverError'));
      });
};

export const getActivities = t => async dispatch =>
  ActivityAPI.getActivities()
    .then(res => {
      if (res.status >= 200 && res.status < 300) {
        const response = res.json();
        response.then(all => {
          dispatch({
            type: at.SET_ACTIVITIES,
            payload: {
              all_activities: all,
            },
          });
        });
      } else if (res.status === 403 && res.statusText === 'Forbidden') {
        toast.warning(t('activityDetails.activity.delete.dialog.forbidden'));
      } else {
        toast.warning(t('activities.errors.dialog.serverError'));
      }
    })
    .catch(() => {
      toast.warning(t('activities.errors.dialog.serverError'));
    });

export const activityCountView = args => async dispatch => {
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

export const activityToggleSave = args => async dispatch => {
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

export const activityTogglePublish = args => async dispatch => {
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
    return { error };
  }
};
