import { getUserDrafts } from '../../store/actions/projectActions';

/**
 * @function fetchPage
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const fetchPage = (page, props) => {
  const username = props.match.params.username;
  return getUserDrafts({ page, username, t: props.t, token: props.auth.token });
};

/**
 * @function updateDrafts
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const updateDrafts = (res, { drafts: projects }, props, toast) => {
  return res
    .then(res => {
      if (res.project && res.project.title) {
        projects = projects.map(project =>
          project.id === res.project.id ? res.project : project,
        );
        return { drafts: projects };
      } else {
        res = Object.keys(res)
          .map(key => res[key])
          .join('\n');
        throw new Error(res);
      }
    })
    .catch(error => {
      if (error.message.startsWith('Unexpected')) {
        toast.warning(props.t('savedProjects.errors.unexpected'));
      } else {
        toast.warning(error.message);
      }
      return { loading: false };
    });
};
