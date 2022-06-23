import * as at from '../actionTypes'
export const setActivities = activities => {
    return dispatch => {
      dispatch({
        type: at.SET_ACTIVITIES,
        payload: { all_activities: activities },
      });
    };
  };