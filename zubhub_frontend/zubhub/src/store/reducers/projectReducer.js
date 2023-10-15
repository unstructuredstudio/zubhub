const default_state = {
  all_projects: {},
  staff_picks: [],
  hero: {},
  zubhub: {},
  categories: [],
  categorised_projects:{}
};

const projects = (state = default_state, action) => {
  switch (action.type) {
    case 'SET_PROJECTS':
      return {
        ...state,
        ...action.payload,
      };
    case 'GET_CATEGORIES':
      return {
        ...state,
        ...action.payload,
      };
    case 'CATEGORIZED_PROJECT':
      console.log("here")
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default projects;
