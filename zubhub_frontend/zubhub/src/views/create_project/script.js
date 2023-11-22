import { nanoid } from 'nanoid';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { s3 as DO, doConfig, Compress, slugify } from '../../assets/js/utils/scripts';
import worker from 'workerize-loader!../../assets/js/removeMetaDataWorker'; // eslint-disable-line import/no-webpack-loader-syntax
import { site_mode, publish_type } from '../../assets/js/utils/constants';
import ZubHubAPI from '../../api';
const API = new ZubHubAPI();
export const vars = {
  image_field_touched: false,
  video_field_touched: false,
  upload_in_progress: false,
  timer: { id: null },
  default_state: {
    loading: true,
    error: null,
    desc_input_is_focused: false,
    video_upload_dialog_open: false,
    select_video_file: false,
    materials_used: [],
    categories: [],
    tag_suggestion: [],
    tag_suggestion_open: false,
    publish_types: [],
    publish_visible_to_suggestion: [],
    publish_visible_to_suggestion_open: false,
    media_upload: {
      upload_dialog: false,
      images_to_upload: [],
      videos_to_upload: [],
      upload_info: {},
      upload_percent: 0,
      uploaded_images_url: [],
      uploaded_videos_url: [],
    },
  },
  quill: {
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ header: [1, 2, 3, 4, 5, 6] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        ['code-block'],
      ],
    },
    formats: [
      'header',
      'bold',
      'italic',
      'underline',
      'strike',
      'blockquote',
      'script',
      'list',
      'bullet',
      'indent',
      'link',
      'image',
      'color',
      'code-block',
    ],
  },
};

export const testTags = ['Clothing', 'Animation', 'Painting', 'Science', 'Technology', 'Mechanics', 'Music', 'General'];

export const getCategories = props => {
  return props.getCategories({ t: props.t });
};

export const searchCreators = async ({ token, query_string }, callBack) => {
  try {
    const creators = await API.searchCreators({ token, page: null, query_string });
    callBack(creators.results.map(item => ({ name: item.username, id: item.id })));
  } catch (error) {}
};

export const handleMaterialsUsedFieldBlur = props => {
  props.setStatus({ ...props.status, materials_used: '' });
  props.setFieldTouched('materials_used', true);
};

export const removeMetaData = (images, state, handleSetState) => {
  const newWorker = worker();
  newWorker.removeMetaData(images);
  newWorker.addEventListener('message', e => {
    Compress(e.data, state, handleSetState);
  });
};

export const searchTags = (value, callBack) => {
  clearTimeout(vars.timer.id);
  if (value !== '') {
    vars.timer.id = setTimeout(async () => {
      try {
        const res = await API.suggestTags(value);
        callBack(undefined, res);
      } catch (error) {
        callBack(error);
      }
    }, 500);
  }
};

export const initUpload = (state, props, handleSetState) => {
  if (!props.auth.token) return props.navigate('/login');

  if (!(props.values.images.length !== 0 || props.values.video.length !== 0)) {
    vars.upload_in_progress = true;
    return uploadProject(state, props, handleSetState);
  }

  vars.upload_in_progress = true;
  state.media_upload.upload_dialog = true;
  handleSetState({
    success: false,
    default_state: {
      loading: true,
    },
    media_upload: {
      ...state.media_upload,
      upload_dialog: true,
      upload_percent: 0,
    },
  });

  const promises = [];

  // upload images
  for (let index = 0; index < props.values.images.filter(img => !img.link).length; index++) {
    promises.push(uploadImage(props.values.images[index], state, props, handleSetState));
  }

  // upload videos
  for (let index = 0; index < props.values.video.length; index++) {
    promises.push(uploadVideo(props.values.video[index], state, props, handleSetState));
  }

  // wait for all image and video promises to resolve before continuing
  Promise.all(promises)
    .then(all => {
      const uploaded_images_url = state.media_upload.uploaded_images_url;
      const uploaded_videos_url = state.media_upload.uploaded_videos_url;

      all.forEach(each => {
        if (each.public_id) {
          uploaded_images_url.push(each);
        } else if (each.secure_url) {
          uploaded_videos_url[0] = each.secure_url;
        }
      });

      state = JSON.parse(JSON.stringify(state));
      state.media_upload.uploaded_images_url = uploaded_images_url;
      state.media_upload.uploaded_videos_url = uploaded_videos_url;

      uploadProject(state, props, handleSetState);
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
        2000,
      );

      if (error) toast.warning(error);
    });
};

