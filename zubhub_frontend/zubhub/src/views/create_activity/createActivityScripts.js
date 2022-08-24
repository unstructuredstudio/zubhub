import * as Yup from 'yup';
import ZubhubAPI from '../../api';
import {
  FormMediaUpload,
  MediaUpload,
  FileField,
} from '../../components/upload_file/uploadFileScripts';
const API = new ZubhubAPI();

// ^/file validation functions
const isImage = value => {
  if (value) {
    let not_an_image = false;
    for (let index = 0; index < value.length; index++) {
      if (value[index].type.split('/')[0] !== 'image') {
        not_an_image = true;
      }
    }
    return !not_an_image;
  } else {
    return true;
  }
};

const tooManyImages = value => {
  return value ? value.length <= 10 : true;
};

const imageSizeTooLarge = value => {
  if (value) {
    let image_size_too_large = false;
    for (let index = 0; index < value.length; index++) {
      if (value[index].size / 1000 > 10240) {
        image_size_too_large = true;
      }
    }
    return !image_size_too_large;
  } else {
    return true;
  }
};

const allEmpty = arr => {
  let allEmptyValues = true;
  if (arr) {
    arr.forEach(value => {
      if (value && value !== '') {
        allEmptyValues = false;
      }
    });
    return !allEmptyValues;
  } else {
    return true;
  }
};
const imageValidationSchema = Yup.mixed()
  .test('image_is_empty', 'image_is_empty', function (value) {
    return !value ? false : true;
  })
  .test('not_an_image', 'onlyImages', value => isImage(value))
  .test('image_size_too_large', 'imageSizeTooLarge', value =>
    imageSizeTooLarge(value),
  );
// file validation functions /$
export const validationSchema = Yup.object().shape({
  title: Yup.string().max(100, 'max').required('required'),
  motivation: Yup.string().max(10000, 'max').required('required'),
  learningGoals: Yup.string().max(10000, 'max').required('required'),
  facilitationTips: Yup.string().max(10000, 'max').required('required'),
  creationSteps: Yup.mixed().test('required1', value => {
    return value ? value.length > 0 : false;
  }),
  inspiringArtistFullName: Yup.string().max(100, 'max'),
  inspiringArtist: Yup.string().max(10000, 'max').required('required'),
  inspiringExemplesDescriptions: Yup.string().max(100, 'max'),
  inspiringExemplesCredits: Yup.string().max(100, 'max'),
  materialsUsed: Yup.mixed().test('required1', 'required1', value =>
    allEmpty(value),
  ),
  activityImages: Yup.mixed()
    .test('not_an_image', 'onlyImages', value => isImage(value))
    .test('too_many_images', 'tooManyImages', value => tooManyImages(value))
    .test('image_size_too_large', 'imageSizeTooLarge', value =>
      imageSizeTooLarge(value),
    ),
  materialsUsedImages: Yup.mixed()
    .test('not_an_image', 'onlyImages', value => isImage(value))
    .test('too_many_images', 'tooManyImages', value => tooManyImages(value))
    .test('image_size_too_large', 'imageSizeTooLarge', value =>
      imageSizeTooLarge(value),
    ),
  inspiringExemplesImages: Yup.lazy(value => {
    if (Array.isArray(value)) {
      return Yup.array().of(imageValidationSchema);
    }
    return imageValidationSchema;
  }),
  inspiringArtistImage: Yup.mixed()
    .test('image_is_empty', 'image_is_empty', function (value) {
      return !value ? false : true;
    })
    .test('not_an_image', 'onlyImages', value => isImage(value))
    .test('too_many_images', 'tooManyImages', value => tooManyImages(value))
    .test('image_size_too_large', 'imageSizeTooLarge', value =>
      imageSizeTooLarge(value),
    ),
});

export const handleInputTextFieldChange = (
  name,
  value,
  setInputTextFieldFocused,
  setFieldValue,
  setFieldTouched,
) => {
  setInputTextFieldFocused(true);
  if (value && value !== '<p><br></p>') {
    //props.setStatus({ ...props.status, [label]: '' });
    setFieldValue(name, value, true);
  } else {
    setFieldValue(name, undefined, true);
  }
  setFieldTouched(name, true);
};

export const handleInputTextFieldBlur = (
  name,
  formikValues,
  setNewActivityObject,
  setInputTextFieldFocused,
  validateSteps,
) => {
  validateSteps();
  setNewActivityObject(newActivity => ({
    ...newActivity,
    [name]: formikValues[name],
  }));
  setInputTextFieldFocused(false);
};

