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

class FileField {
  constructor() {
    this.files = {};
    this.size = 0;
    this.length = 0;
    this.urls = {};
  }

  addFile(file, index) {
    console.log('index', index);
    this.length += 1;
    if (this.files[index]) {
      this.size -= this.files[index].size;
      this.length -= 1;
    }
    this.files[index] = file;
    this.size += file.size;
  }
  //index is index of input in list of this fields inputs otherwise
  //is index in liste of files if filed has one input that  accepts multiple
  deleteFile(index) {
    this.size -= this.files[index].size;
    delete this.files[index];
    this.length -= 1;
  }

  deleteAll() {
    this.files = {};
    this.length = 0;
    this.size = 0;
  }
}

class MediaUpload {
  constructor(fileFields = {}, totalFilesSize = 0, loaded = 0) {
    this.fileFields = fileFields;
    this.totalFilesSize = totalFilesSize;
    this.loaded = loaded;
  }

  createFileField(field, files, inputIndex) {
    let fileField = new FileField();
    if (inputIndex >= 0) {
      fileField.addFile(files[0], inputIndex);
    } else {
      Object.keys(files).forEach(key => {
        console.log('from createFileField index', key);
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

  deleteFileFromField(field, index) {
    this.totalFilesSize -= this.fileFields[field].size;
    this.fileFields[field].deleteFile(index);
    this.totalFilesSize += this.fileFields[field].size;
  }

  deleteAllFromField(field) {
    this.totalFilesSize -= this.fileFields[field].size;
    this.fileFields[field].deleteAll();
  }
}

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
  console.log('name and field then index', name, field, index);

  let selectedFiles = fileInputRef.current.files;
  // initialize media upload objects
  let mediaUpload = newActivityObject['mediaUpload']
    ? newActivityObject['mediaUpload']
    : new MediaUpload();
  formikProps.setFieldValue(name, selectedFiles).then(errors => {
    console.log('files and inputIndex', selectedFiles, index);
    if (!mediaUpload.fileFields[field]) {
      if (!errors[field]) {
        mediaUpload.createFileField(field, selectedFiles, index);
      }
    } else {
      if (!errors[field]) {
        mediaUpload.updateFileField(field, selectedFiles, index);
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