export const uploadProject = async (state, props, handleSetState) => {
  const materials_used = props.values['materials_used'].filter(value => (value ? true : false)).join(',');

  const tags = props.values['tags']
    ? props.values['tags'].map(tag => (typeof tag === 'string' ? { name: tag } : tag))
    : [];
  const create_or_update = props.params.id ? props.updateProject : props.createProject;
  let additionalFiles = props.values.images.filter(file => file?.image_url);
  if (additionalFiles.length < props.values.images.length) {
    additionalFiles = [...additionalFiles, ...state.media_upload.uploaded_images_url]?.map(
      ({ image_url, public_id }) => ({ image_url, public_id }),
    );
  }

  create_or_update({
    ...props.values,
    tags,
    materials_used,
    id: props.params.id,
    token: props.auth.token,
    activity: props.location.state?.activity_id,
    images: additionalFiles || '',
    video: props.values.video_link || state.media_upload.uploaded_videos_url[0] || '',
    category: props.values.category.filter(cat => cat.name).map(cat => cat?.name),
    t: props.t,
    publish: { type: props.step < 3 ? 1 : 4, visible_to: [] },
  })
    .then(project => {
      state.media_upload.uploaded_images_url = [];
      const files = project.images.map(img => ({
        ...img,
        name: img.image_url,
        type: 'image/*',
        size: 1000000,
        link: true,
      }));
      props.setFieldValue('images', files, true);
      handleSetState({ ...state, default_state: { loading: false }, success: true, id: `${project.id}` });
    })
    .catch(error => {
      console.log(error, 'error');
      handleSetState({
        media_upload: {
          ...state.media_upload,
          upload_dialog: false,
          default_state: { loading: false },
        },
      });
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

export const uploadVideo = (video, state, props, handleSetState) => {
  if (
    typeof video === 'string' &&
    video.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)
  ) {
    return new Promise(r => r({ secure_url: video }));
  } else {
    const args = {
      t: props.t,
      token: props.auth.token,
    };

    return props.shouldUploadToLocal(args).then(res => {
      if (res && res.local === true) {
        return uploadVideoToLocal(video, state, props, handleSetState);
      } else if (res && res.local === false) {
        return uploadVideoToCloudinary(video, state, props, handleSetState);
      }
    });
  }
};

export const uploadVideoToLocal = (video, state, props, handleSetState) => {
  let url =
    process.env.REACT_APP_NODE_ENV === 'production'
      ? process.env.REACT_APP_BACKEND_PRODUCTION_URL + '/api/'
      : process.env.REACT_APP_BACKEND_DEVELOPMENT_URL + '/api/';
  url = url + 'upload-file-to-local/';

  let key = nanoid();
  key = key.slice(0, Math.floor(key.length / 3));
  key = `videos/${slugify(props.auth.username)}-${slugify(video.name)}-${key}`;

  const formData = new FormData();
  formData.append('file', video);
  formData.append('key', key);

  return new Promise((resolve, reject) => {
    const um = new UploadMedia('video', url, formData, state, props, handleSetState, resolve, reject);
    um.upload();
  });
};

export const uploadVideoToCloudinary = (video, state, props, handleSetState) => {
  const url = process.env.REACT_APP_VIDEO_UPLOAD_URL;

  const upload_preset =
    process.env.REACT_APP_NODE_ENV === 'production'
      ? process.env.REACT_APP_VIDEO_UPLOAD_PRESET_NAME
      : process.env.REACT_APP_DEV_VIDEO_UPLOAD_PRESET_NAME;

  const params = {
    upload_preset,
    username: props.auth.username,
    filename: video.name,
    t: props.t,
    token: props.auth.token,
  };

  return props.getSignature(params).then(sig_res => {
    if (typeof sig_res === 'object') {
      const formData = new FormData();
      formData.append('file', video);
      formData.append('public_id', sig_res.public_id);
      formData.append('upload_preset', upload_preset);
      formData.append('api_key', sig_res.api_key);
      formData.append('timestamp', sig_res.timestamp);
      formData.append('signature', sig_res.signature);

      return new Promise((resolve, reject) => {
        const um = new UploadMedia('video', url, formData, state, props, handleSetState, resolve, reject);
        um.upload();
      });
    } else {
      return Promise.reject('');
    }
  });
};

export const uploadImage = (image, state, props, handleSetState) => {
  const args = {
    t: props.t,
    token: props.auth.token,
  };

  return props.shouldUploadToLocal(args).then(res => {
    if (res && res.local === true) {
      return uploadImageToLocal(image, state, props, handleSetState);
    } else if (res && res.local === false) {
      return uploadImageToDO(image, state, props, handleSetState);
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
    const um = new UploadMedia('image', url, formData, state, props, handleSetState, resolve, reject);
    um.upload();
  });
};

export const uploadImageToDO = (image, state, props, handleSetState) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: `${doConfig.bucketName}`,
      Key: `${doConfig.project_images}/${nanoid()}`,
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
        const upload_info = JSON.parse(JSON.stringify(media_upload.upload_info));
        upload_info[image.name] = progress;

        let total = 0;
        Object.keys(upload_info).forEach(each => {
          total = total + upload_info[each];
        });

        total = total / Object.keys(upload_info).length;

        handleSetState({
          default_state: { loading: false },
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

export const getProject = (props, state) => {
  return props
    .getProject({
      id: props.params.id,
      token: props.auth.token,
    })
    .then(obj => {
      if (!obj.project) {
        return obj;
      } else {
        const { media_upload } = state;

        if (obj.project.title) {
          props.setFieldValue('title', obj.project.title);
        }

        if (obj.project.description) {
          props.setFieldValue('description', obj.project.description);
          // refs.desc_el.current.editor.root.innerHTML = obj.project.description;
        }

        if (obj.project.video) {
          // refs.video_selection_feedback_el.current.innerText = `${props.t(
          //     'createProject.inputs.videoURL',
          // )}`;

          props.setFieldValue('video_link', obj.project.video, true);
        }

        if (obj.project.images.length > 0) {
          // refs.image_count_el.current.innerText = `${obj.project.images.length
          //     } ${props.t(
          //         `createProject.inputs.${obj.project.images.length < 2 ? 'image' : 'images'
          //         }`,
          //     )}`;

          const files = obj.project.images.map(image => ({
            ...image,
            name: image.image_url,
            type: 'image/*',
            size: 1000000,
            link: true,
          }));

          props.setFieldValue('images', files, true);
        }

        if (obj.project.materials_used) {
          props.setFieldValue('materials_used', obj.project.materials_used.split(','), true);
        }

        if (obj.project.category) {
          props.setFieldValue(
            'category',
            obj.project.category.map(cat => ({ name: cat })),
            true,
          );
        }

        if (obj.project.tags) {
          props.setFieldValue(
            'tags',
            obj.project.tags.map(tag => tag.name),
            true,
          );
        }

        // if (refs.publish_type_el.current && obj.project.publish) {
        //     const publish = {
        //         type: obj.project.publish.type,
        //         visible_to: obj.project.publish.visible_to.map(
        //             creator => creator.username,
        //         ),
        //     };
        //     props.setFieldValue('publish', publish, true);
        // }

        media_upload.uploaded_images_url = obj.project.images;
        media_upload.uploaded_videos_url = obj.project.video ? [obj.project.video] : [];

        return {
          materials_used: obj.project.materials_used.split(','),
          media_upload,
        };
      }
    });
};

export const checkMediaFilesErrorState = (refs, props) => {
  if (props.auth.token) {
    if (props.touched['project_images'] && props.errors['project_images']) {
      refs.image_upload_button_el.current.setAttribute('style', 'border-color:#F54336; color:#F54336');
    } else {
      refs.image_upload_button_el.current.setAttribute(
        'style',
        'border-color: 1px solid rgba(0, 0, 0, 0.23); color:#00B8C4',
      );
    }

    if (props.touched['video'] && props.errors['video']) {
      refs.video_upload_button_el.current.setAttribute('style', 'border-color:#F54336; color:#F54336');
    } else {
      refs.video_upload_button_el.current.setAttribute(
        'style',
        'border-color: 1px solid rgba(0, 0, 0, 0.23); color:#00B8C4',
      );
    }

    if (props.touched['project_images']) {
      vars.image_field_touched = true;
    } else {
      vars.image_field_touched = false;
    }

    if (props.touched['video']) {
      vars.video_field_touched = true;
    } else {
      vars.video_field_touched = false;
    }
  }
};

export const validationSchema = Yup.object().shape({
  title: Yup.string().max(100, 'max').required('required'),
  description: Yup.string().max(10000, 'max').required('required'),
  project_images: Yup.mixed()
    .test('image_is_empty', 'imageOrVideo', function (value) {
      return vars.image_field_touched && !value && !this.parent.video ? false : true;
    })
    .test('not_an_image', 'onlyImages', value => {
      if (value) {
        let not_an_image = false;
        for (let index = 0; index < value.files?.length; index++) {
          if (value.files[index].type.split('/')[0] !== 'image') {
            not_an_image = true;
          }
        }
        return not_an_image ? false : true;
      } else {
        return true;
      }
    })
    .test('too_many_images', 'tooManyImages', value => {
      if (value) {
        return value.files?.length > 10 ? false : true;
      } else {
        return true;
      }
    })
    .test('image_size_too_large', 'imageSizeTooLarge', value => {
      if (value) {
        let image_size_too_large = false;
        for (let index = 0; index < value.files?.length; index++) {
          if (value.files[index].size / 1000 > 10240) {
            image_size_too_large = true;
          }
        }
        return image_size_too_large ? false : true;
      } else {
        return true;
      }
    }),
  // video: Yup.mixed()
  //   .test('should_be_video_file', 'shouldBeVideoFile', value => {
  //     if (!value) {
  //       return true;
  //     } else if (typeof value === 'string') {
  //       return true;
  //     } else if (typeof value === 'object') {
  //       let not_a_video = false;
  //       for (let index = 0; index < value.files.length; index++) {
  //         if (value.files[index].type.split('/')[0] !== 'video') {
  //           not_a_video = true;
  //         }
  //       }
  //       return not_a_video ? false : true;
  //     }
  //     return false;
  //   })
  //   .test('should_be_url', 'shouldBeURL', value => {
  //     if (!value) {
  //       return true;
  //     } else if (typeof value === 'object') {
  //       return true;
  //     } else if (typeof value === 'string') {
  //       const res = value.match(
  //         /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}(\.|:)[a-z0-9]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
  //       );
  //       return res !== null ? true : false;
  //     }

  //     return false;
  //   })
  //   .test('max-video-url-length', 'maxVideoURLLength', value => {
  //     if (!value) {
  //       return true;
  //     } else if (typeof value === 'object') {
  //       return true;
  //     } else if (typeof value === 'string') {
  //       return value.length > 2048 ? false : true;
  //     }

  //     return false;
  //   })
  //   .test('max-video-file-size', 'maxVideoFileSize', value => {
  //     if (!value) {
  //       return true;
  //     } else if (typeof value === 'string') {
  //       return true;
  //     } else if (typeof value === 'object') {
  //       let max = false;
  //       for (let index = 0; index < value.files.length; index++) {
  //         if (value.files[index].size / 1000 > 60240) {
  //           max = true;
  //         }
  //       }
  //       return max ? false : true;
  //     }

  //     return false;
  //   })
  //   .test('video_is_empty', 'imageOrVideo', function (value) {
  //     return vars.video_field_touched && !value && !this.parent.project_images
  //       ? false
  //       : true;
  //   }),
  materials_used: Yup.array(Yup.string()).required(),
  category: Yup.string(),
  // tags: Yup.mixed().test('unsupported', 'unsupported', tags => {
  //     if (tags) {
  //         tags = JSON.parse(tags);
  //         const re = /^[0-9A-Za-z\s\-]+$/;
  //         let unsupported = false;
  //         for (let tag of tags) {
  //             if (!re.test(tag.name)) {
  //                 unsupported = true;
  //             }
  //         }
  //         return unsupported ? false : true;
  //     } else {
  //         return true;
  //     }
  // }),
  // publish: Yup.mixed()
  //   .test('visible_to_required', 'visible_to_required', publish => {
  //     if (
  //       publish.type === publish_type['Preview'] &&
  //       publish.visible_to.length < 1
  //     ) {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   })
  //   .test('visible_to_unsupported', 'visible_to_unsupported', publish => {
  //     const re = /^[a-z0-9@._+-]{1,150}$/i;
  //     let unsupported = false;
  //     for (let username of publish.visible_to) {
  //       console.log('kdlskdlksd', username);
  //       if (!re.test(username)) {
  //         unsupported = true;
  //       }
  //     }
  //     return unsupported ? false : true;
  //   }),
});

export const formikSchema = {
  initialValues: {
    title: undefined,
    description: undefined,
    materials_used: undefined,
    project_images: [],
    images: [],
    video: [],
    video_link: '',
    tags: '',
    category: [{}],
    creators: [],
  },
  validationSchema: validationSchema,
};

export class UploadMedia {
  constructor(type, url, formData, state, props, handleSetState, resolve, reject) {
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
    if (this.xhr.status === 200 && this.xhr.readyState === 4 && this.type === 'video') {
      const data = JSON.parse(this.xhr.response);
      const secure_url = data.secure_url;
      this.resolve({ secure_url });
    } else if (this.xhr.status === 200 && this.xhr.readyState === 4 && this.type === 'image') {
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
      this.xhr.setRequestHeader('Authorization', `Token ${this.props.auth.token}`);
      this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    }

    this.xhr.send(this.formData);
  };
}
