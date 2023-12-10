export const toggleSave = async (e, id, auth, navigate, setState, activityToggleSave, t) => {
  setState(state => {
    return {
      ...state,
      loading: true,
    };
  });
  e.preventDefault();
  if (!auth.token) {
    navigate('/login');
  } else {
    const result = await activityToggleSave({
      id,
      token: auth.token,
      t: t,
    });
    setState(state => {
      return {
        ...state,
        ...result,
      };
    });
  }
};

export const addView = async (e, id, auth, navigate, setState, activityCountView, t) => {
  e.preventDefault();
  if (!auth.token) {
    navigate('/login');
  } else {
    const result = await activityCountView({
      id,
      token: auth.token,
      t: t,
    });
  }
};
