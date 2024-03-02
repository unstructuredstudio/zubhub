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
 * @function confirmEmail
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const confirmEmail = (e, props, state) => {
  e.preventDefault();
  return props
    .sendEmailConfirmation({
      key: state.key,
      t: props.t,
      navigate: props.navigate,
    })
    .catch(error => {
      if (error.message.startsWith('Unexpected')) {
        return { errors: props.t('emailConfirm.errors.unexpected') };
      } else {
        return { errors: error.message };
      }
    });
};
