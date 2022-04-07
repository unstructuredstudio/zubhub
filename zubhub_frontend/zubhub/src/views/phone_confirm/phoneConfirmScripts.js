/**
 * @function getUsernameAndKey
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getUsernameAndKey = query_string => {
  let username = query_string.split('&&');
  const key = username[1].split('=')[1];
  username = username[0].split('=')[1];
  return { username, key };
};

/**
 * @function confirmPhone
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const confirmPhone = (e, props, state) => {
  e.preventDefault();
  return props
    .sendPhoneConfirmation({
      key: state.key,
      t: props.t,
      history: props.history,
    })
    .catch(error => {
      if (error.message.startsWith('Unexpected')) {
        return {
          errors: props.t('phoneConfirm.errors.unexpected'),
        };
      } else {
        return { errors: error.message };
      }
    });
};
