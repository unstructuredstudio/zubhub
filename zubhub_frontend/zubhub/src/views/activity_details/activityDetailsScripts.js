import { toast } from 'react-toastify';
import ZubhubAPI from '../../api';
import {
  getBase64ImageFromURL,
} from '../../assets/js/utils/scripts';

const API = new ZubhubAPI();

export const deleteActivity = args => {
  console.log('delete clicked scripts');
  return API.deleteActivity({ token: args.token, id: args.id }).then(res => {
    if (res.detail !== 'ok') {
      throw new Error(res.detail);
    } else {
      toast.success('projectDetails.deleteProjectToastSuccess');
      return args.history.push('/activities/all/');
    }
  });
};

export const getBase64Images = (activity) =>{
  const promises = [];
    promises.push(
      getBase64ImageFromURL(activity.images[0].image.file_url, 'activityImage'),
    );
    activity['materials_used_image'] &&
      promises.push(
        getBase64ImageFromURL(
          activity['materials_used_image'].file_url,
          'materials_used_image',
        ),
      );
    activity['inspiring_artist'] &&
      activity['inspiring_artist']['image'] &&
      promises.push(
        getBase64ImageFromURL(
          activity['inspiring_artist']['image'].file_url,
          'inspiring_artist',
        ),
      );
    ['inspiring_examples', 'making_steps'].map(item => {
      if (activity[item]) {
        activity[item].map((step, index) => {
          if (step['image']) {
            promises.push(
              getBase64ImageFromURL(step.image.file_url, item, index),
            );
          }
        });
      }
    });
  return promises;  
}