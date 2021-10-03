export const getUserProfile = props => {
  let username = props.match.params.username;

  if (!username) {
    username = props.auth.username;
  } else if (props.auth.username === username) props.history.push('/profile');
  return props.getUserProfile({
    username,
    token: props.auth.token,
    t: props.t,
  });
};

export const copyProfileUrl = (profile, props, toast) => {
  const tempInput = document.createElement('textarea');
  tempInput.value = `${document.location.origin}/creators/${profile.username}`;
  tempInput.style.top = '0';
  tempInput.style.top = '0';
  tempInput.style.position = 'fixed';
  const rootElem = document.querySelector('#root');
  rootElem.appendChild(tempInput);
  tempInput.focus();
  tempInput.select();
  if (document.execCommand('copy')) {
    toast.success(props.t('profile.toastSuccess'));
    rootElem.removeChild(tempInput);
  }
};

export const updateProjects = (res, { results: projects }, props, toast) => {
  return res
    .then(res => {
      if (res.project && res.project.title) {
        projects = projects.map(project =>
          project.id === res.project.id ? res.project : project,
        );
        return { results: projects };
      } else {
        res = Object.keys(res)
          .map(key => res[key])
          .join('\n');
        throw new Error(res);
      }
    })
    .catch(error => {
      if (error.message.startsWith('Unexpected')) {
        toast.warning(props.t('profile.errors.unexpected'));
      } else {
        toast.warning(error.message);
      }
      return { loading: false };
    });
};

export const toggleFollow = (id, props) => {
  if (!props.auth.token) {
    props.history.push('/login');
  } else {
    return props.toggleFollow({ id, token: props.auth.token, t: props.t });
  }
};

export const handleMoreMenuOpen = e => {
  return { more_anchor_el: e.currentTarget };
};

export const handleMoreMenuClose = () => {
  return { more_anchor_el: null };
};

export const handleToggleDeleteAccountModal = state => {
  const open_delete_account_modal = !state.open_delete_account_modal;
  return { open_delete_account_modal, more_anchor_el: null };
};

export const deleteAccount = (username_el, props) => {
  if (username_el.current.firstChild.value !== props.auth.username) {
    return { dialogError: props.t('profile.delete.errors.incorrectUsernme') };
  } else {
    return props.deleteAccount({
      token: props.auth.token,
      history: props.history,
      logout: props.logout,
      t: props.t,
    });
  }
};
