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
    console.log('value from validations', value);
    let not_an_image = false;
    if (value['length']) {
      for (let index = 0; index < value.length; index++) {
        console.log('value from validations array ', value);
        if (value[index]) {
          if (!value[index]['file_url']) {
            if (value[index].type.split('/')[0] !== 'image') {
              not_an_image = true;
            }
          }
        }
      }
    } else {
      if (value) {
        console.log('value from validations not array', value);
        if (!value['file_url']) {
          if (value.type.split('/')[0] !== 'image') {
            not_an_image = true;
          }
        }
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
    if (!value['file_url']) {
      for (let index = 0; index < value.length; index++) {
        if (value[index]) {
          if (value[index].size / 1000 > 10240) {
            image_size_too_large = true;
          }
        }
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
      if ((value && value !== '') || (value && Object.keys(value).length > 0)) {
        allEmptyValues = false;
      }
    });
    return !allEmptyValues;
  } else {
    return false;
  }
};
const imageValidationSchema = Yup.mixed()
  // .test('image_is_empty', 'image_is_empty', function (value) {
  //   return !value ? false : true;
  // })
  .test('not_an_image', 'onlyImages', value => isImage(value))
  .test('image_size_too_large', 'imageSizeTooLarge', value =>
    imageSizeTooLarge(value),
  );
