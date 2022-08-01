import worker from 'workerize-loader!../../assets/js/removeMetaDataWorker'; // eslint-disable-line import/no-webpack-loader-syntax
import {
  Compress,
} from '../../assets/js/utils/scripts';

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
  props.setFieldTouched(label,true)
  
  props.setFieldValue(label, refs.fileInput.current.files).then(errors => {
    if (!errors[label]) {
      removeMetaData(
        refs.fileInput.current.files,
        props.state,
        props.handleSetState,
      );
      props.setWraperState({ [label]: props.state });
    }
  });
  props.setStatus({ ...props.status, [label]: '' });
};

