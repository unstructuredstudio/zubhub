import { nanoid } from 'nanoid';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import {
  s3 as DO,
  doConfig,
  Compress,
  slugify,
} from '../../assets/js/utils/scripts';
import worker from 'workerize-loader!../../assets/js/removeMetaDataWorker'; // eslint-disable-line import/no-webpack-loader-syntax
import { site_mode, publish_type } from '../../assets/js/utils/constants';

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


let timer = null;
const timeoutConst = 2000;

const timeOutSave = (state, props, handleSetState, handleDisplayTime) => {
  clearTimeout(timer);
  timer = !props.match.params.id && setTimeout(function () {
    props.values.publish.type = 1;
    props.values.publish.visible_to = [];
    console.log("time out!");
    autoSaveProject(state, props, handleSetState);
    handleDisplayTime();
  }, timeoutConst);
}

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
export const handleTextFieldChange = (e, targetValue, state, props, handleSetState, handleDisplayTime) => {
  props.setStatus({ ...props.status, [e.target.id]: '' });
  props.handleChange(e);
  props.values.title = targetValue;
  timeOutSave(state, props, handleSetState, handleDisplayTime);
};

export const handleCategoryChange = (targetValue, state, props, handleSetState, handleDisplayTime) => {
  props.values.category = targetValue;
  !props.match.params.id && timeOutSave(state, props, handleSetState, handleDisplayTime);
}

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
 * @function handleDescFieldChange
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleDescFieldChange = (state, value, props, handleSetState, handleDisplayTime) => {
  if (value && value !== '<p><br></p>') {
    // second conditional is a guide for when quill is cleared.
    props.setStatus({ ...props.status, description: '' });
    props.setFieldValue('description', value, true);
  } else {
    props.setFieldValue('description', undefined, true);
  }
  props.values.description = value;
  timeOutSave(state, props, handleSetState, handleDisplayTime);

  handleDescFieldFocusChange(value, props, handleSetState);
};

