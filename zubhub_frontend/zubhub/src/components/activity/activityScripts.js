export const toggleSave = async (
  e,
  id,
  auth,
  history,
  setState,
  activityToggleSave,
  t,
) => {
  setState(state => {
    return {
      ...state,
      loading: true,
    };
  });
  e.preventDefault();
  if (!auth.token) {
    history.push('/login');
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

export const addView = async (
  e,
  id,
  auth,
  history,
  setState,
  activityCountView,
  t,
) => {
  e.preventDefault();
  if (!auth.token) {
    history.push('/login');
  } else {
    const result = await activityCountView({
      id,
      token: auth.token,
      t: t,
    });
    console.log('result after saving view', result)
  }
};

