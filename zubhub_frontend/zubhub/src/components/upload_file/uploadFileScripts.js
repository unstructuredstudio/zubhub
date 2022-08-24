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
    this.length = [0];
    this.urls = {};
  }

  updateLength(num, index) {
    if (!this.length[index]) {
      this.length[index] = 0;
    }
    this.length[index] += num;
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
    this.size -= this.files[index].size;
    delete this.files[index];
    this.updateLength(-1, index);
  }

  deleteAll() {
    this.files = {};
    this.length = [0];
    this.size = 0;
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

export const selectedFilesCount = (
  field,
  index,
  mediaUpload,
  countFilesText,
) => {
  let filesCount =
    index < 0
      ? mediaUpload.fileFields[field].length
          .filter(item => item !== undefined)
          .reduce((sum, record) => sum + record)
      : mediaUpload.fileFields[field].length[index];
  if (filesCount) {
    return filesCount > 1
      ? `${filesCount} ${countFilesText[1]}`
      : `${filesCount} ${countFilesText[0]}`;
  } else {
    return '';
  }
};

export const handleFileFieldChange = (
  name,
  fileInputRef,
  formikProps,
  newActivityObject,
  setFilesUploaded,
  setNewActivityObject,
) => {
  formikProps.setFieldTouched(name, true);
  const { field, index } = getFieldAndIndex(name);

  // initialize media upload objects
  let mediaUpload = newActivityObject['mediaUpload']
    ? newActivityObject['mediaUpload']
    : new MediaUpload();
  let selectedFiles = {};

  selectedFiles = fileInputRef.current.files;

  formikProps.setFieldValue(name, selectedFiles).then(errors => {
    if (!mediaUpload.fileFields[field]) {
      if (!errors[field]) {
        mediaUpload.createFileField(field, selectedFiles, index);
      }
    } else {
      if (!errors[field]) {
        if (fileInputRef.current.multiple && index < 0) {
          mediaUpload.updateFileField(field, selectedFiles, index);
        } else {
          mediaUpload.updateFileField(field, selectedFiles, index);
        }
      } else {
        if (index < 0) {
          mediaUpload.deleteAllFromField(field);
        } else {
          if (errors[field][index]) {
            if (mediaUpload.fileFields[field].files[index]) {
              mediaUpload.deleteFileFromField(field, index);
            }
          } else {
            mediaUpload.updateFileField(field, selectedFiles, index);
          }
        }
      }
    }
    setNewActivityObject(prevActivity => {
      return { ...prevActivity, mediaUpload: mediaUpload };
    });
  });
};

///////////////////////////////////////////////////////////////////////

export const FormMediaUpload = (state, auth, handleSetState) => {
  let promises = [];
  let filesByField = state.mediaUpload.fileFields;
  Object.keys(filesByField).forEach(field => {
    if (filesByField[field].files) {
      Object.keys(filesByField[field].files).forEach(index => {
        promises.push(
          uploadFile(
            filesByField[field].files[index],
            auth,
            handleSetState,
            field,
            index,
          ),
        );
      });
    }
  });
  return promises;
};

export const uploadFile = (file, auth, handleSetState, field, index) => {
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
        field,
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
  field,
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
        let mediaUpload = state.mediaUpload;
        mediaUpload.updateLoaded(
          //Math.round((e.loaded / mediaUpload.totalFilesSize) * 100),
          e.loaded,
        );
        return {
          ...state,
          mediaUpload: mediaUpload,
        };
      });
    },
  });
  if (result.data['Location']) {
    return {
      field: field,
      index: index,
      url: {
        file_url: result.data.Location,
        public_id: result.data.Key,
        fileName: file.name,
      },
    };
  } else {
    return {
      field: field,
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
