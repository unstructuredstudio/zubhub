import { toast } from 'react-toastify';

import ZubhubAPI from '../../api';

const API = new ZubhubAPI();

export const deleteActivity = args => {
  return API.deleteActivity({ token: args.token, id: args.id }).then(res => {
    if (res.status === 204) {
      toast.success(args.t('activityDetails.activity.delete.dialog.success'));
      return args.history.push('/activities');
    } else {
      if (res.status === 403 && res.statusText === 'Forbidden') {
        toast.warning(
          args.t('activityDetails.activity.delete.dialog.forbidden'),
        );
      } else {
        toast.warning(args.t('activities.errors.dialog.serverError'));
      }
    }
  });
};

export const togglePublish = async (
  e,
  id,
  auth,
  history,
  activityTogglePublish,
  t,
) => {
  console.log('togglePublish');
  e.preventDefault();
  if (!auth.token) {
    history.push('/login');
  } else {
    const result = await activityTogglePublish({
      id,
      token: auth.token,
      t: t,
    });
    console.log('result', result);
  }
};
