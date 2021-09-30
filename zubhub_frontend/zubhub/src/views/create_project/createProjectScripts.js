import { nanoid } from 'nanoid';
import * as Yup from 'yup';
import { s3 as DO, doConfig, Compress } from '../../assets/js/utils/scripts';
import worker from 'workerize-loader!../../assets/js/removeMetaDataWorker'; // eslint-disable-line import/no-webpack-loader-syntax

export const vars = {
  image_field_touched: false,
  video_field_touched: false,
  upload_in_progress: false,
  timer: { id: null },
  default_state: {
    desc_tool_tip_open: false,
    video_upload_dialog_open: false,
    loading: true,
    error: null,
    materials_used: [],
    categories: [],
    tag_suggestion: [],
    tag_suggestion_open: false,
    select_video_file: false,
    media_upload: {
      upload_dialog: false,
      images_to_upload: [],
      videos_to_upload: [],
      successful_uploads: 0,
      upload_info: {},
      upload_percent: 0,
      uploaded_images_url: [],
      uploaded_videos_url: [],
    },
  },
};

export const getCategories = props => {
  return props.getCategories({ t: props.t });
};

export const handleTextFieldChange = (e, props) => {
  props.setStatus({ ...props.status, [e.target.id]: '' });
  props.handleChange(e);
};

