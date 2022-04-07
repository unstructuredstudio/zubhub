/**
 * @function getQueryParams
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getQueryParams = (url, tab) => {
  let params = new URL(url);
  params = new URLSearchParams(params.search);
  if (tab) {
    params.set('tab', tab);
  }

  return params;
};

/**
 * @function switchTab
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const switchTab = (tab, props, url) => {
  props.history.push({
    pathname: props.location.pathname,
    search: getQueryParams(url, tab).toString(),
  });
};

/**
 * @function fetchPage
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const fetchPage = (page, props, query_string, tab) => {
  if (!tab || tab === 'projects' || tab !== 'creators') {
    return props.searchProjects({
      page,
      query_string,
      t: props.t,
      token: props.auth.token,
      tab: 'projects',
    });
  } else if (tab === 'creators') {
    return props.searchCreators({
      page,
      query_string,
      t: props.t,
      token: props.auth.token,
      tab,
    });
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
