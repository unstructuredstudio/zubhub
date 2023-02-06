/**
 * @function fetchPage
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const fetchPage = (page, props) => {
  return props.getAmbassadors({
    page,
    t: props.t,
    token: props.auth.token,
  });
};

/**
 * @function updateProjects
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const updateProjects = (res, { ambassadors }, props, toast) => {
  return res
    .then(res => {
      if (res.project && res.project.title) {
        const projects = {
          ...ambassadors.projects,
          results: ambassadors.projects.results.map(project =>
            project.id === res.project.id ? res.project : project,
          ),
        };

        return { ambassadors: { ...ambassadors, projects } };
      } else {
        res = Object.keys(res)
          .map(key => res[key])
          .join('\n');
        throw new Error(res);
      }
    })
    .catch(error => {
      if (error.message.startsWith('Unexpected')) {
        toast.warning(props.t('staffPickDetails.errors.unexpected'));
      } else {
        toast.warning(error.message);
      }
      return { loading: false };
    });
};
