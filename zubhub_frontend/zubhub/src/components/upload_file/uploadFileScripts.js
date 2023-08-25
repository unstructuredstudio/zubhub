import worker from 'workerize-loader!../../assets/js/removeMetaDataWorker'; // eslint-disable-line import/no-webpack-loader-syntax
import { getFieldAndIndex } from '../../assets/js/utils/scripts';
import ZubhubAPI from '../../api';
import { toast } from 'react-toastify';
import { nanoid } from 'nanoid';
import axios from 'axios';
import Compressor from 'compressorjs';
import {
  s3 as DO,
  doConfig,
  Compress,
  slugify,
} from '../../assets/js/utils/scripts';

const API = new ZubhubAPI();

export const handleFileButtonClick = (fileInput, label) => {
  fileInput.current.click();
};

// export const removeMetaData = (images, state, handleSetState) => {
//   const newWorker = worker();
//   newWorker.removeMetaData(images);
//   newWorker.addEventListener('message', e => {
//     Compress(e.data);
//   });
// };

export const compress = image => {
  //if (file.type.split('/')[1] !== 'gif') {
  return new Promise((resolve, reject) => {
    new Compressor(image, {
      success: resolve,
      error: reject,
    });
  });
};

export const handleFileFieldChange = (
  name,
  route,
  field,
  inputIndex,
  fileInputRef,
  formikProps,
  validateSteps,
) => {
  formikProps.setFieldTouched(name, true, false);
  let selectedFiles = {};
  selectedFiles = fileInputRef.current.files;
  if (selectedFiles.length > 0) {
    formikProps.setFieldValue(name, selectedFiles).then(errors => {
      route
        ? inputIndex >= 0
          ? errors[route] &&
          errors[route][inputIndex] &&
          errors[route][inputIndex][field] &&
          formikProps.setFieldValue(name, undefined, false)
          : errors[route] &&
          errors[route][field] &&
          formikProps.setFieldValue(name, undefined, false)
        : inputIndex >= 0
          ? errors[field] &&
          errors[field][inputIndex] &&
          formikProps.setFieldValue(name, undefined, false)
          : errors[field] && formikProps.setFieldValue(name, undefined, false);
    });
  }
  //validateSteps();
};

export const getErrors = (route, field, index, errors, touched) => {
  return route
    ? index < 0
      ? errors[route] &&
      errors[route][field] &&
      touched[route] &&
      touched[route][field] &&
      errors[route][field]
      : errors[route] &&
      errors[route][index] &&
      errors[route][index][field] &&
      touched[route] &&
      touched[route][index] &&
      touched[route][index][field] &&
      errors[route][index][field]
    : index < 0
      ? errors[field] && touched[field] && errors[field]
      : errors[field] &&
      errors[field][index] &&
      touched[field] &&
      touched[field][index] &&
      errors[field][index];
};

export const imagesToPreview = files => {
  let imagesToPreview = {};
  if (files) {
    if (files['length']) {
      Object.entries(files).map(([index, value]) => {
        if (index !== 'length') {
          imagesToPreview[index] =
            value instanceof Blob
              ? { image: value, type: 'file' }
              : { image: value, type: 'url' };
        }
      });
    } else {
      imagesToPreview['0'] =
        files instanceof Blob
          ? { image: files, type: 'file' }
          : { image: files, type: 'url' };
    }
  }
  return imagesToPreview;
};

export const deleteImage = (setFieldValue, fieldName, validateSteps) => {
  setFieldValue(fieldName, undefined, true).then(errors => {
    validateSteps();
  });
};

export const deleteImageAtIndex = (
  formikProps,
  field,
  index,
  validateSteps,
) => {
  let files = {};
  if (formikProps.formikValues[field].length === 1) {
    formikProps.setFieldTouched(field, true, false);
    formikProps.setFieldValue(field, undefined, true).then(errors => {
      if (errors[field]) {
        validateSteps();
      }
    });
  } else {
    Object.entries(formikProps.formikValues[field]).forEach(([key, value]) => {
      if (key !== index) {
        files[key] = value;
      }
    });
    files['length'] = formikProps.formikValues[field].length - 1;
    formikProps.setFieldTouched(field, true, false);
    formikProps.setFieldValue(field, files, true).then(errors => {
      if (errors[field]) {
        validateSteps();
      }
    });
  }
};

