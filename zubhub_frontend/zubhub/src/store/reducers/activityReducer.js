import * as at from '../actionTypes';
const default_state = {
  all_activities: [],
  selectedActivity: {},
};
const activities = (state = default_state, action) => {
  switch (action.type) {
    // case at.SET_SELECTED_ACTIVITY:
    //   return {
    //     ...state,
    //     all_activities: state.all_activities.map(activity => {
    //       if (activity.id === action.payload.activity.id) {
    //         return action.payload.activity;
    //       } else {
    //         return activity;
    //       }
    //     }),
    //   };
    case at.SET_ACTIVITIES:
      return {
        ...state,
        ...action.payload,
      };
    case at.SET_ACTIVITY:
      return {
        ...state,
        selectedActivity: action.payload.activity,
        all_activities: state.all_activities.map(activity => {
          if (activity.id === action.payload.activity.id) {
            return action.payload.activity;
          } else {
            return activity;
          }
        }),
      };
    default:
      return state;
  }
};

export default activities;
