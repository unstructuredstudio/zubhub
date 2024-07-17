export const toggleSave = async (e, id, auth, navigate, activityToggleSave, t) => {
  e.preventDefault();
  if (!auth.token) {
    navigate('/login');
  } else {
    await activityToggleSave({
      id,
      token: auth.token,
      t,
    });
  }
};

export const addView = async (e, id, auth, navigate, setState, activityCountView, t) => {
  e.preventDefault();
  if (!auth.token) {
    navigate('/login');
  } else {
    await activityCountView({
      id,
      token: auth.token,
      t,
    });
  }
};
