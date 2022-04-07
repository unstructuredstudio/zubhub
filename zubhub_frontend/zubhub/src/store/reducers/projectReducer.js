const default_state = {
  all_projects: {},
  staff_picks: [],
  hero: {},
  zubhub: {},
  // draft_project_id: {},
};

const projects = (state = default_state, action) => {
  switch (action.type) {
    case 'SET_PROJECTS':
      return {
        ...state,
        ...action.payload,
      };
      // case 'SET_DRAFT_ID':
      //   return {
      //     ...draft_project_id,
      //   }
    default:
      return state;
  }
};

export default projects;
