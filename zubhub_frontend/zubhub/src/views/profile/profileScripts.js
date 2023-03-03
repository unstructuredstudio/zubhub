import { BASE_TAGS } from '../../assets/js/utils/constants';
import { getUserDrafts } from '../../store/actions/projectActions';

/**
 * @function getUserProfile
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */ export const getUserProfile = props => {
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

/**
 * @function copyProfileUrl
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
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

/**
 * @function updateProjects
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const updateProjects = (res, projects, props, toast) => {
  return res
    .then(res => {
      if (res.project && res.project.title) {
        projects = projects.results.map(project =>
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

/**
 * @function updateProjects
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const updateDrafts = (res, projects, props, toast) => {
  return res
    .then(res => {
      if (res.project && res.project.title) {
        projects = projects.map(project =>
          project.id === res.project.id ? res.project : project,
        );
        return { drafts: projects };
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

/**
 * @function toggleFollow
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const toggleFollow = (id, props) => {
  if (!props.auth.token) {
    props.history.push('/login');
  } else {
    return props.toggleFollow({ id, token: props.auth.token, t: props.t });
  }
};

/**
 * @function sortTags
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @description a custom sort function that sorts tags
 * according to some predefined rules.
 * rule1: if both tags being compared are base tags, use standard reverse sort.
 * rule2: if tag a is base tag, sort tag a before tag b.
 * rule3: if tag b is base tag, sort tag b before tag a.
 * rule4: if both tag a and b are not base tags, use standard sort.
 * @param {Array} tags - an array containing tag strings
 * @returns {Array} - sorted array of tags.
 */
export const sortTags = tags => {
  return tags.sort((a, b) => {
    if (BASE_TAGS.includes(a) && BASE_TAGS.includes(b)) {
      //standard reverse sort.
      if (a > b) {
        return -1;
      } else {
        return 1;
      }
    } else if (BASE_TAGS.includes(a)) {
      return -1;
    } else if (BASE_TAGS.includes(b)) {
      return 1;
    } else {
      //standard sort.
      if (a > b) {
        return 1;
      } else {
        return -1;
      }
    }
  });
};

/**
 * @function handleMoreMenuOpen
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleMoreMenuOpen = e => {
  return { more_anchor_el: e.currentTarget };
};

/**
 * @function handleMoreMenuClose
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleMoreMenuClose = () => {
  return { more_anchor_el: null };
};

/**
 * @function handleToggleDeleteAccountModal
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleToggleDeleteAccountModal = state => {
  const open_delete_account_modal = !state.open_delete_account_modal;
  return { open_delete_account_modal, more_anchor_el: null };
};

/**
 * @function deleteAccount
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
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