export const handleDescFieldFocusChange = (value, props, handleSetState) => {
  props.setFieldTouched('description');
  if (!value) {
    handleSetState({ desc_input_is_focused: true });
  }
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
export const removeTag = (_, props, value, state, handleSetState, handleDisplayTime) => {
  let tags = props.values['tags'];
  tags = tags ? JSON.parse(tags) : [];
  tags = tags.filter(tag => tag.name !== value);
  props.setFieldValue('tags', JSON.stringify(tags));
  props.values.tags = JSON.stringify(tags);
  timeOutSave(state, props, handleSetState, handleDisplayTime);
};

/**
* @function handleImageFieldChange
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const handleImageFieldChange = (refs, props, state, handleSetState, handleDisplayTime) => {
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
  timeOutSave(state, props, handleSetState, handleDisplayTime);
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
export const handleAddMaterialFieldChange = (e, props, refs, state, handleSetState, handleDisplayTime) => {
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
  props.values.materials_used = value;
  timeOutSave(state, props, handleSetState, handleDisplayTime);
};

/**
* @function handleAddTags
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const handleAddTags = (e, props, add_tags_el, state, handleSetState, handleDisplayTime) => {
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
    props.values.tags = JSON.stringify(tags);
    e.currentTarget.value = '';
    if (e.currentTarget.focus) e.currentTarget.focus();
    if (add_tags_el) {
      add_tags_el.current.value = '';
      add_tags_el.current.focus();
    }
  }
  timeOutSave(state, props, handleSetState, handleDisplayTime);
  return { tag_suggestion_open: false, tag_suggestion: [] };
};

/**
 * @function buildPublishTypes
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @description - The order of the publish type options in the publish dropdown
 *   depends on what site_mode the deployment runs. This function helps select
 *   the appropriate order for the publish type options.
 * @param {Object} props.projects - projects redux store.
 * @param {Object} props.values - form values.
 * @returns {Object} - {publish_types:[...]} object with array of publish types as value
 */
export const buildPublishTypes = ({ projects, values, setFieldValue }) => {
  const { zubhub } = projects;
  let publish_types;
  if (zubhub?.site_mode === site_mode.PRIVATE) {
    publish_types = {
      publish_types: [
        {
          value: publish_type['Authenticated Creators'],
          name: 'Authenticated Creators',
        },
        { value: publish_type['Draft'], name: 'Draft' },
        { value: publish_type['Preview'], name: 'Preview' },
        { value: publish_type['Public'], name: 'Public' },
      ],
    };
  } else {
    publish_types = {
      publish_types: [
        { value: publish_type['Public'], name: 'Public' },
        { value: publish_type['Draft'], name: 'Draft' },
        {
          value: publish_type['Authenticated Creators'],
          name: 'Authenticated Creators',
        },
        { value: publish_type['Preview'], name: 'Preview' },
      ],
    };
  }

  //set initial form value for publish if it's undefined
  if (!values.publish) {
    const publish = {
      type: publish_types.publish_types[0].value,
      visible_to: [],
    };
    setFieldValue('publish', publish);
  }

  return publish_types;
};

/**
 * @function handleRemovePublishVisibleTo
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @description - Removes username from list of usernames in
 *   props.values.publish.visible_to
 * @param {Object} _ - dom event.
 * @param {Object} props.values - form values.
 * @param {Function} props.setFieldTouched - formik method to mark a form field as touched.
 * @param {Function} props.setFieldValue - formik method to set the value of a form field.
 * @param {string} value - username to be removed.
 */
export const handleRemovePublishVisibleTo = (_, props, value) => {
  let publish = props.values['publish'];
  const usernames = publish.visible_to.filter(username => username !== value);
  publish.visible_to = usernames;
  props.setFieldTouched('publish', true, true);
  props.setFieldValue('publish', publish);
};

/**
 * @function handleAddPublishVisibleTo
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @description - Add username from list of usernames in
 *   props.values.publish.visible_to
 * @param {Object} e - dom event.
 * @param {Object} props.values - form values.
 * @param {Function} props.setFieldTouched - formik method to mark a form field as touched.
 * @param {Function} props.setFieldValue - formik method to set the value of a form field.
 * @param {string} value - username to be removed.
 * @returns {Object} - object to reset the username suggestion dialog.
 */
export const handleAddPublishVisibleTo = (e, props, publish_visible_to_el) => {
  props.setFieldTouched('publish', true, true);
  let value = e.currentTarget.value.split(',');
  value[0] = value[0].trim();
  let publish = props.values['publish'];

  const exists =
    publish.visible_to.filter(username => username === value[0]).length > 0
      ? true
      : false;

  if (!exists && value.length > 1 && value[0]) {
    publish.visible_to.push(value[0]);
    props.setFieldValue('publish', publish);
    e.currentTarget.value = '';
    if (e.currentTarget.focus) e.currentTarget.focus();
    if (publish_visible_to_el) {
      publish_visible_to_el.current.value = '';
      publish_visible_to_el.current.focus();
    }
  }

  return {
    publish_visible_to_suggestion_open: false,
    publish_visible_to_suggestion: [],
  };
};

/**
 * @function handleSuggestPublishVisibleTo
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleSuggestPublishVisibleTo = (
  e,
  props,
  state,
  handleSetState,
) => {
  clearTimeout(vars.timer.id);
  const value = e.currentTarget.value;

  if (value !== '' && value.search(',') === -1) {
    vars.timer.id = setTimeout(() => {
      suggestPublishVisibleTo(value, props, handleSetState, state);
    }, 500);
  }
};

/**
 * @function suggestPublishVisibleTo
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const suggestPublishVisibleTo = (value, props, handleSetState, _) => {
  handleSetState({ publish_visible_to_suggestion_open: true });
  const res = props
    .suggestCreators({
      page: null,
      query_string: value,
      t: props.t,
    })
    .then(res => {
      let publish_visible_to_suggestion_open = false;
      let publish_visible_to_suggestion = [];
      if (res.creator_suggestion) {
        publish_visible_to_suggestion = res.creator_suggestion.map(creator => {
          return creator.username;
        });
        publish_visible_to_suggestion_open = true;
      }
      return {
        publish_visible_to_suggestion,
        publish_visible_to_suggestion_open,
      };
    });

  handleSetState(res);
};

/**
 * @function handlePublishFieldBlur
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handlePublishFieldBlur = (e, props) => {
  let obj = {
    type: e.target.value,
    visible_to: [],
  };

  props.setFieldValue('publish', obj, true);
  props.setStatus({ ...props.status, publish: '' });
};

/**
 * @function handlePublishFieldChange
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handlePublishFieldChange = (e, props) => {
  let obj = {
    type: e.target.value,
    visible_to: [],
  };

  props.setFieldValue('publish', obj, true);
  props.setStatus({ ...props.status, publish: '' });
};

/**
 * @function handleVideoSelectDone
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleVideoSelectDone = async (refs, props, state, handleSetState, handleDisplayTime) => {
  const { media_upload } = state;
  if (media_upload.videos_to_upload.length < 1) {
    refs.video_selection_feedback_el.current.innerText = '';
    return props.setFieldValue('video', '').then(() => {
      media_upload.videos_to_upload = [];
      media_upload.uploaded_videos_url = [];
      return { media_upload };
    });
  }
  timeOutSave(state, props, handleSetState, handleDisplayTime);
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
    props.setFieldTouched('publish');

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
        uploadProject(state, props, handleSetState, false);
      } else {
        vars.upload_in_progress = true;
        state.media_upload.upload_dialog = true;
        handleSetState({
          media_upload: {
            ...state.media_upload,
            upload_dialog: true,
            upload_percent: 0,
          },
        });

        const promises = [];

        // upload images
        for (
          let index = 0;
          index < state.media_upload.images_to_upload.length;
          index++
        ) {
          promises.push(
            uploadImage(
              state.media_upload.images_to_upload[index],
              state,
              props,
              handleSetState,
            ),
          );
        }

        // upload videos
        for (
          let index = 0;
          index < state.media_upload.videos_to_upload.length;
          index++
        ) {
          promises.push(
            uploadVideo(
              state.media_upload.videos_to_upload[index],
              state,
              props,
              handleSetState,
            ),
          );
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

            uploadProject(state, props, handleSetState, true);
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
      }
    });
  }
};

export const autoSaveProject = async (state, props, handleSetState) => {
  if (!props.auth.token) {
    props.history.push('/login');
  } else {
    // props.setFieldTouched('title');
    // props.setFieldTouched('description');
    // props.setFieldTouched('project_images');
    // props.setFieldTouched('video');
    // props.setFieldTouched('materials_used');
    // props.setFieldTouched('category');
    // props.setFieldTouched('tags');

    // vars.image_field_touched = true;
    // vars.video_field_touched = true;

    props.validateForm().then(errors => {
      if (
        (state.media_upload.uploaded_images_url.length !== 0 ||
          state.media_upload.uploaded_videos_url.length !== 0) &&
        !(
          state.media_upload.images_to_upload.length !== 0 ||
          state.media_upload.videos_to_upload.length !== 0
        )
      ) {
        vars.upload_in_progress = true;
        uploadProject(state, props, handleSetState, false);
      } else {
        vars.upload_in_progress = true;
        state.media_upload.upload_dialog = false;
        handleSetState({
          media_upload: {
            ...state.media_upload,
            upload_dialog: true,
            upload_percent: 0,
          },
        });

        const promises = [];

        // upload images
        for (
          let index = 0;
          index < state.media_upload.images_to_upload.length;
          index++
        ) {
          promises.push(
            uploadImage(
              state.media_upload.images_to_upload[index],
              state,
              props,
              handleSetState,
            ),
          );
        }

        // upload videos
        for (
          let index = 0;
          index < state.media_upload.videos_to_upload.length;
          index++
        ) {
          promises.push(
            uploadVideo(
              state.media_upload.videos_to_upload[index],
              state,
              props,
              handleSetState,
            ),
          );
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

            uploadProject(state, props, handleSetState, false);
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
      }
    });
  }
}


/**
* @function uploadProject
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const uploadProject = async (state, props, handleSetState, redirect) => {
  const { media_upload } = state;
  media_upload.upload_dialog = false;
  handleSetState({ media_upload });

  // let materials_used;
  // if (!redirect && !props.values['materials_used']) {
  //   materials_used = "place holder";
  // } else {
  //   materials_used = props.values['materials_used']
  //     ?.split(',')
  //     .filter(value => (value ? true : false))
  //     .join(',');
  // }

  const materials_used = props.values['materials_used']
    ?.split(',')
    .filter(value => (value ? true : false))
    .join(',');

  const tags = props.values['tags']
    ? JSON.parse(props.values['tags']).filter(tag => (tag.name ? true : false))
    : [];

  console.log("id:", props.match.params);
  const create_or_update = props.match.params.id
    ? props.updateProject
    : props.createProject;

  create_or_update({
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
  }, redirect).then((res) => console.log(res))
    .catch(error => {
      handleSetState({
        media_upload: {
          ...state.media_upload,
          upload_dialog: false,
        },
      });
      // const messages = JSON.parse(error.message);
      // if (typeof messages === 'object') {
      //   const server_errors = {};
      //   Object.keys(messages).forEach(key => {
      //     if (key === 'non_field_errors') {
      //       server_errors['non_field_errors'] = messages[key][0];
      //     } else {
      //       server_errors[key] = messages[key][0];
      //     }
      //   });
      //   props.setStatus({ ...server_errors });
      // } else {
      //   props.setStatus({
      //     non_field_errors: props.t('createProject.errors.unexpected'),
      //   });
      // }
    })
    .finally(() => {
      vars.upload_in_progress = false; // flag to prevent attempting to upload a project when an upload is already in progress
    });
};

/**
 * @function uploadVideo
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const uploadVideo = (video, state, props, handleSetState) => {
  if (
    typeof video === 'string' &&
    video.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
    )
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

/**
 * @function uploadVideoToLocal
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
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
    const um = new UploadMedia(
      'video',
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

/**
 * @function uploadVideoToCloudinary
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const uploadVideoToCloudinary = (
  video,
  state,
  props,
  handleSetState,
) => {
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
        const um = new UploadMedia(
          'video',
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
    } else {
      return Promise.reject('');
    }
  });
};

/**
 * @function uploadImage
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
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

/**
 * @function uploadImageToLocal
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
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

/**
 * @function uploadImageToDO
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
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
          refs.desc_el.current.editor.root.innerHTML = obj.project.description;
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

        if (refs.publish_type_el.current && obj.project.publish) {
          const publish = {
            type: obj.project.publish.type,
            visible_to: obj.project.publish.visible_to.map(
              creator => creator.username,
            ),
          };
          props.setFieldValue('publish', publish, true);
        }

        media_upload.uploaded_images_url = obj.project.images;
        media_upload.uploaded_videos_url = obj.project.video
          ? [obj.project.video]
          : [];

        return {
          loading: false,
          materials_used: obj.project.materials_used && obj.project.materials_used.split(','),
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
export const handleVideoFieldChange = async (e, refs, props, state, handleSetState, handleDisplayTime) => {
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
        timeOutSave(state, props, handleSetState, handleDisplayTime);
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

// export const validationSchema = Yup.object().shape({
//   is_autosave: Yup.boolean(),
//   title: Yup.string().max(100, 'max').required('required').when(
//     'is_autosave', {
//     is: false,
//     then: Yup.string().required("required"),
//     otherwise: Yup.string(),
//   }
//   ),
//   description: Yup.string().max(10000, 'max').when(
//     'is_autosave', {
//     is: false,
//     then: Yup.string().required("required"),
//     otherwise: Yup.string(),
//   }
//   ),
//   // description: Yup.string().max(10000, 'max').required("required"),
//   project_images: Yup.mixed()
//     .test('not_an_image', 'onlyImages', value => {
//       if (value) {
//         let not_an_image = false;
//         for (let index = 0; index < value.files.length; index++) {
//           if (value.files[index].type.split('/')[0] !== 'image') {
//             not_an_image = true;
//           }
//         }
//         return not_an_image ? false : true;
//       } else {
//         return true;
//       }
//     })
//     .test('too_many_images', 'tooManyImages', value => {
//       if (value) {
//         return value.files.length > 10 ? false : true;
//       } else {
//         return true;
//       }
//     })
//     .test('image_size_too_large', 'imageSizeTooLarge', value => {
//       if (value) {
//         let image_size_too_large = false;
//         for (let index = 0; index < value.files.length; index++) {
//           if (value.files[index].size / 1000 > 10240) {
//             image_size_too_large = true;
//           }
//         }
//         return image_size_too_large ? false : true;
//       } else {
//         return true;
//       }
//     })
//     .when(
//       'is_autosave', {
//       is: false,
//       then: Yup.mixed().test('image_is_empty', 'imageOrVideo', function (value) {
//         return vars.image_field_touched && !value && !this.parent.video
//           ? false
//           : true;
//       }),
//       otherwise: Yup.mixed(),
//     }
//     )
//   ,
//   video: Yup.mixed()
//     .test('should_be_video_file', 'shouldBeVideoFile', value => {
//       if (!value) {
//         return true;
//       } else if (typeof value === 'string') {
//         return true;
//       } else if (typeof value === 'object') {
//         let not_a_video = false;
//         for (let index = 0; index < value.files.length; index++) {
//           if (value.files[index].type.split('/')[0] !== 'video') {
//             not_a_video = true;
//           }
//         }
//         return not_a_video ? false : true;
//       }
//       return false;
//     })
//     .test('should_be_url', 'shouldBeURL', value => {
//       if (!value) {
//         return true;
//       } else if (typeof value === 'object') {
//         return true;
//       } else if (typeof value === 'string') {
//         const res = value.match(
//           /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}(\.|:)[a-z0-9]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
//         );
//         return res !== null ? true : false;
//       }

//       return false;
//     })
//     .test('max-video-url-length', 'maxVideoURLLength', value => {
//       if (!value) {
//         return true;
//       } else if (typeof value === 'object') {
//         return true;
//       } else if (typeof value === 'string') {
//         return value.length > 2048 ? false : true;
//       }

//       return false;
//     })
//     .test('max-video-file-size', 'maxVideoFileSize', value => {
//       if (!value) {
//         return true;
//       } else if (typeof value === 'string') {
//         return true;
//       } else if (typeof value === 'object') {
//         let max = false;
//         for (let index = 0; index < value.files.length; index++) {
//           if (value.files[index].size / 1000 > 60240) {
//             max = true;
//           }
//         }
//         return max ? false : true;
//       }

//       return false;
//     })
//     .when(
//       'is_autosave', {
//       is: false,
//       then: Yup.mixed().test('video_is_empty', 'imageOrVideo', function (value) {
//         return vars.video_field_touched && !value && !this.parent.project_images
//           ? false
//           : true;
//       }),
//       otherwise: Yup.mixed(),
//     }
//     ),
//   materials_used: Yup.string()
//     .max(10000, 'max')
//     .when(
//       'is_autosave', {
//       is: false,
//       then: Yup.string().test('empty', 'required', value => {
//         let is_empty = true;

//         value &&
//           value.split(',').forEach(material => {
//             if (material) {
//               is_empty = false;
//             }
//           });

//         return !is_empty;
//       }),
//       otherwise: Yup.string()
//     }
//     )
//   ,
//   category: Yup.string().min(1, 'min'),
//   tags: Yup.mixed().test('unsupported', 'unsupported', tags => {
//     if (tags) {
//       tags = JSON.parse(tags);
//       const re = /^[0-9A-Za-z\s\-]+$/;
//       let unsupported = false;
//       for (let tag of tags) {
//         if (!re.test(tag.name)) {
//           unsupported = true;
//         }
//       }
//       return unsupported ? false : true;
//     } else {
//       return true;
//     }
//   }),
// });

export const validationSchema = Yup.object().shape({
  is_autosave: Yup.boolean(),
  title: Yup.string().max(100, 'max').required('required'),
  description: Yup.string().max(10000, 'max').required('required'),
  project_images: Yup.mixed()
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
    })
    .test('image_is_empty', 'imageOrVideo', function (value) {
      return vars.image_field_touched && !value && !this.parent.video
        ? false
        : true;
    })
  ,
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
    }).test('video_is_empty', 'imageOrVideo', function (value) {
      return vars.video_field_touched && !value && !this.parent.project_images
        ? false
        : true;
    }),
  materials_used: Yup.string()
    .max(10000, 'max')
    .when(
      'is_autosave', {
      is: false,
      then: Yup.string().test('empty', 'required', value => {
        let is_empty = true;

        value &&
          value.split(',').forEach(material => {
            if (material) {
              is_empty = false;
            }
          });

        return !is_empty;
      }),
      otherwise: Yup.string()
    }
    )
  ,
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
  publish: Yup.mixed()
    .test('visible_to_required', 'visible_to_required', publish => {
      if (
        publish.type === publish_type['Preview'] &&
        publish.visible_to.length < 1
      ) {
        return false;
      } else {
        return true;
      }
    })
    .test('visible_to_unsupported', 'visible_to_unsupported', publish => {
      const re = /^[a-z0-9_-]{3,16}$/i;
      let unsupported = false;
      for (let username of publish.visible_to) {
        if (!re.test(username)) {
          unsupported = true;
        }
      }
      return unsupported ? false : true;
    }),
});

/**
 * @class UploadMedia
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
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