export const handleTextFieldBlur = (e, props) => {
  props.setStatus({ ...props.status, [e.target.id]: '' });
  props.handleBlur(e);
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

export const handleImageButtonClick = (e, props, refs) => {
  e.preventDefault();
  refs.image_el.current.click();
  props.setFieldTouched('project_images');
};

export const handleVideoButtonClick = (e, props, bool) => {
  e.preventDefault();
  props.setFieldTouched('video');
  return { video_upload_dialog_open: !bool };
};

export const handleDescTooltipOpen = () => {
  return { desc_tool_tip_open: true };
};

export const handleDescTooltipClose = () => {
  return { desc_tool_tip_open: false };
};

export const handleToggleSelectVideoFileChecked = bool => {
  return { select_video_file: !bool };
};

export const handleSuggestTags = (e, props, state, handleSetState) => {
  clearTimeout(vars.timer.id);
  const value = e.currentTarget.value;

  if (value !== '' && value.search(',') === -1) {
    vars.timer.id = setTimeout(() => {
      suggestTags(value, props, handleSetState, state);
    }, 500);
  }
};

export const suggestTags = (value, props, handleSetState, _) => {
  handleSetState({ tag_suggestion_open: true });
  handleSetState(props.suggestTags({ value, t: props.t }));
};

export const addMaterialsUsedNode = (e, props) => {
  e.preventDefault();
  let materials_used = props.values['materials_used'];
  if (!materials_used) {
    props.setFieldValue('materials_used', ',,,');
  } else {
    props.setFieldValue('materials_used', materials_used.concat(','));
  }
};

export const removeTag = (_, props, value) => {
  let tags = props.values['tags'];
  tags = tags ? JSON.parse(tags) : [];
  tags = tags.filter(tag => tag.name !== value);
  props.setFieldValue('tags', JSON.stringify(tags));
};

export const handleImageFieldChange = (refs, props, state, handleSetState) => {
  refs.image_count_el.current.innerText = `${
    refs.image_el.current.files.length
  } ${props.t(
    `createProject.inputs.${
      refs.image_el.current.files.length < 2 ? 'image' : 'images'
    }`,
  )}`;

  props.setFieldValue('project_images', refs.image_el.current).then(errors => {
    if (!errors['project_images']) {
      removeMetaData(refs.image_el.current.files, state, handleSetState);
    }
  });

  props.setStatus({ ...props.status, images: '' });
};

export const handleVideoFieldCancel = async (refs, props, state) => {
  refs.video_selection_feedback_el.current.innerText = '';

  return props.setFieldValue('video', '').then(() => {
    const { media_upload } = state;
    media_upload.videos_to_upload = [];
    media_upload.uploaded_videos_url = [];
    return { media_upload };
  });
};

export const handleAddMaterialFieldChange = (_, props, refs) => {
  const children = refs.add_materials_used_el.current.children;
  let value = '';
  for (let index = 0; index < children.length; index++) {
    if (children[index].children[0].value) {
      if (index < 1) {
        value = value.concat(children[index].children[0].value);
      } else {
        value = value.concat(`,${children[index].children[0].value}`);
      }
    } else {
      if (index >= 1) {
        value = value.concat(',');
      }
    }
  }

  props.setFieldValue('materials_used', value, true);
  props.setStatus({ ...props.status, materials_used: '' });
};

export const handleAddTags = (e, props, add_tags_el) => {
  props.setFieldTouched('tags', true, true);
  let value = e.currentTarget.value.split(',');
  value[0] = value[0].trim();
  let tags = props.values['tags'];
  tags = tags ? JSON.parse(tags) : [];

  const exists =
    tags.filter(tag => tag.name === value[0]).length > 0 ? true : false;

  if (!exists && value.length > 1 && value[0] && !(tags.length >= 5)) {
    tags.push({ name: value[0] });
    props.setFieldValue('tags', JSON.stringify(tags));
    e.currentTarget.value = '';
    if (e.currentTarget.focus) e.currentTarget.focus();
    if (add_tags_el) {
      add_tags_el.current.value = '';
      add_tags_el.current.focus();
    }
  }

  return { tag_suggestion_open: false, tag_suggestion: [] };
};

export const handleVideoSelectDone = async (refs, props, state) => {
  const { media_upload } = state;
  if (media_upload.videos_to_upload.length < 1) {
    refs.video_selection_feedback_el.current.innerText = '';
    return props.setFieldValue('video', '').then(() => {
      media_upload.videos_to_upload = [];
      media_upload.uploaded_videos_url = [];
      return { media_upload };
    });
  }
  return {};
};

export const initUpload = (e, state, props, handleSetState) => {
  e.preventDefault();

  if (!props.auth.token) {
    props.history.push('/login');
  } else {
    props.setFieldTouched('title');
    props.setFieldTouched('description');
    props.setFieldTouched('project_images');
    props.setFieldTouched('video');
    props.setFieldTouched('materials_used');
    props.setFieldTouched('category');
    props.setFieldTouched('tags');

    vars.image_field_touched = true;
    vars.video_field_touched = true;

    props.validateForm().then(errors => {
      if (
        Object.keys(errors).length > 0 &&
        (Object.keys(errors).length !== 2 ||
          !(
            errors['project_images'] === 'imageOrVideo' &&
            errors['video'] === 'imageOrVideo' &&
            state.media_upload.uploaded_videos_url.length !== 0 &&
            state.media_upload.uploaded_videos_url.length !== 0
          ))
      ) {
        return;
      } else if (
        (state.media_upload.uploaded_images_url.length !== 0 ||
          state.media_upload.uploaded_videos_url.length !== 0) &&
        !(
          state.media_upload.images_to_upload.length !== 0 ||
          state.media_upload.videos_to_upload.length !== 0
        )
      ) {
        vars.upload_in_progress = true;
        uploadProject(state, props, handleSetState);
      } else {
        const { media_upload } = state;
        media_upload.upload_dialog = true;
        media_upload.upload_percent = 0;
        handleSetState({ media_upload });

        for (
          let index = 0;
          index < media_upload.images_to_upload.length;
          index++
        ) {
          uploadImage(
            media_upload.images_to_upload[index],
            state,
            props,
            handleSetState,
          );
        }

        for (
          let index = 0;
          index < media_upload.videos_to_upload.length;
          index++
        ) {
          uploadVideo(
            media_upload.videos_to_upload[index],
            state,
            props,
            handleSetState,
          );
        }
      }
    });
  }
};

export const uploadProject = async (state, props, handleSetState) => {
  const { media_upload } = state;
  media_upload.upload_dialog = false;
  handleSetState({ media_upload });

  const materials_used = props.values['materials_used']
    ?.split(',')
    .filter(value => (value ? true : false))
    .join(',');

  const tags = props.values['tags']
    ? JSON.parse(props.values['tags']).filter(tag => (tag.name ? true : false))
    : [];

  const create_or_update = props.match.params.id
    ? props.updateProject
    : props.createProject;

  await create_or_update({
    ...props.values,
    materials_used,
    tags,
    id: props.match.params.id,
    token: props.auth.token,
    images: state.media_upload.uploaded_images_url,
    video: state.media_upload.uploaded_videos_url[0]
      ? state.media_upload.uploaded_videos_url[0]
      : '',
    category: props.values.category,
    t: props.t,
  }).catch(error => {
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
  });

  vars.upload_in_progress = false; //flag to prevent attempting to upload a project when an upload is already in progress
};

export const uploadVideo = async (video, state, props, handleSetState) => {
  if (
    typeof video === 'string' &&
    video.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
    )
  ) {
    const { media_upload } = state;

    media_upload.uploaded_videos_url = [video];
    media_upload.successful_uploads = media_upload.successful_uploads + 1;

    handleSetState({ media_upload });
  } else {
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

    const sig_res = await props.getSignature(params);

    if (typeof sig_res === 'object') {
      const formData = new FormData();
      formData.append('file', video);
      formData.append('public_id', sig_res.public_id);
      formData.append('upload_preset', upload_preset);
      formData.append('api_key', sig_res.api_key);
      formData.append('timestamp', sig_res.timestamp);
      formData.append('signature', sig_res.signature);

      let xhr = new XMLHttpRequest();

      xhr.upload.onload = function (e) {
        if (xhr.status !== 200 && xhr.readyState === 4) {
          const { media_upload } = state;
          media_upload.upload_dialog = false;

          handleSetState({
            error: props.t('createProject.errors.unexpected'),
            media_upload,
          });
        }
      };

      xhr.onreadystatechange = () => {
        if (xhr.status === 200 && xhr.readyState === 4) {
          const data = JSON.parse(xhr.response);
          const secure_url = data.secure_url;
          const { media_upload } = state;

          media_upload.uploaded_videos_url = [secure_url];
          media_upload.successful_uploads = media_upload.successful_uploads + 1;

          handleSetState({ media_upload });
        }
      };

      xhr.upload.onerror = e => {
        const { media_upload } = state;
        media_upload.upload_dialog = false;

        handleSetState({
          error: props.t('createProject.errors.unexpected'),
          media_upload,
        });
      };

      xhr.upload.onprogress = e => {
        const progress = Math.round((e.loaded * 100.0) / e.total);
        const { media_upload } = state;
        media_upload.upload_info[video.name] = progress;

        let total = 0;
        Object.keys(media_upload.upload_info).forEach(each => {
          total = total + media_upload.upload_info[each];
        });

        total = total / Object.keys(media_upload.upload_info).length;
        media_upload.upload_percent = total;

        handleSetState({ media_upload });
      };

      xhr.open('POST', url);
      xhr.send(formData);
    } else {
      const { media_upload } = state;
      media_upload.upload_dialog = false;

      handleSetState({
        media_upload,
      });
    }
  }
};

