import worker from 'workerize-loader!../../assets/js/removeMetaDataWorker'; // eslint-disable-line import/no-webpack-loader-syntax
import { Compress } from '../../assets/js/utils/scripts';
import { getFieldAndIndex } from '../../assets/js/utils/scripts';

export const handleFileButtonClick = (refs, label) => {
  refs.fileInput.current.click();
};

export const removeMetaData = (images, state, handleSetState) => {
  const newWorker = worker();
  newWorker.removeMetaData(images);
  newWorker.addEventListener('message', e => {
    Compress(e.data, state, handleSetState);
  });
};

export const handleImageFieldChange = (label, refs, props) => {
  props.setFieldTouched(label, true);
  const { field, index } = getFieldAndIndex(label);
  props.setFieldValue(label, refs.fileInput.current.files).then(errors => {
    if (index !== null) {
      if (errors[field]) {
        if (!errors[field][index]) {
          removeMetaData(
            refs.fileInput.current.files,
            props.UploadFilestate,
            props.handleSetUploadFileState,
          );
          if (props.wraperState[field]) {
            let { media_upload } = props.wraperState[field];
            media_upload['images_to_upload'] =
              media_upload.images_to_upload.concat(
                props.UploadFilestate.media_upload.images_to_upload,
              );
            props.setWraperState({ [field]: media_upload });
          } else {
            let { media_upload } = props.wraperState['media_upload'];
            media_upload['images_to_upload'] = props.UploadFilestate;
            props.setWraperState({ [field]: media_upload });
          }
        } else {
          let { media_upload } = props.wraperState['media_upload'];
          media_upload['images_to_upload'] =
            props.media_upload.images_to_upload.push('');
          props.setWraperState({ [field]: media_upload });
        }
      } else {
        removeMetaData(
          refs.fileInput.current.files,
          props.UploadFilestate,
          props.handleSetUploadFileState,
        );
        if (props.wraperState[field]) {
          console.log(
            'wraper',
            props.wraperState,
            props.wraperState[field].media_upload.images_to_upload,
            props.UploadFilestate.media_upload,
            ...props.UploadFilestate.media_upload.images_to_upload,
          );
          const media_upload = { ...props.wraperState[field] };
          media_upload.media_upload['images_to_upload'] =
            media_upload.media_upload['images_to_upload'].concat(
              props.UploadFilestate.media_upload.images_to_upload,
            );

          props.setWraperState({
            [field]: media_upload,
          });
        } else {
          const testVariable = { ...props.UploadFilestate };
          console.log(
            'save exemple first image',
            props.UploadFilestate.media_upload.images_to_upload.map(v => v),
            testVariable,
            testVariable.media_upload.images_to_upload,
          );
          props.setWraperState({ [field]: props.UploadFilestate });
        }
      }
    } else {
      if (!errors[label]) {
        removeMetaData(
          refs.fileInput.current.files,
          props.UploadFilestate,
          props.handleSetUploadFileState,
        );
        props.setWraperState({ [label]: props.UploadFilestate });
      }
    }
  });
  // props.setStatus({ ...props.status, [label]: '' });
};
