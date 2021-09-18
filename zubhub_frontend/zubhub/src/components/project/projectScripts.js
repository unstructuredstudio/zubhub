export const toggleLike = (e, id, props) => {
  e.preventDefault();
  if (!props.auth.token) {
    props.history.push('/login');
  } else {
    const toggle_like_promise = props.toggleLike({
      id,
      token: props.auth.token,
    });
    props.updateProjects(toggle_like_promise);
  }
};

export const toggleSave = (e, id, props) => {
  e.preventDefault();
  if (!props.auth.token) {
    props.history.push('/login');
  } else {
    const toggle_save_promise = props.toggleSave({
      id,
      token: props.auth.token,
      t: props.t,
    });
    props.updateProjects(toggle_save_promise);
  }
};

export const isCloudinaryVideo = url =>
  url.search('cloudinary.com') > -1 ? true : false;