export const uploadImage = (image, state, props, handleSetState) => {
  const params = {
    Bucket: `${doConfig.bucketName}`,
    Key: `${doConfig.project_images}/${nanoid()}`,
    Body: image,
    ContentType: image.type,
    ACL: 'public-read',
  };

  DO.upload(params, err => {
    const { media_upload } = state;
    media_upload.upload_dialog = false;
    vars.upload_in_progress = false;
    handleSetState({ media_upload });
  })
    .on('httpUploadProgress', e => {
      const progress = Math.round((e.loaded * 100.0) / e.total);
      const { media_upload } = state;
      media_upload.upload_info[image.name] = progress;

      let total = 0;
      Object.keys(media_upload.upload_info).forEach(each => {
        total = total + media_upload.upload_info[each];
      });

      total = total / Object.keys(media_upload.upload_info).length;
      media_upload.upload_percent = total;

      handleSetState({ media_upload });
    })
    .send((err, data) => {
      if (err) {
        const { media_upload } = state;
        media_upload.upload_dialog = false;

        if (err.message.startsWith('Unexpected')) {
          handleSetState({
            error: props.t('createProject.errors.unexpected'),
            media_upload,
          });
        } else {
          handleSetState({ error: err.message, media_upload });
        }
      } else {
        const secure_url = data.Location;
        const public_id = data.Key;
        const { media_upload } = state;

        media_upload.uploaded_images_url.push({
          image_url: secure_url,
          public_id,
        });
        media_upload.successful_uploads = media_upload.successful_uploads + 1;

        handleSetState({ media_upload });
      }
    });
};

