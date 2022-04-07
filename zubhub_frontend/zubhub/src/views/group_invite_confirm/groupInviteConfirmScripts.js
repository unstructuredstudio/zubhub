/**
 * @function getUsernameAndKey
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getUsernameAndKey = queryString => {
  let username = queryString.split('&&');
  const key = username[1].split('=')[1];
  username = username[0].split('=')[1];
  return { username, key };
};

/**
 * @function confirmGroupInvite
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const confirmGroupInvite = (e, props, state) => {
  e.preventDefault();
  return props
    .sendGroupInviteConfirmation({
      key: state.key,
      t: props.t,
      history: props.history,
    })
    .catch(error => {
      if (error.message.startsWith('Unexpected')) {
        return { errors: props.t('groupInviteConfirm.errors.unexpected') };
      } else {
        return { errors: error.message };
      }
    });
};
