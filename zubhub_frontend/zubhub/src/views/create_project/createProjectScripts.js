import { nanoid } from 'nanoid';
import * as Yup from 'yup';
import { s3 as DO, doConfig, Compress, slugify } from '../../assets/js/utils/scripts';
import worker from 'workerize-loader!../../assets/js/removeMetaDataWorker'; // eslint-disable-line import/no-webpack-loader-syntax

/**
* @constant vars
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe constant's function
*/
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


/**
* @function getCategories
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const getCategories = props => {
  return props.getCategories({ t: props.t });
};


/**
* @function handleTextFieldChange
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
let timer = null;
const timeoutConst = 5000;
export const handleTextFieldChange = (e, state, props, handleSetState) => {
  props.setStatus({ ...props.status, [e.target.id]: '' });
  props.handleChange(e);
  clearTimeout(timer);
  timer = setTimeout(function () {
    // props.values contain the actual form data 
    console.log("time out!");
    uploadProject(state, props, handleSetState, false);
  }, timeoutConst);
};



/**
* @function handleTextFieldBlur
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const handleTextFieldBlur = (e, props) => {
  props.setStatus({ ...props.status, [e.target.id]: '' });
  props.handleBlur(e);
};


/**
* @function handleMaterialsUsedFieldBlur
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const handleMaterialsUsedFieldBlur = props => {
  props.setStatus({ ...props.status, materials_used: '' });
  props.setFieldTouched('materials_used', true);
};


/**
* @function removeMetaData
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const removeMetaData = (images, state, handleSetState) => {
  const newWorker = worker();
  newWorker.removeMetaData(images);
  newWorker.addEventListener('message', e => {
    Compress(e.data, state, handleSetState);
  });
};


/**
* @function handleImageButtonClick
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const handleImageButtonClick = (e, props, refs) => {
  e.preventDefault();
  refs.image_el.current.click();
  props.setFieldTouched('project_images');
};


/**
* @function handleVideoButtonClick
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const handleVideoButtonClick = (e, props, bool) => {
  e.preventDefault();
  props.setFieldTouched('video');
  return { video_upload_dialog_open: !bool };
};



/**
* @function handleDescTooltipOpen
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const handleDescTooltipOpen = () => {
  return { desc_tool_tip_open: true };
};


/**
* @function handleDescTooltipClose
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const handleDescTooltipClose = () => {
  return { desc_tool_tip_open: false };
};



/**
* @function handleSelectVideoFileChecked
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const handleSelectVideoFileChecked = el => {
  el.click();
  return { select_video_file: true };
};



/**
* @function handleSuggestTags
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const handleSuggestTags = (e, props, state, handleSetState) => {
  clearTimeout(vars.timer.id);
  const value = e.currentTarget.value;

  if (value !== '' && value.search(',') === -1) {
    vars.timer.id = setTimeout(() => {
      suggestTags(value, props, handleSetState, state);
    }, 500);
  }
};



/**
* @function suggestTags
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const suggestTags = (value, props, handleSetState, _) => {
  handleSetState({ tag_suggestion_open: true });
  handleSetState(props.suggestTags({ value, t: props.t }));
};


/**
* @function addMaterialsUsedNode
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const addMaterialsUsedNode = (e, props) => {
  e.preventDefault();
  let materials_used = props.values['materials_used'];
  if (!materials_used) {
    props.setFieldValue('materials_used', ',,,');
  } else {
    props.setFieldValue('materials_used', materials_used.concat(','));
  }
};


/**
* @function removeTag
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const removeTag = (_, props, value) => {
  let tags = props.values['tags'];
  tags = tags ? JSON.parse(tags) : [];
  tags = tags.filter(tag => tag.name !== value);
  props.setFieldValue('tags', JSON.stringify(tags));
};



/**
* @function handleImageFieldChange
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const handleImageFieldChange = (refs, props, state, handleSetState) => {
  refs.image_count_el.current.innerText = `${refs.image_el.current.files.length
    } ${props.t(
      `createProject.inputs.${refs.image_el.current.files.length < 2 ? 'image' : 'images'
      }`,
    )}`;

  props.setFieldValue('project_images', refs.image_el.current).then(errors => {
    if (!errors['project_images']) {
      removeMetaData(refs.image_el.current.files, state, handleSetState);
    }
  });

  props.setStatus({ ...props.status, images: '' });
};


/**
* @function handleVideoFieldCancel
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const handleVideoFieldCancel = async (refs, props, state) => {
  refs.video_selection_feedback_el.current.innerText = '';

  return props.setFieldValue('video', '').then(() => {
    const { media_upload } = state;
    media_upload.videos_to_upload = [];
    media_upload.uploaded_videos_url = [];
    return { media_upload };
  });
};


/**
* @function handleAddMaterialFieldChange
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
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


/**
* @function handleAddTags
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
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



/**
* @function handleVideoSelectDone
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
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


/**
* @function initUpload
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const initUpload = (e, state, props, handleSetState) => {
  e.preventDefault();
  console.log(props,state);
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
        vars.upload_in_progress = true;
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



/**
* @function uploadProject
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const uploadProject = async (state, props, handleSetState, redirect = true) => {
  const { media_upload } = state;
  media_upload.upload_dialog = false;
  handleSetState({ media_upload });

  console.log(props, state);

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

  const data = {
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
  };
  console.log("data", data);

  await create_or_update(data, redirect).catch(error => {
    console.log(error);
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

/**
* @function uploadVideo
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
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
    const args = {
      t: props.t,
      token: props.auth.token
    };

    const res = await props.shouldUploadToLocal(args);

    if (res && res.local === true) {
      uploadVideoToLocal(video, state, props, handleSetState);
    } else if (res && res.local === false) {
      uploadVideoToCloudinary(video, state, props, handleSetState);
    };
  }
};



/**
* @function uploadVideoToLocal
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const uploadVideoToLocal = (video, state, props, handleSetState) => {
  let url = process.env.REACT_APP_NODE_ENV === 'production'
    ? process.env.REACT_APP_BACKEND_PRODUCTION_URL + '/api/'
    : process.env.REACT_APP_BACKEND_DEVELOPMENT_URL + '/api/';
  url = url + "upload-file-to-local/";

  let key = nanoid();
  key = key.slice(0, Math.floor(key.length / 3));
  key = `videos/${slugify(props.auth.username)}-${slugify(video.name)}-${key}`;

  const formData = new FormData();
  formData.append('file', video);
  formData.append('key', key);

  const um = new UploadMedia("video", url, formData, state, props, handleSetState);
  um.upload();
};


/**
* @function uploadVideoToCloudinary
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const uploadVideoToCloudinary = async (video, state, props, handleSetState) => {

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

    const um = new UploadMedia("video", url, formData, state, props, handleSetState);
    um.upload();

  } else {
    const { media_upload } = state;
    media_upload.upload_dialog = false;

    handleSetState({
      media_upload,
    });
  }
};


/**
* @function uploadImage
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const uploadImage = async (image, state, props, handleSetState) => {
  debugger;
  const args = {
    t: props.t,
    token: props.auth.token
  };

  const res = await props.shouldUploadToLocal(args);

  if (res && res.local === true) {
    uploadImageToLocal(image, state, props, handleSetState);
  } else if (res && res.local === false) {
    uploadImageToDO(image, state, props, handleSetState);
  }

};


/**
* @function uploadImageToLocal
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const uploadImageToLocal = (image, state, props, handleSetState) => {

  let url = process.env.REACT_APP_NODE_ENV === 'production'
    ? process.env.REACT_APP_BACKEND_PRODUCTION_URL + '/api/'
    : process.env.REACT_APP_BACKEND_DEVELOPMENT_URL + '/api/';
  url = url + "upload-file-to-local/";

  const formData = new FormData();
  formData.append('file', image);
  formData.append('key', `project_images/${nanoid()}`);
  const um = new UploadMedia("image", url, formData, state, props, handleSetState);
  um.upload();
};


/**
* @function uploadImageToDO
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const uploadImageToDO = (image, state, props, handleSetState) => {

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


/**
* @function getProject
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
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
          refs.image_count_el.current.innerText = `${obj.project.images.length
            } ${props.t(
              `createProject.inputs.${obj.project.images.length < 2 ? 'image' : 'images'
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


/**
* @function handleVideoFieldChange
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
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


/**
* @function checkMediaFilesErrorState
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
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


/**
* @object validationSchema
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe object's function
*/
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
          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}(\.|:)[a-z0-9]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
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


