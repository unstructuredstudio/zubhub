import worker from 'workerize-loader!../../assets/js/removeMetaDataWorker'; // eslint-disable-line import/no-webpack-loader-syntax
import { getFieldAndIndex } from '../../assets/js/utils/scripts';
import ZubhubAPI from '../../api';
import { toast } from 'react-toastify';
import { nanoid } from 'nanoid';
import axios from 'axios';
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

export const removeMetaData = (images, state, handleSetState) => {
  const newWorker = worker();
  newWorker.removeMetaData(images);
  newWorker.addEventListener('message', e => {
    Compress(e.data, state, handleSetState);
  });
};

export class FileField {
  constructor() {
    this.files = {};
    this.size = 0;
    this.length = {};
    this.urls = {};
  }

  updateLength(value, index) {
    // if (!this.length[index]) {
    //   this.length[index] = 0;
    // }
    this.length[index] = value;
  }

  addUrl(url, index) {
    this.urls[index] = url;
  }

  addFile(file, index) {
    // this.updateLength(1, index);
    if (!this.length[index]) {
      // length instead of files
      this.updateLength(1, index);
    }
    if (this.files[index]) {
      this.size -= this.files[index].size;
    }
    this.files[index] = file;
    this.size += file.size;
  }
  //index is index of input in list of this fields inputs otherwise
  //is index in liste of files if filed has one input that  accepts multiple
  deleteFile(index) {
    if (this.files[index]) {
      this.size -= this.files[index].size;
    }
    delete this.files[index];
    delete this.urls[index];
    delete this.length[index];
  }

  deleteAll() {
    this.files = {};
    this.length = {};
    this.urls = {};
    this.size = 0;
  }

  imagesToPreview(inputIndex) {
    let imagesToPreview = {};

    if (Object.keys(this.length).length > 0) {
      if (inputIndex >= 0) {
        if (this.length[inputIndex]) {
          imagesToPreview[inputIndex] = this.files[inputIndex]
            ? { image: this.files[inputIndex], type: 'file' }
            : { image: this.urls[inputIndex], type: 'url' };
        }
      } else {
        Object.entries(this.length).map(([index, value]) => {
          if (value && value > 0) {
            imagesToPreview[index] = this.files[index]
              ? { image: this.files[index], type: 'file' }
              : { image: this.urls[index], type: 'url' };
          }
        });
      }
    }
    return imagesToPreview;
  }

  selectedFilesCount(index, countFilesText) {
    let filesCount = 0;
    if (index < 0 && Object.keys(this.length).length !== 0) {
      filesCount = Object.values(this.length).reduce(
        (sum, record) => sum + record,
        0,
      );
    } else {
      filesCount = this.length[index];
    }
    if (filesCount) {
      return filesCount > 1
        ? `${filesCount} ${countFilesText[1]}`
        : `${filesCount} ${countFilesText[0]}`;
    } else {
      return '';
    }
  }
}

export class MediaUpload {
  constructor(fileFields = {}, totalFilesSize = 0, loaded = 0) {
    this.fileFields = fileFields;
    this.totalFilesSize = totalFilesSize;
    this.loaded = loaded;
  }

  updateLoaded(loaded) {
    this.loaded += loaded;
  }

  createFileField(field, files, inputIndex) {
    let fileField = new FileField();
    if (inputIndex >= 0) {
      fileField.addFile(files[0], inputIndex);
    } else {
      Object.keys(files).forEach(key => {
        fileField.addFile(files[key], key);
      });
    }
    this.fileFields[field] = fileField;
    this.totalFilesSize += fileField.size;
  }

  updateFileField(field, files, inputIndex) {
    this.totalFilesSize -= this.fileFields[field].size;
    if (inputIndex >= 0) {
      this.fileFields[field].addFile(files[0], inputIndex);
    } else {
      this.fileFields[field].deleteAll();
      Object.keys(files).forEach(key => {
        this.fileFields[field].addFile(files[key], key);
      });
    }
    this.totalFilesSize += this.fileFields[field].size;
  }

