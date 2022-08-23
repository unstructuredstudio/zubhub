import { toast } from 'react-toastify';
import ZubhubAPI from '../../api';
const API = new ZubhubAPI();

export const deleteActivity = args => {
  return () => {
    return API.deleteActivity({ token: args.token, id: args.id }).then(res => {
      if (res.detail !== 'ok') {
        throw new Error(res.detail);
      } else {
        toast.success('projectDetails.deleteProjectToastSuccess');
        return args.history.push('/activities/all/');
      }
    });
  };
};
