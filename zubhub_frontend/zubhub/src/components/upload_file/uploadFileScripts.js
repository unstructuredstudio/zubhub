import worker from 'workerize-loader!../../assets/js/removeMetaDataWorker'; // eslint-disable-line import/no-webpack-loader-syntax
import { Compress } from '../../assets/js/utils/scripts';
import { getFieldAndIndex } from '../../assets/js/utils/scripts';

export const handleFileButtonClick = (fileInput, label) => {
  fileInput.current.click();
};

export const removeMetaData = (images, state, handleSetState) => {
  const newWorker = worker();
  newWorker.removeMetaData(images);
  newWorker.addEventListener('message', e => {
    Compress(e.data, state, handleSetState);
  });
};

export const handleImageFieldChange = (
  name,
  fileInputRef,
  uploadFilestate,
  setUploadFilestate,
  setNewActivityObject,
  formikProps,
  formikValues,
  setFilesUploaded,
) => {
  //using name since formik takes care of multiple fields with indexed names and combine data for the same field
  formikProps.setFieldTouched(name, true);
  const { field, index } = getFieldAndIndex(name);
  formikProps.setFieldValue(name, fileInputRef.current.files).then(errors => {
    setFilesUploaded(true);
  });
  if (!fileInputRef.current.autofocus) {
    setFilesUploaded(false);
  }
};
// export const handleImageFieldChangeold = (
//   name,
//   fileInputRef,
//   UploadFilestate,
//   setUploadFilestate,
//   handleSetUploadFileState,
//   setNewActivityObject,
//   formikProps,
//   props,
// ) => {
//   formikProps.setFieldTouched(name, true);
//   const { field, index } = getFieldAndIndex(label);
//   props.setFieldValue(label, refs.fileInput.current.files).then(errors => {
//     if (index !== null) {
//       if (errors[field]) {
//         if (!errors[field][index]) {
//           removeMetaData(
//             refs.fileInput.current.files,
//             props.UploadFilestate,
//             props.handleSetUploadFileState,
//           );
//           if (props.wraperState[field]) {
//             let { media_upload } = props.wraperState[field];
//             media_upload['images_to_upload'] =
//               media_upload.images_to_upload.concat(
//                 props.UploadFilestate.media_upload.images_to_upload,
//               );
//             props.setWraperState({ [field]: media_upload });
//           } else {
//             let { media_upload } = props.wraperState['media_upload'];
//             media_upload['images_to_upload'] = props.UploadFilestate;
//             props.setWraperState({ [field]: media_upload });
//           }
//         } else {
//           let { media_upload } = props.wraperState['media_upload'];
//           media_upload['images_to_upload'] =
//             props.media_upload.images_to_upload.push('');
//           props.setWraperState({ [field]: media_upload });
//         }
//       } else {
//         console.log('no errors');
//         removeMetaData(
//           refs.fileInput.current.files,
//           props.UploadFilestate,
//           props.handleSetUploadFileState,
//         );
//         // props.setState1(oldUploadState => {
//         console.log('setState');
//         props.setWraperState(oldWrapperState => {
//           if (oldWrapperState[field]) {
//             const newWrapperState = { ...oldWrapperState };
//             const media_upload = newWrapperState[field];
//             media_upload.media_upload['images_to_upload'] =
//               media_upload.media_upload['images_to_upload'].concat(
//                 props.UploadFilestate.media_upload.images_to_upload,
//               );
//             console.log('Wrapper', newWrapperState, props.UploadFilestate);
//             return newWrapperState;
//           } else {
//             console.log('Wrapper', props.UploadFilestate);
//             return { ...props.UploadFilestate };
//           }
//         });
//         //   return oldUploadState;
//         // });
//         // if (props.wraperState[field]) {
//         //   props.setState1(oldUploadState => {
//         //     props.setWraperState(oldState => {
//         //       const media_upload = { ...oldState[field] };
//         //       media_upload.media_upload['images_to_upload'] =
//         //         media_upload.media_upload['images_to_upload'].concat(
//         //           oldUploadState.media_upload.images_to_upload,
//         //         );
//         //       console.log(
//         //         'old Uplpoadstate and oldstate',
//         //         oldUploadState,
//         //         oldState,
//         //       );
//         //       return {
//         //         ...oldState,
//         //         [field]: media_upload,
//         //       };
//         //     });
//         //     return oldUploadState;
//         //   });
//         //   console.log(
//         //     'wraper',
//         //     props.UploadFilestate.media_upload.images_to_upload,
//         //   );
//         //   // const media_upload = { ...props.wraperState[field] };
//         //   // media_upload.media_upload['images_to_upload'] =
//         //   //   media_upload.media_upload['images_to_upload'].concat(
//         //   //     props.UploadFilestate.media_upload.images_to_upload,
//         //   //   );

//         //   // props.setWraperState({
//         //   //   [field]: media_upload,
//         //   // });
//         // } else {
//         //   const testVariable = { ...props.UploadFilestate };
//         //   props.setState1(oldState => {
//         //     console.log('oldState', oldState);
//         //     return oldState;
//         //   });
//         //   console.log(
//         //     'save exemple first image',
//         //     props.UploadFilestate.media_upload.images_to_upload.map(v => v),
//         //     testVariable,
//         //     testVariable.media_upload.images_to_upload,
//         //   );
//         //   props.setWraperState({ [field]: props.UploadFilestate });
//         // }
//       }
//     } else {
//       if (!errors[label]) {
//         removeMetaData(
//           refs.fileInput.current.files,
//           props.UploadFilestate,
//           props.handleSetUploadFileState,
//         );
//         props.setWraperState({ [label]: props.UploadFilestate });
//       }
//     }
//   });
//   // props.setStatus({ ...props.status, [label]: '' });
// };