// file validation functions /$
export const validationSchema = Yup.object().shape({
  title: Yup.string().max(100, 'max').required('required'),
  motivation: Yup.string().max(10000, 'max').required('required'),
  learning_goals: Yup.string().max(10000, 'max').required('required'),
  facilitation_tips: Yup.string().max(10000, 'max').required('required'),
  making_steps: Yup.array()
    .of(
      Yup.object().shape({
        description: Yup.string().max(10000, 'max'),
        image: Yup.lazy(value => {
          return imageValidationSchema;
        }),
      }),
    )
    .test({
      message: 'required1',
      test: arr => allEmpty(arr),
    }),
  inspiring_artist: Yup.object().shape({
    name: Yup.string().max(100, 'max'),
    short_biography: Yup.string().max(10000, 'max'),
    image: Yup.lazy(value => {
      return imageValidationSchema;
    }),
  }),

  inspiring_examples: Yup.array().of(
    Yup.object().shape({
      description: Yup.string().max(1000, 'max'),
      credit: Yup.string().max(100, 'max'),
      image: Yup.lazy(value => {
        return imageValidationSchema;
      }),
    }),
  ),

  materials_used: Yup.array()
    .of(Yup.string().max(100, 'max'))
    .test({
      message: 'required1',
      test: arr => allEmpty(arr),
    }),
  activity_images: Yup.mixed()
    .test('not_an_image', 'onlyImages', value => isImage(value))
    .test('too_many_images', 'tooManyImages', value => tooManyImages(value))
    .test('image_size_too_large', 'imageSizeTooLarge', value =>
      imageSizeTooLarge(value),
    )
    .test({
      message: 'required1',
      test: arr => {
        if (arr) {
          return arr.length > 0;
        }
      },
    }),
  materials_used_image: Yup.lazy(value => {
    return imageValidationSchema;
  }),

  // inspiringExemplesDescriptions: Yup.string().max(100, 'max'),
  // inspiringExemplesCredits: Yup.string().max(100, 'max'),
  // inspiringExemplesImages: Yup.lazy(value => {
  //   if (Array.isArray(value)) {
  //     return Yup.array().of(imageValidationSchema);
  //   }
  //   return imageValidationSchema;
  // }),
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
  setNewActivityObject(newActivity => ({
    ...newActivity,
    [name]: formikValues[name],
  }));
  setInputTextFieldFocused(false);
  validateSteps();
};

export const getMakingStepsRequiredError = (route, errors, touched) => {
  if (route && errors[route] && typeof touched[route] === 'boolean') {
    return errors[route];
  }
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
  if (state['inspiringArtistFullName']) {
    inspiringArtist['name'] = state['inspiringArtistFullName'];
  }
  if (state['inspiringArtist']) {
    inspiringArtist['short_biography'] = state['inspiringArtist'];
  }
  //: '';
  if (fieldHasUrls(mediaUpload, 'inspiringArtistImage')) {
    inspiringArtist['image'] = getFieldUrls(
      mediaUpload,
      'inspiringArtistImage',
    )[0];
  }
  // : null;
  return inspiringArtist;
};

// const refactorFieldsData = (state, mediaUpload) => {
//   const createActivityArgs = {};
//   createActivityArgs['title'] = state.title;
//   createActivityArgs['motivation'] = state.motivation;
//   createActivityArgs['learning_goals'] = state.learningGoals;
//   createActivityArgs['materials_used'] = state.materialsUsed
//     ? state.materialsUsed.join(',')
//     : '';
//   createActivityArgs['facilitation_tips'] = state.facilitationTips;
//   createActivityArgs['video'] = fieldHasUrls(mediaUpload, 'video')
//     ? getFieldUrls(mediaUpload, 'video')[0]
//     : '';
//   if (fieldHasUrls(mediaUpload, 'materialsUsedImage')) {
//     createActivityArgs['materials_used_image'] = getFieldUrls(
//       mediaUpload,
//       'materialsUsedImage',
//     )[0];
//   }
//   if (fieldHasUrls(mediaUpload, 'activityImages')) {
//     createActivityArgs['images'] = Object.values(
//       getFieldUrls(mediaUpload, 'activityImages'),
//     ).map(image => ({
//       image: image,
//     }));
//   }
//   createActivityArgs['making_steps'] = combineMakingStepsData(
//     state.creationSteps,
//     getFieldUrls(mediaUpload, 'makingStepsImages'),
//   );
//   createActivityArgs['inspiring_examples'] = combineInspiringExamplesData(
//     state.inspiringExemplesDescriptions,
//     state.inspiringExemplesCredits,
//     getFieldUrls(mediaUpload, 'inspiringExemplesImages'),
//   );
//   if (Object.keys(combineInspiringArtistData(state, mediaUpload)).length > 0) {
//     console.log(
//       'artist not empty',
//       combineInspiringArtistData(state, mediaUpload),
//     );
//     createActivityArgs['inspiring_artist'] = combineInspiringArtistData(
//       state,
//       mediaUpload,
//     );
//   }
//   console.log('refactor args', createActivityArgs);
//   return createActivityArgs;
// };

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

const activityFieldMap = [
  'facilitation_tips',
  'learning_goals',
  'materials_used',
  'materials_used_image',
  'motivation',
  'title',
  'video',
];
//   facilitation_tips:
//   //images:'activity_images',
//   //inspiring_artist: 'inspiring_artist',
//  // inspiring_examples: 'inspiring_examples',
//   learning_goals:
//   //making_steps: 'making_steps',
//   materials_used:
//   materials_used_image:
//   motivation:
//   title:
//   video:
// }

export const deserialize = (activity, setFieldValue) => {
  if (activity['making_steps']) {
    activity['making_steps'].forEach((item, index) => {
      Object.entries(item).forEach(([key, value]) => {
        if (value === null) {
          setFieldValue(`making_steps[${index}][${key}]`, undefined);
        } else {
          setFieldValue(`making_steps[${index}][${key}]`, value);
        }
      });
    });
  }

  if (activity['inspiring_examples']) {
    activity['inspiring_examples'].forEach((item, index) => {
      Object.entries(item).forEach(([key, value]) => {
        if (value === null) {
          setFieldValue(`inspiring_examples[${index}][${key}]`, undefined);
        } else {
          setFieldValue(`inspiring_examples[${index}][${key}]`, value);
        }
      });
    });
  }

  if (activity['images']) {
    let images = [];
    activity['images'].forEach((item, index) => {
      Object.entries(item).forEach(([key, value]) => {
        images.push(value);
      });
    });
    setFieldValue('activity_images', images);
  }

  if (activity['inspiring_artist']) {
    Object.entries(activity['inspiring_artist']).forEach(([key, value]) => {
      if (value === null) {
        setFieldValue(`inspiring_artist[${key}]`, undefined);
      } else {
        setFieldValue(`inspiring_artist[${key}]`, value);
      }
    });
  }

  activityFieldMap.forEach(item => {
    if (activity[item] !== null) {
      if (item === 'materials_used') {
        setFieldValue('materials_used', activity['materials_used'].split(','));
      } else {
        setFieldValue(item, activity[item]);
      }
    }
  });
  setFieldValue(`id`, activity.id, false);
};

// export const deserializeFieldsData = (
//   activity,
//   setFieldValue,
//   setFieldTouched,
// ) => {
//   let state = {};
//   let mediaUpload = new MediaUpload();

//   Object.entries(mediaFieldMap).forEach(([fieldName, fieldInObject]) => {
//     if (activity[fieldInObject.key]) {
//       if (fieldInObject.count === 'single') {
//         let image = fieldInObject.subKey
//           ? activity[fieldInObject.key][fieldInObject.subKey]
//           : activity[fieldInObject.key];
//         if (image !== null && image !== '') {
//           mediaUpload.serializeImage(fieldName, image, 0);
//           setFieldTouched(fieldName, true, false);
//         }
//       } else {
//         activity[fieldInObject.key].forEach((object, index) => {
//           let image = fieldInObject.subKey
//             ? object[fieldInObject.subKey]
//             : object;
//           if (image !== null && image !== '') {
//             mediaUpload.serializeImage(fieldName, image, index);
//             setFieldTouched(`${fieldName}[${index}]`, true, false);
//           }
//         });
//       }
//     }
//   });

//   Object.entries(simpleFieldsMap).forEach(([key, value]) => {
//     if (activity[value.key]) {
//       if (value.type === 'simple') {
//         if (value.subKey) {
//           state[key] = activity[value.key][value.subKey];
//           setFieldValue(key, activity[value.key][value.subKey], false);
//           // setFieldTouched(key, true);
//         } else {
//           state[key] = activity[value.key];
//           setFieldValue(key, activity[value.key], false);
//           // setFieldTouched(key, true);
//         }
//       } else {
//         state[key] = [];
//         activity[value.key].forEach((item, index) => {
//           state[key][index] = item[value.subKey];
//           setFieldValue(`${key}[${index}]`, item[value.subKey], false);
//           // setFieldTouched(`${key}[${index}]`, true);
//         });
//       }
//     }
//   });

//   state['materialsUsed'] = activity['materials_used'].split(',');
//   state['materialsUsed'].forEach((value, index) => {
//     setFieldValue(`materialsUsed[${index}]`, value, false);
//   });
//   state['mediaUpload'] = mediaUpload;
//   return state;
// };

export const deleteActivity = (token, id) => {
  API.deleteActivity({ token: token, id: id });
};

export const initUpload = async (
  e,
  state,
  props,
  handleSetState,
  history,
  formikProps,
  setReadyForSubmit,
) => {
  e.preventDefault();
  handleSetState(state => {
    let values = { ...formikProps.formikValues };
    if (values['making_steps']) {
      let making_steps = values.making_steps;
      making_steps.forEach((step, idx) => {
        step['step_order'] = idx + 1;
      });
      values['making_steps'] = making_steps;
    }
    if (values['materials_used']) {
      let materials_used = values.materials_used;
      materials_used = materials_used.join(',');
      values['materials_used'] = materials_used;
    }
    return { ...state, ['submitting']: true, values: { ...values } };
  });
  if (!props.auth.token) {
    props.history.push('/login');
  } else {
    let uploadedMediaPromises = FormMediaUpload(
      state,
      props.auth,
      handleSetState,
      formikProps.formikValues,
    );

    const result = await Promise.all(uploadedMediaPromises);
    console.log('result of upload', result);
    // let mediaUpload = state.mediaUpload;
    let formikpromises = [];
    result.forEach(each => {
      let activityImages = {};
      //let dt = new DataTransfer();

      switch (each.fieldType) {
        case 'simple':
          //formikpromises.push(
          // formikProps.setFieldValue(each.field, each.url, false);
          handleSetState(state => {
            let field = state.values[each.field];
            field = each.url;
            return {
              ...state,
              ['values']: { ...state.values, [each.field]: field },
            };
          });
          // );
          break;
        case 'array':
          // formikpromises.push(
          // formikProps.setFieldValue(
          //   `${each.field}.${each.index}`,
          //   each.url,
          //   false,
          // );
          handleSetState(state => {
            let field = state.values[each.field];
            if (!Array.isArray(field)) {
              field = [];
            }
            field.push({ image: each.url });
            return {
              ...state,
              ['values']: { ...state.values, [each.field]: field },
            };
          });
          // );
          //activityImages[each.index] = each.url;
          // dt.items.add(each.url);
          break;
        case 'object':
          // formikpromises.push(
          // formikProps.setFieldValue(
          //   `${each.route}.${each.field}`,
          //   each.url,
          //   false,
          // );
          handleSetState(state => {
            return {
              ...state,
              ['values']: {
                ...state.values,
                [each.route]: {
                  ...state.values[each.route],
                  image: each.url,
                },
              },
            };
          });
          //);
          break;
        case 'objectsArray':
          //formikpromises.push(
          // formikProps.setFieldValue(
          //   `${each.route}.${each.index}.${each.field}`,
          //   each.url,
          //   false,
          // );
          handleSetState(state => {
            let field = state.values[each.route];
            field[each.index] = {
              ...field[each.index],
              [each.field]: each.url,
            };
            return {
              ...state,
              ['values']: {
                ...state.values,
                [each.route]: field,
              },
            };
          });

          //);
          break;
        default:
          break;
      }
    });

    handleSetState(async state => {
      if (props.values.id) {
        let field = [];
        Array.isArray(state.values.activity_images)
          ? state.values.activity_images.forEach(image => {
              field.push({ image: image });
            })
          : Object.entries(state.values.activity_images).forEach(
              ([key, image]) => {
                field.push({ image: image });
              },
            );
        let values = { ...state.values, ['activity_images']: field };
        console.log('edit');
        const apiResponse = await API.updateActivity(
          props.auth.token,
          props.values.id,
          values,
        );
        console.log('apiresponse', apiResponse);
        if (apiResponse) {
          return props.history.push('/activities/all/');
        }
      } else {
        const apiResponse = await API.createActivity(
          props.auth.token,
          state.values,
        );
        console.log('apiresponse', apiResponse);
        if (apiResponse) {
          return props.history.push('/activities/all/');
        }
      }
      return { ...state, ['submitting']: false };
    });

    //const formikresp = await Promise.all(formikpromises);
    //console.log('formik promise response', formikresp);
    // handleSetState(state => {
    //   return {
    //     ...state,
    //     ['submitting']: true,
    //     values: formikProps.formikValues,
    //   };
    // });
    //console.log('ref', submitButtonRef);

    //   console.log('api response', apiResponse);
    // console.log('media upload after loading', mediaUpload);
    // const args = refactorFieldsData(state, mediaUpload);
    // if (!state.id) {
    //   const apiResponse = await API.createActivity(props.auth.token, args);
    //   console.log('api response', apiResponse);
    //   handleSetState(state => {
    //     return { ...state, ['submitting']: false };
    //   });
    //   return props.history.push('/activities/all/');
    // } else {
    //   const apiResponse = await API.updateActivity(
    //     props.auth.token,
    //     state.id,
    //     args,
    //   );
    //   console.log('api response', apiResponse);
    //   handleSetState(state => {
    //     return { ...state, ['submitting']: false };
    //   });
    //   return props.history.push('/activities/all/');
    // }
  }
};

export const create = async (auth, args) => {
  const apiResponse = await API.createActivity(auth.token, args);
  // console.log('response', apiResponse);
  // setReadyForSubmit(rev => {
  //   return false;
  // });
  return apiResponse;
};
