const default_state = {
  token: null,
  username: null,
  id: null,
  avatar: null,
  members_count: null,
  tags: [],
};

const auth = (state = default_state, action) => {
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