export const getProject = (refs, props, state) => {
  return props
    .getProject({
      id: props.match.params.id,
      token: props.auth.token,
    })
    .then(obj => {
      if (!obj.project) {
        return obj;
      } else {
        const { media_upload } = state;

        if (refs.title_el.current && obj.project.title) {
          props.setFieldValue('title', obj.project.title);
          refs.title_el.current.firstChild.value = obj.project.title;
        }

        if (refs.desc_el.current && obj.project.description) {
          props.setFieldValue('description', obj.project.description);
          refs.desc_el.current.firstChild.value = obj.project.description;
        }

        if (refs.video_selection_feedback_el.current && obj.project.video) {
          refs.video_selection_feedback_el.current.innerText = `${props.t(
            'createProject.inputs.videoURL',
          )}`;

          props.setFieldValue('video', obj.project.video, true);
        }

        if (refs.image_count_el.current && obj.project.images.length > 0) {
          refs.image_count_el.current.innerText = `${
            obj.project.images.length
          } ${props.t(
            `createProject.inputs.${
              obj.project.images.length < 2 ? 'image' : 'images'
            }`,
          )}`;

          const files = obj.project.images.map(url => ({
            name: url,
            type: 'image/*',
            size: 1000000,
          }));

          props.setFieldValue('project_images', { files }, true);
        }

        if (refs.add_materials_used_el.current && obj.project.materials_used) {
          props.setFieldValue(
            'materials_used',
            obj.project.materials_used,
            true,
          );
        }

        if (obj.project.category) {
          props.setFieldValue('category', obj.project.category);
        }

        if (refs.add_tags_el.current && obj.project.tags) {
          props.setFieldValue('tags', JSON.stringify(obj.project.tags), true);
        }

        media_upload.uploaded_images_url = obj.project.images;
        media_upload.uploaded_videos_url = obj.project.video
          ? [obj.project.video]
          : [];

        return {
          loading: false,
          materials_used: obj.project.materials_used.split(','),
          media_upload,
        };
      }
    });
};

export const handleVideoFieldChange = async (e, refs, props, state) => {
  let video_node;
  let type;

  if (e) {
    e.target.parentNode.classList.add('videoFileDragDrop');

    video_node =
      e.target === refs.video_file_el.current
        ? refs.video_file_el.current
        : e.target === refs.video_el.current.firstChild
        ? e.target
        : '';

    type =
      e.target === refs.video_file_el.current
        ? 'videoFile'
        : e.target === refs.video_el.current.firstChild
        ? 'videoURL'
        : null;
  }

  props.setStatus({ ...props.status, video: '' });

  return props
    .setFieldValue(
      'video',
      type === 'videoFile' ? video_node : video_node.value,
    )
    .then(errors => {
      if (!errors['video']) {
        const { media_upload } = state;
        media_upload.videos_to_upload = [
          type === 'videoFile' ? video_node.files[0] : video_node.value,
        ];
        refs.video_selection_feedback_el.current.innerText = props.t(
          `createProject.inputs.${type}`,
        );
        return { media_upload };
      } else {
        refs.video_selection_feedback_el.current.innerText = '';
        return {};
      }
    });
};

