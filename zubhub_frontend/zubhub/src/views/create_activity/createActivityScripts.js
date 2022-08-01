import * as Yup from 'yup';
import ZubhubAPI from '../../api';
import { toast } from 'react-toastify';
import { nanoid } from 'nanoid';
import {
  s3 as DO,
  doConfig,
  Compress,
  slugify,
} from '../../assets/js/utils/scripts';

const API = new ZubhubAPI();

const vars = {
  activityImages_field_touched: false,
  inspiringExemplesImages_field_touched: false,
  upload_in_progress: false,
};

// ^/file validation functions
const isImage = (value) => {
  if (value) {
    let not_an_image = false;
    for (let index = 0; index < value.length; index++) {
      if (value[index].type.split('/')[0] !== 'image') {
        not_an_image = true;
      }
    }
    return !not_an_image
  } else {
    return true;
  }
};

const tooManyImages = (value) => {
  return value? value.length <= 10 : true
};

const imageSizeTooLarge = (value) => {
  if (value) {
    let image_size_too_large = false;
    for (let index = 0; index < value.length; index++) {
      if (value[index].size / 1000 > 10240) {
        image_size_too_large = true;
      }
    }
    return !image_size_too_large
  } else {
    return true;
  }
};
// file validation functions /$
export const validationSchema = Yup.object().shape({
  title: Yup.string().max(100, 'max').required('required'),
  motivation: Yup.string().max(10000, 'max').required('required'),
  learningGoals: Yup.string().max(10000, 'max').required('required'),
  facilitationTips: Yup.string().max(10000, 'max').required('required'),
  materialsUsed: Yup.mixed().test('at least one material', value => {
    return value ? value.length > 0 : false;
  }),
  activityImages: Yup.mixed()
    .test('image_is_empty', function (value) {
      return !value ? false : true;
    })
    .test('not_an_image', 'onlyImages', value => isImage(value))
    .test('too_many_images', 'tooManyImages', value => tooManyImages(value))
    .test('image_size_too_large', 'imageSizeTooLarge', value =>
      imageSizeTooLarge(value),
    ),
  ActivityMaterialsUsedImages: Yup.mixed()
    .test('image_is_empty', function (value) {
      return !value ? false : true;
    })
    .test('not_an_image', 'onlyImages', value => isImage(value))
    .test('too_many_images', 'tooManyImages', value => tooManyImages(value))
    .test('image_size_too_large', 'imageSizeTooLarge', value =>
      imageSizeTooLarge(value),
    ),
  inspiringExemplesImages: Yup.mixed()
    .test('image_is_empty', function (value) {
      return !value ? false : true;
    })
    .test('not_an_image', 'onlyImages', value => isImage(value))
    .test('too_many_images', 'tooManyImages', value => tooManyImages(value))
    .test('image_size_too_large', 'imageSizeTooLarge', value =>
      imageSizeTooLarge(value),
    ),
  inspiringArtistImage: Yup.mixed()
    .test('image_is_empty', function (value) {
      return !value ? false : true;
    })
    .test('not_an_image', 'onlyImages', value => isImage(value))
    .test('too_many_images', 'tooManyImages', value => tooManyImages(value))
    .test('image_size_too_large', 'imageSizeTooLarge', value =>
      imageSizeTooLarge(value),
    ),
});

export const handleTextFieldChange = (label, e, props) => {
  props.handleChange(e);
  // e.preventDefault();
  // props.setStatus({ ...props.status, [label]: '' });
  // props.setFieldTouched(label, true);
  // props.setFieldValue(label, e.target.value, false);
};

export const handleTextFieldBlur = (e, props) => {
  props.handleBlur(e);
  props.validateSteps();
};

export const handleInputTextFieldChange = (label, value, props) => {
  props.setInputTextFieldFocused(true);
  if (value && value !== '<p><br></p>') {
    props.setStatus({ ...props.status, [label]: '' });
    props.setFieldValue(label, value, true);
  } else {
    props.setFieldValue(label, undefined, true);
  }
  props.setFieldTouched(label, true);
};

export const handleInputTextFieldBlur = (label, props) => {
  props.validateSteps();
  props.handleSetState({
    newActivity: { ...props.newActivity, [label]: props.values[label] },
  });
  props.setInputTextFieldFocused(false);
};

export const createActivity = props => {
  return () => {
    return API.createActivity(props).then(res => {
      if (!res.id) {
        throw new Error(JSON.stringify(res));
      } else {
        toast.success(props.t('createProject.createToastSuccess'));
        // return props.history.push('/profile');
      }
    });
  };
};

export const uploadActivity = async (state, props, handleSetState) => {
  const materials_used = props.values['materialsUsed']
    ?.split(',')
    .filter(value => (value ? true : false))
    .join(',');

  const create_or_update = props.match.params.id
    ? props.updateActivity
    : createActivity;

  create_or_update({
    token: props.auth.token,
    title: state.title,
    motivation: state.motivation,
    learningGoals: state.learningGoals,
    materials_used: materials_used,
    materials_used_image:
      state.materials_used_image.media_upload.uploaded_images_url,
    facilitationTips: state.facilitationTips,
    activity_images: state.activityImages.media_upload.uploaded_images_url,
    creationSteps: state.creationSteps,
    inspiringArtist: state.inspiringArtist,
    id: props.match.params.id,
    video: state.media_upload.uploaded_videos_url[0]
      ? state.media_upload.uploaded_videos_url[0]
      : '',
    t: props.t,
  })
    .catch(error => {
      // handleSetState({
      //   media_upload: {
      //     ...state.media_upload,
      //     upload_dialog: false,
      //   },
      // });
      const messages = JSON.parse(error.message);
      if (typeof messages === 'object') {
        const server_errors = {};
        Object.keys(messages).forEach(key => {
          if (key === 'non_field_errors') {
            server_errors['non_field_errors'] = messages[key][0];
          } else {
            server_errors[key] = messages[key][0];
          }
        });
        props.setStatus({ ...server_errors });
      } else {
        props.setStatus({
          non_field_errors: props.t('createProject.errors.unexpected'),
        });
      }
    })
    .finally(() => {
      vars.upload_in_progress = false; // flag to prevent attempting to upload a project when an upload is already in progress
    });
};

