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
