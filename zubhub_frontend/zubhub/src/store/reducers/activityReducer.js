import * as at from '../actionTypes'
const default_state = {
    all_activities: [{id:0, name:"test"}],
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
  