export const initUpload = (e, state, props, handleSetState) => {
  e.preventDefault();
  console.log('initupload props', props);
  console.log('initUpload state ', state);
  if (!props.auth.token) {
    props.history.push('/login');
  } else {
    // upload images
    const fileFieldNames = ['activityImages', 'ActivityMaterialsUsedImages'];
    fileFieldNames.forEach(fileFieldName => {
      const promises = [];
      if (state[fileFieldName]) {
        for (
          let index = 0;
          index < state[fileFieldName].media_upload.images_to_upload.length;
          index++
        ) {
          promises.push(
            uploadImage(
              state[fileFieldName].media_upload.images_to_upload[index],
              state,
              props,
              handleSetState,
              fileFieldName,
            ),
          );
        }
        Promise.all(promises)
          .then(all => {
            const uploaded_images_url =
              state[fileFieldName].media_upload.uploaded_images_url;
            all.forEach(each => {
              uploaded_images_url.push(each);
            });
          })
          .catch(error => {
            // settimeout is used to delay closing the upload_dialog until
            // state have reflected all prior attempts to set state.
            // This is to ensure nothing overwrites the dialog closing.
            // A better approach would be to refactor the app and use
            // redux for most complex state interactions.
            setTimeout(
              () =>
                handleSetState({
                  media_upload: { ...state.media_upload, upload_dialog: false },
                }),
              1000,
            );

            if (error) console.log('initUploadError', error);
          });
      }
    });
  }
};

export const uploadImage = (image, state, props, handleSetState, label) => {
  const args = {
    t: props.t,
    token: props.auth.token,
  };

  return API.shouldUploadToLocal(args).then(res => {
    if (res && res.local === true) {
      return uploadImageToLocal(image, state, props, handleSetState);
    } else if (res && res.local === false) {
      return uploadImageToDO(image, state, props, handleSetState, label);
    }
  });
};

export const uploadImageToLocal = (image, state, props, handleSetState) => {
  let url =
    process.env.REACT_APP_NODE_ENV === 'production'
      ? process.env.REACT_APP_BACKEND_PRODUCTION_URL + '/api/'
      : process.env.REACT_APP_BACKEND_DEVELOPMENT_URL + '/api/';
  url = url + 'upload-file-to-local/';

  const formData = new FormData();
  formData.append('file', image);
  formData.append('key', `project_images/${nanoid()}`);
  return new Promise((resolve, reject) => {
    const um = new UploadMedia(
      'image',
      url,
      formData,
      state,
      props,
      handleSetState,
      resolve,
      reject,
    );
    um.upload();
  });
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

export class UploadMedia {
  constructor(
    type,
    url,
    formData,
    state,
    props,
    handleSetState,
    resolve,
    reject,
  ) {
    this.xhr = new XMLHttpRequest();
    this.type = type;
    this.url = url;
    this.formData = formData;
    this.state = state;
    this.props = props;
    this.handleSetState = handleSetState;
    this.resolve = resolve;
    this.reject = reject;
    this.xhr.upload.onload = this.uploadOnLoad;
    this.xhr.onreadystatechange = this.onReadyStateChange;
    this.xhr.upload.onerror = this.uploadOnerror;
    this.xhr.upload.onprogress = this.uploadOnprogress;
  }

  uploadOnLoad = () => {
    if (this.xhr.status !== 200 && this.xhr.readyState === 4) {
      const error = this.props.t('createProject.errors.unexpected');
      this.reject(error);
    }
  };

  onReadyStateChange = () => {
    if (
      this.xhr.status === 200 &&
      this.xhr.readyState === 4 &&
      this.type === 'video'
    ) {
      const data = JSON.parse(this.xhr.response);
      const secure_url = data.secure_url;
      this.resolve({ secure_url });
    } else if (
      this.xhr.status === 200 &&
      this.xhr.readyState === 4 &&
      this.type === 'image'
    ) {
      const data = JSON.parse(this.xhr.response);
      const secure_url = data.Location;
      const public_id = data.Key;

      this.resolve({ image_url: secure_url, public_id });
    }
  };

  uploadOnerror = _ => {
    const error = this.props.t('createProject.errors.unexpected');
    this.reject(error);
  };

  uploadOnprogress = e => {
    const progress = Math.round((e.loaded * 100.0) / e.total);
    const { media_upload } = this.state;

    const upload_info = JSON.parse(JSON.stringify(media_upload.upload_info));
    upload_info[this.formData.get('file').name] = progress;

    let total = 0;
    Object.keys(upload_info).forEach(each => {
      total = total + upload_info[each];
    });

    total = total / Object.keys(upload_info).length;

    this.handleSetState({
      media_upload: {
        ...media_upload,
        upload_info,
        upload_percent: total,
      },
    });
  };

  upload = () => {
    this.xhr.open('POST', this.url);
    if (!this.url.startsWith(process.env.REACT_APP_VIDEO_UPLOAD_URL)) {
      this.xhr.xsrfCookieName = 'csrftoken';
      this.xhr.xsrfHeaderName = 'X-CSRFToken';
      this.xhr.setRequestHeader(
        'Authorization',
        `Token ${this.props.auth.token}`,
      );
      this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    }

    this.xhr.send(this.formData);
  };
}
