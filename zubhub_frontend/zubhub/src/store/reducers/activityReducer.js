const default_state = {
    all_activities: {},
  };
  
  const activities = (state = default_state, action) => {
    switch (action.type) {
      case 'SET_ACTIVITIES':
        return {
          ...state,
          ...action.payload,
        };
      default:
        return state;
    }
  };

  export default activities;
  