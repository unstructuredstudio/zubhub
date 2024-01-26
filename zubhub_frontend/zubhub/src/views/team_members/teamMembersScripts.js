/**
 * @function fetchPage
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const fetchPage = (groupname, props) => {
  let token=props.auth.token;
  return props.getTeamMembers({ groupname, token });
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
          const followers = state.followers.map(follower =>
            follower.id !== res.profile.id ? follower : res.profile,
          );
          return { followers };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(props.t('userFollowers.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  }
};
