import { publish_type } from '../../assets/js/utils/constants';

/**
 * @function toggleLike
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
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

/**
 * @function toggleSave
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
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

/**
 * @function formatProjectDescription
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const formatProjectDescription = desc => {
  const descEl = document.createElement('div');
  descEl.innerHTML = desc;
  return descEl.textContent;
};

/**
 * @function getPublishTypeLabel
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getPublishTypeLabel = type => {
  let label = '';
  Object.keys(publish_type).forEach(key => {
    if (type === publish_type[key]) {
      label = key;
    }
  });
  return label;
};
