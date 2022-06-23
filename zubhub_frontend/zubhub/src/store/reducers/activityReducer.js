import * as at from '../actionTypes'
const default_state = {
    all_activities: {},
  };
  
  const activities = (state = default_state, action) => {
    switch (action.type) {
      case at.SET_ACTIVITIES:
        return {
          ...state,
          ...action.payload,
        };
      default:
        return state;
    }
  };
  
  export default activities;
  