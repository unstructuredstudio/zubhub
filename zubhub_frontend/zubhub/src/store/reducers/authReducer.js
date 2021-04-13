const defaultState = {
  token: null,
  username: null,
  id: null,
  avatar: null,
  members_count: null,
  role: null,
};

const auth = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_AUTH_USER':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default auth;
