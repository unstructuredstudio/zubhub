
export const fetchPage = (page, props) => {
  return props.getProjects({ page, t: props.t });
};

export const fetchStaffPicks = props => {
  return props.getStaffPicks({ t: props.t });
};

export const updateProjects = (res, props, toast) => {
  return res
    .then(res => {
      if (res.project && res.project.title) {
        const results = props.projects.all_projects.results.map(project =>
          project.id === res.project.id ? res.project : project,
        );
        props.setProjects({ ...props.projects, results });
        return { loading: false };
      } else {
        res = Object.keys(res)
          .map(key => res[key])
          .join('\n');
        throw new Error(res);
      }
    })
    .catch(error => {
      if (error.message.startsWith('Unexpected')) {
        toast.warning(props.t('projects.errors.unexpected'));
      } else {
        toast.warning(error.message);
      }
      return { loading: false };
    });
};

export const updateStaffPicks = (res, staff_pick_id, props, toast) => {
  return res
    .then(res => {
      if (res.project && res.project.title) {
        const staff_picks = props.projects.staff_picks.map(staff_pick =>
          staff_pick.id === staff_pick_id
            ? {
                ...staff_pick,
                projects: {
                  ...staff_pick.projects,
                  results: staff_pick.projects.results.map(project =>
                    project.id === res.project.id ? res.project : project)
                }
              }
            : staff_pick,
        );

        return props.setStaffPicks(staff_picks);
      } else {
        res = Object.keys(res)
          .map(key => res[key])
          .join('\n');
        throw new Error(res);
      }
    })
    .catch(error => {
      if (error.message.startsWith('Unexpected')) {
        toast.warning(props.t('projects.errors.unexpected'));
      } else {
        toast.warning(error.message);
      }
      return { loading: false };
    });
};
