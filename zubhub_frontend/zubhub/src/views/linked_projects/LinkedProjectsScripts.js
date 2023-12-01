export const updateProjects = (res, projects, props, toast) => {
  console.log('res==', res);
  return res
    .then(res => {
      if (res.project && res.project.title) {
        const newProjects = projects.map(project => (project.id === res.project.id ? res.project : project));
        return { projects: newProjects ? newProjects : projects };
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
