const default_state = { all_projects: {}, staff_picks: [], hero: {} };

const projects = (state = default_state, action) => {
  switch (action.type) {
    case 'SET_PROJECTS':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default projects;
