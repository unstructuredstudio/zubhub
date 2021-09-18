export const fetchPage = (page, props) => {
  return props.getStaffPick({ page, id: props.match.params.id, t: props.t });
};

export const updateProjects = (res, { staff_pick }, props, toast) => {
  return res
    .then(res => {
      if (res.project && res.project.title) {
        const projects = staff_pick.projects.map(project =>
          project.id === res.project.id ? res.project : project,
        );
        return { staff_pick: { ...staff_pick, projects } };
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
