/**
 * @function fetchPage
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const fetchPage = (page, props) => {
  const username = props.params.username;
  return props.getFollowing({ page, username, t: props.t });
};

/**
 * @function toggleFollow
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const toggleFollow = (e, props, state, id, toast) => {
  e.preventDefault();
  if (!props.auth.token) {
    props.navigate('/login');
  } else {
    return props
      .toggleFollow({ id, token: props.auth.token, t: props.t })
      .then(res => {
        if (res.profile && res.profile.username) {
          const { following } = state;
          following.forEach((creator, index) => {
            if (creator.id === res.profile.id) {
              following.splice(index, 1, res.profile);
            }
          });
          return { following };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(props.t('userFollowing.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  }
};
