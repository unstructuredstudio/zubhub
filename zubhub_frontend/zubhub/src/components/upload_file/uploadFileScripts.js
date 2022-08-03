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
        if (!errors.field[index]) {
          removeMetaData(
            refs.fileInput.current.files,
            props.state,
            props.handleSetUploadFileState,
          );
          if (props.wraperState[field]) {
            let { media_upload } = props.wraperState[field];
            console.log('from !errors index media_upload', media_upload);
            media_upload['images_to_upload'] =
              media_upload.images_to_upload.concat(
                props.state.media_upload.images_to_upload,
              );
            props.setWraperState({ [field]: media_upload });
          } else {
            console.log(
              'save exemple first image when error',
              props.wraperState,
              props.state,
            );
            let { media_upload } = props.wraperState['media_upload'];
            media_upload['images_to_upload'] = props.state;
            props.setWraperState({ [field]: media_upload });
          }
        }
      } else {
        removeMetaData(
          refs.fileInput.current.files,
          props.state,
          props.handleSetUploadFileState,
        );
        if (props.wraperState[field]) {
          console.log(
            'wraper',
            props.wraperState,
            props.wraperState[field].media_upload.images_to_upload,
            props.state.media_upload,
            props.state.media_upload['images_to_upload']
          );
          const media_upload = { ...props.wraperState[field] };
          const stateMediaUpload = { ...props.state };
          console.log(
            'second value1',
            props.wraperState[field],
            props.state.media_upload.images_to_upload,
            props.wraperState.media_upload.images_to_upload,
          );
          console.log(
            'second value2',
            props.state.media_upload.images_to_upload,
            media_upload.media_upload.images_to_upload,
            props.state.media_upload['images_to_upload'],
            stateMediaUpload,
            stateMediaUpload.media_upload.images_to_upload,
          );
          // media_upload = {...media_upload, images_to_upload: media_upload.images_to_upload.concat(
          //     props.state.media_upload.media_upload.images_to_upload,
          //   )}
          //   ;
          // console.log(
          //   'no error second value',
          //   media_upload.images_to_upload,
          //   props.state,
          //   media_upload.images_to_upload.concat(
          //     props.state.media_upload.images_to_upload,
          //   ),
          // );
          props.setWraperState({
            [field]: {
              ['media_upload']: {
                ...media_upload,
                images_to_upload: media_upload['images_to_upload'].concat(
                  props.state.media_upload.images_to_upload,
                ),
              },
            },
          });
        } else {
          console.log(
            'save exemple first image',
            props.wraperState,
            props.state,
          );
          props.setWraperState({ [field]: props.state });
        }
      }
    } else {
      if (!errors[label]) {
        removeMetaData(
          refs.fileInput.current.files,
          props.state,
          props.handleSetUploadFileState,
        );
        props.setWraperState({ [label]: props.state });
      }
    }
  });
  props.setStatus({ ...props.status, [label]: '' });
};
