export const handleOpenEnlargedImageDialog = (e, state) => {
  const image_url = e.currentTarget.getAttribute('src');
  const open_enlarged_image_dialog = !state.open_enlarged_image_dialog;
  return { enlarged_image_url: image_url, open_enlarged_image_dialog };
};

export const handleToggleDeleteProjectModal = state => {
  const open_delete_project_modal = !state.open_delete_project_modal;
  return { open_delete_project_modal };
};

export const isVideoFromGdrive = link =>
  link.search('https://drive.google.com') !== -1 ? true : false;

export const deleteProject = (props, state) => {
  if (props.auth.token && props.auth.id === state.project.creator.id) {
    return props
      .deleteProject({
        token: props.auth.token,
        id: state.project.id,
        t: props.t,
        history: props.history,
      })
      .catch(error => ({ delete_project_dialog_error: error.message }));
  } else {
    return handleToggleDeleteProjectModal(state);
  }
};

export const toggleSave = (e, props, id) => {
  e.preventDefault();
  if (!props.auth.token) {
    props.history.push('/login');
  } else {
    return props.toggleSave({
      id,
      token: props.auth.token,
      t: props.t,
    });
  }
};

export const toggleLike = (e, props, id) => {
  e.preventDefault();
  if (!props.auth.token) {
    return props.history.push('/login');
  } else {
    return props.toggleLike({ id, token: props.auth.token, t: props.t });
  }
};

export const toggleFollow = (e, props, id, state) => {
  e.preventDefault();
  if (!props.auth.token) {
    props.history.push('/login');
  } else {
    return props
      .toggleFollow({ id, token: props.auth.token, t: props.t })
      .then(({ profile }) => {
        const { project } = state;
        if (project.creator.id === profile.id) {
          project.creator = profile;
        }

        return { project };
      });
  }
};

export const isCloudinaryVideo = url =>
  url.search('cloudinary.com') > -1 ? true : false;


export const isGdriveORVimeoORYoutube = url => {
    if(url.search("youtube.com/embed/") > -1 && 
       url.search("player.vimeo.com/video/") > -1 && 
       url.search("drive.google.com") > -1){
      return true;
    } else {
      return false;
    }
};