///////////////////////////////////////////////////////////////////////
const getFilesFromNested = nestedObject => {
  let files = {};
  Object.entries(nestedObject).map(([index, value]) => {
    if (value['image']) {
      files[index] = value.image[0];
    }
  });
  return files;
};
export const FormMediaUpload = (
  state,
  auth,
  handleSetState,
  formikValues,
  getSignature,
  t,
) => {
  let promises = [];
  let fileFields = [
    {
      field: 'materials_used_image',
      type: 'simple',
      files:
        formikValues['materials_used_image'] &&
        formikValues['materials_used_image'],
    },
    {
      field: 'activity_images',
      type: 'array',
      files: formikValues['activity_images'] && formikValues['activity_images'],
    },
    {
      field: 'video',
      type: 'simple',
      files: formikValues['video'] && formikValues['video'],
    },
    {
      route: 'inspiring_artist',
      field: 'inspiring_artist.image',
      type: 'object',
      files:
        formikValues['inspiring_artist'] &&
        formikValues['inspiring_artist']['image'] &&
        formikValues['inspiring_artist']['image'],
    },
    {
      route: 'making_steps',
      field: 'image',
      type: 'objectsArray',
      files:
        formikValues['making_steps'] &&
        getFilesFromNested(formikValues['making_steps']),
    },
    {
      route: 'inspiring_examples',
      field: 'image',
      type: 'objectsArray',
      files:
        formikValues['inspiring_examples'] &&
        getFilesFromNested(formikValues['inspiring_examples']),
    },
  ];

  let countFiles = 0;
  fileFields.map(item => {
    if (item.files) {
      Object.entries(item.files).forEach(([index, file]) => {
        if (
          index !== 'length' &&
          (file instanceof Blob || file instanceof File)
        ) {
          countFiles += 1;
          promises.push(
            uploadFile(
              file,
              auth,
              handleSetState,
              item.route,
              item.field,
              item.type,
              index,
              getSignature,
              t,
            ),
          );
        }
      });
    }
  });
  handleSetState(state => {
    return { ...state, countFiles: countFiles };
  });
  return promises;
};

export const uploadFile = (
  file,
  auth,
  handleSetState,
  route,
  field,
  fieldType,
  index,
  getSignature,
  t,
) => {
  const args = {
    token: auth.token,
  };

  return API.shouldUploadToLocal(args).then(res => {
    if (res && res.local === true) {
      return uploadFileToLocal(
        file,
        auth.token,
        auth.username,
        handleSetState,
        route,
        field,
        fieldType,
        index,
      );
    } else if (res && res.local === false) {
      // if (file.type.split('/')[0] === 'image') {
      return uploadImageToDO(
        file,
        handleSetState,
        route,
        field,
        fieldType,
        index,
      );
      // } else {
      //   return uploadVideoToCloudinary(
      //     file,
      //     auth.token,
      //     auth.username,
      //     handleSetState,
      //     route,
      //     field,
      //     index,
      //     fieldType,
      //     getSignature,
      //     t,
      //   );
      // }
    }
  });
};

export const uploadFileToLocal = (
  fileBeforeCompression,
  token,
  username,
  handleSetState,
  route,
  field,
  fieldType,
  index,
) => {
  return new Promise(async (resolve, reject) => {
    let file = fileBeforeCompression;
    try {
      file = await compress(fileBeforeCompression);
    } catch (error) { }
    let fileFieldName = '';
    let NameArray = [route, field, index];
    NameArray.forEach(item => {
      if (item) {
        fileFieldName += item;
      }
    });

    let url =
      process.env.REACT_APP_NODE_ENV === 'production'
        ? process.env.REACT_APP_BACKEND_PRODUCTION_URL + '/api/'
        : process.env.REACT_APP_BACKEND_DEVELOPMENT_URL + '/api/';
    url = url + 'upload-file-to-local/';

    let key = nanoid();
    if (file.type.split('/')[0] === 'image') {
      key = `project_images/${key}`;
    } else {
      if (file.type.split('/')[0] === 'video') {
        key = key.slice(0, Math.floor(key.length / 3));
        key = `videos/${slugify(username)}-${slugify(file.name)}-${key}`;
      }
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', key);
    try {
      const result = await axios.post(url, formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
        onUploadProgress: e => {
          handleSetState(state => {
            let loadedPercent = state.loadedPercent;
            loadedPercent[fileFieldName] = Math.round(
              (e.loaded * 100) / e.total,
            );
            let loadProgress = Math.round(
              Object.values(loadedPercent).reduce((a, b) => a + b, 0) /
              state.countFiles,
            );

            return {
              ...state,
              loadedPercent: loadedPercent,
              loadProgress: loadProgress,
            };
          });
        },
      });
      if (result.data['Location']) {
        resolve({
          route: route,
          field: field,
          fieldType,
          index: index,
          url: {
            file_url: result.data.Location,
            public_id: result.data.Key,
          },
        });
      } else {
        resolve({
          route: route,
          field: field,
          fieldType,
          index: index,
          url: { file_url: result.data.secure_url },
        });
      }
    } catch (error) {
      reject({ message: 'uploadError', file: file.name, error: error });
    }
  });
};

