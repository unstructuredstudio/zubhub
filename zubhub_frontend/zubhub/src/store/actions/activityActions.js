export const setActivities = activities => {
    return dispatch => {
      dispatch({
        type: 'SET_ACTIVITIES',
        payload: { all_activities: activities },
      });
    };
  };