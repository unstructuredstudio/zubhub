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

let formik_files = [];
//     //let media_upload_progress = newActivityObject['media_upload_progress'];
//     if (index !== null) {
//       Object.keys(formikProps.formikValues[field]).forEach((item, idx) => {
//         if (formikProps.errors[field] && formikProps.errors[field][idx]) {
//           formik_files.push(undefined);
//         } else {
//           formik_files.push(formikProps.formikValues[field][item][0]);
//           // media_upload_progress['total'] +=
//           //   formikProps.formikValues[field][item][0].size;
//         }
//       });
//     } else {
//       if (!formikProps.errors[field]) {
//         // Object.keys(formikProps.formikValues[field]).forEach(
//         //   key =>
//         //     (media_upload_progress['total'] +=
//         //       formikProps.formikValues[field][key].size),
//         // );
//         formik_files = formikProps.formikValues[field];
//       }
//     }
//     setNewActivityObject(state => {
//       const media_upload = {
//         files_to_upload: [],
//         files_to_upload_urls: [],
//         upload_progress: { loaded_percent: 0 },
//       };
//       media_upload['files_to_upload'] = formik_files;
//       return {
//         ...state,
//         [field]: { media_upload: media_upload },
//         // media_upload_progress: media_upload_progress,
//       };
//     });

export const handleImageFieldChange = (
  name,
  fileInputRef,
  formikProps,
  newActivityObject,
  setFilesUploaded,
  setNewActivityObject,
) => {
  //using name since formik takes care of multiple fields with indexed names and combine data for the same field
  formikProps.setFieldTouched(name, true);
  const { field, index } = getFieldAndIndex(name);
  let selected_files = fileInputRef.current.files;
  // initialize media upload objects 
  let media_upload_progress = newActivityObject['media_upload_progress']
    ? newActivityObject['media_upload_progress']
    : {
        loading: false,
        loaded: 0,
        total: 0,
        readyToUpload: false,
      };
  let media_upload = newActivityObject[field]
    ? newActivityObject[field]
    : {
        files_to_upload: [],
        files_to_upload_urls: [],
        upload_progress: { loaded_percent: 0 },
      };
  formikProps.setFieldValue(name, selected_files).then(errors => {
    if (index === null) {
      if (!errors[field]) {
        selected_files.forEach(file => {
          media_upload_progress['total'] += file.size
          media_upload.files_to_upload.push(file)
        })
        
      }
    }
  });
};

//  if(index!==null){
//       if (errors[field] && errors[field][index]) {
//         setNewActivityObject(oldState => {
//           const media_upload = {};
//           if (oldState[field]) {
//             return {
//               ...oldState,
//               field: {
//                 media_upload: {
//                   files_to_upload: [
//                     ...oldState.media_upload.files_to_upload,
//                     undefined,
//                   ],
//                 },
//               },
//             };
//           } else {
//             return {
//               ...oldState,
//               field: { media_upload: { files_to_upload: [undefined] } },
//             };
//           }
//         });
//       }
//     }else{
//     if (errors[field])
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