export const uploadImageToDO = async (
  fileBeforeCompression,
  handleSetState,
  route,
  field,
  fieldType,
  index,
) => {
  let file = fileBeforeCompression;

  try {
    file = await compress(fileBeforeCompression);
  } catch (error) {
    console.log('compression error msg:', error.message);
  }
  let fileFieldName = '';
  let NameArray = [route, field, index];
  NameArray.forEach(item => {
    if (item) {
      fileFieldName += item;
    }
  });

  return new Promise((resolve, reject) => {
    const params = {
      Bucket: `${doConfig.bucketName}`,
      Key: `${doConfig.project_images}/${nanoid()}`,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read',
      // CORSConfiguration: {
      //   CORSRules: [
      //     {
      //       AllowedHeaders: ['Authorization'],
      //       AllowedMethods: ['GET', 'HEAD', 'POST', 'PUT', 'HEAD'],
      //       AllowedOrigins: ['http://www.example.com'],
      //       ExposeHeaders: ['Access-Control-Allow-Origin'],
      //     },
      //   ],
      // },
    };

    DO.upload(params, err => {

      reject({ message: 'uploadError', file: file.name, error: err });
      handleSetState(state => {
        return { ...state, submitting: false };
      });
    })
      .on('httpUploadProgress', e => {
        handleSetState(state => {
          let loadedPercent = state.loadedPercent;
          loadedPercent[fileFieldName] = Math.round((e.loaded * 100) / e.total);
          let loadProgress = Math.round(
            Object.values(loadedPercent).reduce((a, b) => a + b, 0) /
            state.countFiles,
          );

          return {
            ...state,
            loadedPercent: loadedPercent,
            loadProgress: loadProgress,
          };
        });
      })
      .send((err, data) => {
        if (err) {
          handleSetState(state => {
            return { ...state, submitting: false };
          });

          reject({
            message: 'uploadError',
            file: file.name,
            error: err,
          });
        } else {
          const secure_url = data.Location;
          const public_id = data.Key;
          resolve({
            route: route,
            field: field,
            fieldType,
            index: index,
            url: {
              file_url: data.Location,
              public_id: data.Key,
            },
          });
        }
      });
  });
};

// export const uploadVideoToCloudinary = (
//   file,
//   token,
//   username,
//   handleSetState,
//   route,
//   field,
//   index,
//   fieldType,
//   getSignature,
//   t,
// ) => {
//   const url = process.env.REACT_APP_VIDEO_UPLOAD_URL;
//   const upload_preset =
//     process.env.REACT_APP_NODE_ENV === 'production'
//       ? process.env.REACT_APP_VIDEO_UPLOAD_PRESET_NAME
//       : process.env.REACT_APP_DEV_VIDEO_UPLOAD_PRESET_NAME;

//   const params = {
//     upload_preset,
//     username: username,
//     filename: file.name,
//     t: t,
//     token: token,
//   };
//   let fileFieldName = '';
//   let NameArray = [field, index];
//   NameArray.forEach(item => {
//     if (item) {
//       fileFieldName += item;
//     }
//   });
//   return new Promise(async (resolve, reject) => {
//     const sig_res = await getSignature(params);
//     console.log('sig_res', sig_res);
//     if (typeof sig_res === 'object') {
//       const formData = new FormData();
//       formData.append('file', file);
//       formData.append('public_id', sig_res.public_id);
//       formData.append('upload_preset', upload_preset);
//       formData.append('api_key', sig_res.api_key);
//       formData.append('timestamp', sig_res.timestamp);
//       formData.append('signature', sig_res.signature);
//       try {
//         const result = await axios.post(url, formData, {
//           headers: {
//             Authorization: `Token ${token}`,
//             'Access-Control-Allow-Origin': '*',
//             'Content-Type': 'application/json',
//           },
//           withCredentials: true,
//           onUploadProgress: e => {
//             handleSetState(state => {
//               let loadedPercent = state.loadedPercent;
//               loadedPercent[fileFieldName] = Math.round(
//                 (e.loaded * 100) / e.total,
//               );
//               let loadProgress = Math.round(
//                 Object.values(loadedPercent).reduce((a, b) => a + b, 0) /
//                   state.countFiles,
//               );

//               return {
//                 ...state,
//                 loadedPercent: loadedPercent,
//                 loadProgress: loadProgress,
//               };
//             });
//           },
//         });
//         console.log('response result from cloudinary', result);

//         resolve({
//           route: route,
//           field: field,
//           fieldType,
//           index: index,
//           url: { file_url: result.data.secure_url },
//         });
//       } catch (error) {
//         reject({ message: 'videoUploadError', file: file.name, error: error });
//       }
//     } else {
//       reject({
//         message: 'videoUploadError reject getSignal',
//         file: file.name,
//         error: sig_res,
//       });
//     }
//   });

// };
