export const SearchType = {
  CREATORS: 'creators',
  PROJECTS: 'projects',
  TAGS: 'tags',
};

export const ProjectSearchCriteria = {
  CATEGORY: 0,
  TAG: 1,
  TITLE_DESCRIPTION: 2,
};

/**
 * @function getQueryParams
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getQueryParams = url => {
  let params = new URL(url);
  params = new URLSearchParams(params.search);

  return params;
};

/**
 * @function fetchPage
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const fetchPage = (page, props, query_string, type) => {
  if (type === SearchType.PROJECTS) {
    return props.searchProjects({
      page,
      query_string,
      t: props.t,
      token: props.auth.token,
      tab: 'projects',
    });
  } else if (type === SearchType.CREATORS) {
    return props.searchCreators({
      page,
      query_string,
      t: props.t,
      token: props.auth.token,
      tab: 'creators',
    });
  } else {
    return props.searchProjects({
      page,
      query_string,
      t: props.t,
      token: props.auth.token,
      criteria: ProjectSearchCriteria.TAG,
      tab: 'tags',
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
        projects = projects.map(project => (project.id === res.project.id ? res.project : project));
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
    props.navigate('/login');
  } else {
    return props
      .toggleFollow({ id, token: props.auth.token, t: props.t })
      .then(res => {
        if (res.profile && res.profile.username) {
          const results = state.results.map(creator => (creator.id !== res.profile.id ? creator : res.profile));
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
