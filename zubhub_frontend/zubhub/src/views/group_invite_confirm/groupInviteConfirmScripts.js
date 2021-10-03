export const getUsernameAndKey = queryString => {
  let username = queryString.split('&&');
  const key = username[1].split('=')[1];
  username = username[0].split('=')[1];
  return { username, key };
};

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
