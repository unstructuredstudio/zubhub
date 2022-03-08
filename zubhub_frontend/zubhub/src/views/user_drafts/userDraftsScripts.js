/**
* @function fetchPage
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
// export const fetchPage = (page, props) => {
//     const username = props.match.params.username;
//     return props.getUserDrafts({ page, username, t: props.t });
//   };
  
  
  /**
  * @function updateDrafts
  * @author Raymond Ndibe <ndiberaymond1@gmail.com>
  * 
  * @todo - describe function's signature
  */
  export const updateDrafts = (res, { results: drafts }, props, toast) => {
    return res
      .then(res => {
        if (res.draft && res.draft.title) {
          drafts = drafts.map(draft =>
            draft.id === res.draft.id ? res.draft : draft,
          );
          return { results: drafts };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(props.t('savedDrafts.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
  