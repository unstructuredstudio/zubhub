/**
 * @function getQueryParams
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getQueryParams = url => {
  const params = url.split('?')[1];
  let [page, query] = params.split('q=');
  if (page) {
    page = page.split('=')[1];
    page = page.split('&')[0];
  } else {
    page = null;
  }
  return { page, query };
};

/**
 * @function fetchPage
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const fetchPage = (page, props, query_string, type) => {
  if (type === 'projects') {
    return props.searchProjects({ page, query_string, t: props.t, type });
  } else if (type === 'creators') {
    return props.searchCreators({ page, query_string, t: props.t, type });
  }
};

/**
 * @function updateProjects
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
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
        toast.warning(props.t('searchResults.errors.unexpected'));
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
export const toggleFollow = (e, props, state, id, toast) => {
  e.preventDefault();
  if (!props.auth.token) {
    props.history.push('/login');
  } else {
    return props
      .toggleFollow({ id, token: props.auth.token, t: props.t })
      .then(res => {
        if (res.profile && res.profile.username) {
          const results = state.results.map(creator =>
            creator.id !== res.profile.id ? creator : res.profile,
          );
          return { results };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(props.t('searchResults.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  }
};