//////////////// serialize activity object to the expected format in backend /////////////////////////

const fieldHasUrls = (mediaUpload, field) => {
  return mediaUpload.fileFields[field] &&
    Object.keys(mediaUpload.fileFields[field].urls).length > 0
    ? true
    : false;
};

const getFieldUrls = (mediaUpload, field) => {
  return fieldHasUrls(mediaUpload, field)
    ? mediaUpload.fileFields[field].urls
    : {};
};

const combineInspiringExamplesData = (descriptions, credits, urls) => {
  let inspiringExamples = [];

  Object.keys(urls).forEach(index => {
    let example = {};
    example['image'] = urls[index];
    example['description'] = descriptions[index] ? descriptions[index] : '';
    example['credit'] = credits[index] ? credits[index] : '';
    inspiringExamples.push(example);
  });
  return inspiringExamples;
};

const combineMakingStepsData = (descriptions, urls) => {
  let makingSteps = [];
  console.log('descriptions and urls,', descriptions, urls);

  descriptions?.forEach((item, index) => {
    let step = {};
    step['image'] = urls[index] ? urls[index] : null;
    step['description'] = descriptions[index];
    step['step_order'] = parseInt(index, 10) + 1;
    makingSteps.push(step);
  });
  return makingSteps;
};

const combineInspiringArtistData = (state, mediaUpload) => {
  let inspiringArtist = {};
  inspiringArtist['name'] = state['inspiringArtistFullName']
    ? state['inspiringArtistFullName']
    : '';
  inspiringArtist['short_biography'] = state['inspiringArtist']
    ? state['inspiringArtist']
    : '';
  inspiringArtist['image'] = fieldHasUrls(mediaUpload, 'inspiringArtistImage')
    ? getFieldUrls(mediaUpload, 'inspiringArtistImage')[0]
    : null;
  return inspiringArtist;
};

const refactorFieldsData = (state, mediaUpload) => {
  const createActivityArgs = {};
  createActivityArgs['title'] = state.title;
  createActivityArgs['motivation'] = state.motivation;
  createActivityArgs['learning_goals'] = state.learningGoals;
  createActivityArgs['materials_used'] = state.materialsUsed
    ? state.materialsUsed.join(',')
    : '';
  createActivityArgs['facilitation_tips'] = state.facilitationTips;
  createActivityArgs['video'] = fieldHasUrls(mediaUpload, 'video')
    ? getFieldUrls(mediaUpload, 'video')[0]
    : '';
  createActivityArgs['materials_used_image'] = fieldHasUrls(
    mediaUpload,
    'materialsUsedImage',
  )
    ? getFieldUrls(mediaUpload, 'materialsUsedImage')[0]
    : null;
  createActivityArgs['images'] = fieldHasUrls(mediaUpload, 'activityImages')
    ? Object.values(getFieldUrls(mediaUpload, 'activityImages')).map(image => ({
        image: image,
      }))
    : null;
  createActivityArgs['making_steps'] = combineMakingStepsData(
    state.creationSteps,
    getFieldUrls(mediaUpload, 'makingStepsImages'),
  );
  createActivityArgs['inspiring_examples'] = combineInspiringExamplesData(
    state.inspiringExemplesDescriptions,
    state.inspiringExemplesCredits,
    getFieldUrls(mediaUpload, 'inspiringExemplesImages'),
  );
  createActivityArgs['inspiring_artist'] = combineInspiringArtistData(
    state,
    mediaUpload,
  );
  console.log('refactor args', createActivityArgs);
  return createActivityArgs;
};

///////////////////////////////// deserialize activity object to be displayed for update in form fields //////////////////////

const simpleFieldsMap = {
  title: { key: 'title', type: 'simple', field: 'text' },
  motivation: { key: 'motivation', type: 'simple', field: 'text' },
  learningGoals: { key: 'learning_goals', type: 'simple', field: 'text' },
  facilitationTips: { key: 'facilitation_tips', type: 'simple', field: 'text' },
  inspiringArtistFullName: {
    key: 'inspiring_artist',
    type: 'simple',
    field: 'text',
    subKey: 'name',
  },
  inspiringArtist: {
    key: 'inspiring_artist',
    type: 'simple',
    field: 'text',
    subKey: 'short_biography',
  },
  inspiringExemplesDescriptions: {
    key: 'inspiring_examples',
    type: 'multiple',
    field: 'text',
    subKey: 'description',
  },
  inspiringExemplesCredits: {
    key: 'inspiring_examples',
    type: 'multiple',
    field: 'text',
    subKey: 'credit',
  },
  creationSteps: {
    key: 'making_steps',
    type: 'multiple',
    field: 'text',
    subKey: 'description',
  },
};