/**
* @function UploadMedia
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export class UploadMedia {

  constructor(type, url, formData, state, props, handleSetState) {
    this.xhr = new XMLHttpRequest();
    this.type = type;
    this.url = url;
    this.formData = formData;
    this.state = state;
    this.props = props;
    this.handleSetState = handleSetState;
    this.xhr.upload.onload = this.uploadOnLoad;
    this.xhr.onreadystatechange = this.onReadyStateChange;
    this.xhr.upload.onerror = this.uploadOnerror;
    this.xhr.upload.onprogress = this.uploadOnprogress;
  };


  uploadOnLoad = () => {
    if (this.xhr.status !== 200 && this.xhr.readyState === 4) {
      const { media_upload } = this.state;
      media_upload.upload_dialog = false;

      this.handleSetState({
        error: this.props.t('createProject.errors.unexpected'),
        media_upload,
      });
    }
  };

  onReadyStateChange = () => {
    if (this.xhr.status === 200 && this.xhr.readyState === 4 && this.type === "video") {

      const data = JSON.parse(this.xhr.response);
      const secure_url = data.secure_url;
      const { media_upload } = this.state;

      media_upload.uploaded_videos_url = [secure_url];
      media_upload.successful_uploads = media_upload.successful_uploads + 1;

      this.handleSetState({ media_upload });

    } else if (this.xhr.status === 200 && this.xhr.readyState === 4 && this.type === "image") {

      const data = JSON.parse(this.xhr.response);
      const secure_url = data.Location;
      const public_id = data.Key;
      const { media_upload } = this.state;

      media_upload.uploaded_images_url.push({
        image_url: secure_url,
        public_id,
      });
      media_upload.successful_uploads = media_upload.successful_uploads + 1;

      this.handleSetState({ media_upload });

    }
  };

  uploadOnerror = e => {
    const { media_upload } = this.state;
    media_upload.upload_dialog = false;

    this.handleSetState({
      error: this.props.t('createProject.errors.unexpected'),
      media_upload,
    });
  };

  uploadOnprogress = e => {
    const progress = Math.round((e.loaded * 100.0) / e.total);
    const { media_upload } = this.state;
    media_upload.upload_info[this.formData.get("file").name] = progress;

    let total = 0;
    Object.keys(media_upload.upload_info).forEach(each => {
      total = total + media_upload.upload_info[each];
    });

    total = total / Object.keys(media_upload.upload_info).length;
    media_upload.upload_percent = total;

    this.handleSetState({ media_upload });
  };

  upload = () => {
    this.xhr.open('POST', this.url);

    if (!this.url.startsWith(process.env.REACT_APP_VIDEO_UPLOAD_URL)) {
      this.xhr.xsrfCookieName = 'csrftoken';
      this.xhr.xsrfHeaderName = 'X-CSRFToken';
      this.xhr.setRequestHeader("Authorization", `Token ${this.props.auth.token}`);
      this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    };

    this.xhr.send(this.formData)
  }
};