export const checkMediaFilesErrorState = (refs, props) => {
  if (props.auth.token) {
    if (props.touched['project_images'] && props.errors['project_images']) {
      refs.image_upload_button_el.current.setAttribute(
        'style',
        'border-color:#F54336; color:#F54336',
      );
    } else {
      refs.image_upload_button_el.current.setAttribute(
        'style',
        'border-color: 1px solid rgba(0, 0, 0, 0.23); color:#00B8C4',
      );
    }

    if (props.touched['video'] && props.errors['video']) {
      refs.video_upload_button_el.current.setAttribute(
        'style',
        'border-color:#F54336; color:#F54336',
      );
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
      return vars.image_field_touched && !value && !this.parent.video
        ? false
        : true;
    })
    .test('not_an_image', 'onlyImages', value => {
      if (value) {
        let not_an_image = false;
        for (let index = 0; index < value.files.length; index++) {
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
        return value.files.length > 10 ? false : true;
      } else {
        return true;
      }
    })
    .test('image_size_too_large', 'imageSizeTooLarge', value => {
      if (value) {
        let image_size_too_large = false;
        for (let index = 0; index < value.files.length; index++) {
          if (value.files[index].size / 1000 > 10240) {
            image_size_too_large = true;
          }
        }
        return image_size_too_large ? false : true;
      } else {
        return true;
      }
    }),
  video: Yup.mixed()
    .test('should_be_video_file', 'shouldBeVideoFile', value => {
      if (!value) {
        return true;
      } else if (typeof value === 'string') {
        return true;
      } else if (typeof value === 'object') {
        let not_a_video = false;
        for (let index = 0; index < value.files.length; index++) {
          if (value.files[index].type.split('/')[0] !== 'video') {
            not_a_video = true;
          }
        }
        return not_a_video ? false : true;
      }
      return false;
    })
    .test('should_be_url', 'shouldBeURL', value => {
      if (!value) {
        return true;
      } else if (typeof value === 'object') {
        return true;
      } else if (typeof value === 'string') {
        const res = value.match(
          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
        );
        return res !== null ? true : false;
      }

      return false;
    })
    .test('max-video-url-length', 'maxVideoURLLength', value => {
      if (!value) {
        return true;
      } else if (typeof value === 'object') {
        return true;
      } else if (typeof value === 'string') {
        return value.length > 2048 ? false : true;
      }

      return false;
    })
    .test('max-video-file-size', 'maxVideoFileSize', value => {
      if (!value) {
        return true;
      } else if (typeof value === 'string') {
        return true;
      } else if (typeof value === 'object') {
        let max = false;
        for (let index = 0; index < value.files.length; index++) {
          if (value.files[index].size / 1000 > 60240) {
            max = true;
          }
        }
        return max ? false : true;
      }

      return false;
    })
    .test('video_is_empty', 'imageOrVideo', function (value) {
      return vars.video_field_touched && !value && !this.parent.project_images
        ? false
        : true;
    }),
  materials_used: Yup.string()
    .max(10000, 'max')
    .test('empty', 'required', value => {
      let is_empty = true;

      value &&
        value.split(',').forEach(material => {
          if (material) {
            is_empty = false;
          }
        });

      return !is_empty;
    }),
  category: Yup.string().min(1, 'min'),
  tags: Yup.mixed().test('unsupported', 'unsupported', tags => {
    if (tags) {
      tags = JSON.parse(tags);
      const re = /^[0-9A-Za-z\s\-]+$/;
      let unsupported = false;
      for (let tag of tags) {
        if (!re.test(tag.name)) {
          unsupported = true;
        }
      }
      return unsupported ? false : true;
    } else {
      return true;
    }
  }),
});