const mediaFieldMap = {
  video: {
    key: 'video',
    type: 'simple',
    field: 'file',
    count: 'single',
  },
  materialsUsedImage: {
    key: 'materials_used_image',
    type: 'simple',
    field: 'file',
    count: 'single',
  },
  activityImages: {
    key: 'images',
    type: 'simple',
    field: 'file',
    count: 'multiple',
    subKey: 'image',
  },
  inspiringArtistImage: {
    key: 'inspiring_artist',
    type: 'simple',
    field: 'file',
    subKey: 'image',
    count: 'single',
  },
  inspiringExemplesImages: {
    key: 'inspiring_examples',
    type: 'multiple',
    field: 'file',
    subKey: 'image',
    count: 'multiple',
  },
  makingStepsImages: {
    key: 'making_steps',
    type: 'multiple',
    field: 'file',
    subKey: 'image',
    count: 'multiple',
  },
};

export const deserializeFieldsData = (
  activity,
  setFieldValue,
  setFieldTouched,
) => {
  let state = {};
  let mediaUpload = new MediaUpload();

  Object.entries(mediaFieldMap).forEach(([fieldName, fieldInObject]) => {
    if (activity[fieldInObject.key]) {
      if (fieldInObject.count === 'single') {
        let image = fieldInObject.subKey
          ? activity[fieldInObject.key][fieldInObject.subKey]
          : activity[fieldInObject.key];
        if (image !== null && image !== '') {
          mediaUpload.serializeImage(fieldName, image, 0);
        }
      } else {
        activity[fieldInObject.key].forEach((object, index) => {
          let image = fieldInObject.subKey
            ? object[fieldInObject.subKey]
            : object;
          if (image !== null && image !== '') {
            mediaUpload.serializeImage(fieldName, image, index);
          }
        });
        // if (fieldInObject.type === 'simple') {
        //   mediaUpload.fileFields[fieldName].updateLength(
        //     activity[fieldInObject.key].length - 1,
        //     0,
        //   );
        // }
      }
    }
  });

  Object.entries(simpleFieldsMap).forEach(([key, value]) => {
    if (activity[value.key]) {
      if (value.type === 'simple') {
        if (value.subKey) {
          state[key] = activity[value.key][value.subKey];
          setFieldValue(key, activity[value.key][value.subKey], true);
        } else {
          state[key] = activity[value.key];
          setFieldValue(key, activity[value.key], true);
        }
      } else {
        state[key] = [];
        activity[value.key].forEach((item, index) => {
          state[key][index] = item[value.subKey];
          setFieldValue(`${key}[${index}]`, item[value.subKey], true);
        });
      }
    }
  });

  state['materialsUsed'] = activity['materials_used'].split(',');
  state['materialsUsed'].forEach((value, index) => {
    setFieldValue(`materialsUsed[${index}]`, value, true);
  });
  state['mediaUpload'] = mediaUpload;
  return state;
};

export const deleteActivity = (token, id) => {
  API.deleteActivity({ token: token, id: id });
};

export const initUpload = async (e, state, props, handleSetState) => {
  e.preventDefault();
  if (!props.auth.token) {
    props.history.push('/login');
  } else {
    let uploadedMediaPromises = FormMediaUpload(
      state,
      props.auth,
      handleSetState,
    );
    console.log(uploadedMediaPromises);

    const result = await Promise.all(uploadedMediaPromises);
    console.log('result of upload', result);
    let mediaUpload = state.mediaUpload;
    result.forEach(each => {
      mediaUpload.addUrlToField(each.field, each.url, each.index);
    });
    console.log('media upload after loading', mediaUpload);
    const args = refactorFieldsData(state, mediaUpload);
    if (!state.id) {
      const apiResponse = await API.createActivity(props.auth.token, args);
      console.log('api response', apiResponse);
    } else {
      const apiResponse = await API.updateActivity(
        props.auth.token,
        state.id,
        args,
      );
      console.log('api response', apiResponse);
    }
  }
};