  appendToFileField(field, files) {
    this.totalFilesSize -= this.fileFields[field].size;
    let fileValues = Object.values(this.fileFields[field].files).concat(
      Object.values(files),
    );
    this.fileFields[field].deleteAll();
    fileValues.forEach((file, index) => {
      this.fileFields[field].addFile(file, index);
    });
  }

  addUrlToField(field, url, index) {
    this.fileFields[field].addUrl(url, index);
  }

  deleteFileFromField(field, index) {
    this.totalFilesSize -= this.fileFields[field].size;
    this.fileFields[field].deleteFile(index);
    this.totalFilesSize += this.fileFields[field].size;
  }

  deleteAllFromField(field) {
    this.totalFilesSize -= this.fileFields[field].size;
    this.fileFields[field].deleteAll();
  }

  serializeImage = (fieldName, url, index) => {
    let fileField = this.fileFields[fieldName]
      ? this.fileFields[fieldName]
      : new FileField();
    fileField.addUrl(url, index);
    fileField.updateLength(1, index);
    this.fileFields[fieldName] = fileField;
  };
}

export const handleFileFieldChange = (
  name,
  route,
  field,
  inputIndex,
  fileInputRef,
  formikProps,
  newActivityObject,
  setFilesUploaded,
  setNewActivityObject,
  validateSteps,
) => {
  //const { field, index } = getFieldAndIndex(name);
  formikProps.setFieldTouched(name, true);
  // initialize media upload objects
  // let mediaUpload = newActivityObject['mediaUpload']
  //   ? newActivityObject['mediaUpload']
  //   : new MediaUpload();
  let selectedFiles = {};

  selectedFiles = fileInputRef.current.files;
  console.log('handle change uploadFile', name, selectedFiles);
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
      // if (!mediaUpload.fileFields[field]) {
      //   if (!errors[field]) {
      //     mediaUpload.createFileField(field, selectedFiles, index);
      //   }
      // } else {
      //   if (!errors[field]) {
      //     if (fileInputRef.current.multiple && index < 0) {
      //       mediaUpload.updateFileField(field, selectedFiles, index);
      //     } else {
      //       mediaUpload.updateFileField(field, selectedFiles, index);
      //     }
      //   } else {
      //     if (index < 0) {
      //       mediaUpload.deleteAllFromField(field);
      //     } else {
      //       if (errors[field][index]) {
      //         if (mediaUpload.fileFields[field].files[index]) {
      //           mediaUpload.deleteFileFromField(field, index);
      //         }
      //       } else {
      //         mediaUpload.updateFileField(field, selectedFiles, index);
      //       }
      //     }
      //   }
      // }
      // setNewActivityObject(prevActivity => {
      //   return { ...prevActivity, mediaUpload: mediaUpload };
      // });
    });
  }
  validateSteps();
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
        errors[route][field] &&
        errors[route][field][index] &&
        touched[route] &&
        touched[route][field] &&
        touched[route][field][index] &&
        errors[route][field][index]
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
    Object.entries(files).map(([index, value]) => {
      if (index !== 'length') {
        imagesToPreview[index] =
          typeof value === 'string'
            ? { image: value, type: 'url' }
            : { image: value, type: 'file' };
      }
    });
    console.log('images to preview', imagesToPreview);
  }
  return imagesToPreview;
};

export const deleteImage = (setFieldValue, fieldName) => {
  console.log('delete triggered', fieldName);
  setFieldValue(fieldName, undefined, true);
};

export const deleteImageAtIndex = (formikProps, field, index) => {
  let files = {};
  Object.entries(formikProps.formikValues[field]).forEach(([key, value]) => {
    if (key !== index) {
      files[key] = value;
    }
  });
  files['length'] = formikProps.formikValues[field].length - 1;
  console.log('delete at index triggered', index, files);
  formikProps.setFieldValue(field, files, true);
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
export const FormMediaUpload = (state, auth, handleSetState, formikValues) => {
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
    { field: 'video', files: formikValues['video'] && formikValues['video'] },
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
  console.log('filefields from upload', fileFields);
  let totalSize = 0;
  fileFields.map(item => {
    if (item.files) {
      Object.entries(item.files).forEach(([index, file]) => {
        if (index !== 'length' && typeof file !== 'string') {
          totalSize += file.size;
          promises.push(
            uploadFile(
              file,
              auth,
              handleSetState,
              item.route,
              item.field,
              item.type,
              index,
            ),
          );
        }
      });
    }
  });
  handleSetState(state => {
    return { ...state, totalToUpLoad: totalSize };
  });
  // let filesByField = state.mediaUpload.fileFields;
  // Object.keys(filesByField).forEach(field => {
  //   if (filesByField[field].files) {
  //     Object.keys(filesByField[field].files).forEach(index => {
  //       promises.push(
  //         uploadFile(
  //           filesByField[field].files[index],
  //           auth,
  //           handleSetState,
  //           field,
  //           index,
  //         ),
  //       );
  //     });
  //   }
  // });
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
      // return uploadImageToDO(image, state, props, handleSetState, label);
    }
  });
};

export const uploadFileToLocal = async (
  file,
  token,
  username,
  handleSetState,
  route,
  field,
  fieldType,
  index,
) => {
  let url =
    process.env.REACT_APP_NODE_ENV === 'production'
      ? process.env.REACT_APP_BACKEND_PRODUCTION_URL + '/api/'
      : process.env.REACT_APP_BACKEND_DEVELOPMENT_URL + '/api/';
  url = url + 'upload-file-to-local/';
  let key = nanoid();
  if (file.type.split('/')[0] === 'image') {
    key = `project_images/${key}`;
  } else {
    key = key.slice(0, Math.floor(key.length / 3));
    key = `videos/${slugify(username)}-${slugify(file.name)}-${key}`;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('key', key);

  const result = await axios.post(url, formData, {
    headers: {
      Authorization: `Token ${token}`,
    },
    onUploadProgress: e => {
      handleSetState(state => {
        let sizeUploaded = state.sizeUploaded;
        sizeUploaded += e.loaded;
        return {
          ...state,
          sizeUploaded: sizeUploaded,
        };
      });
    },
  });
  if (result.data['Location']) {
    return {
      route: route,
      field: field,
      fieldType,
      index: index,
      url: {
        file_url: result.data.Location,
        public_id: result.data.Key,
        fileName: file.name,
      },
    };
  } else {
    return {
      route: route,
      field: field,
      fieldType,
      index: index,
      url: { file_url: result.data.secure_url, fileName: file.name },
    };
  }
};

export const uploadImageToDO = (image, state, props, handleSetState, label) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: `${doConfig.bucketName}`,
      Key: `${label}/${nanoid()}`,
      Body: image,
      ContentType: image.type,
      ACL: 'public-read',
    };

    DO.upload(params, err => {
      reject(err.message);
    })
      .on('httpUploadProgress', e => {
        const progress = Math.round((e.loaded * 100.0) / e.total);
        const { media_upload } = state;
        const upload_info = JSON.parse(
          JSON.stringify(media_upload.upload_info),
        );
        upload_info[image.name] = progress;

        let total = 0;
        Object.keys(upload_info).forEach(each => {
          total = total + upload_info[each];
        });

        total = total / Object.keys(upload_info).length;

        handleSetState({
          media_upload: {
            ...media_upload,
            upload_info,
            upload_percent: total,
          },
        });
      })
      .send((err, data) => {
        if (err) {
          if (err.message.startsWith('Unexpected')) {
            const error = props.t('createProject.errors.unexpected');
            reject(error);
          } else {
            reject(err.message);
          }
        } else {
          const secure_url = data.Location;
          const public_id = data.Key;
          resolve({ image_url: secure_url, public_id });
        }
      });
  });
};
