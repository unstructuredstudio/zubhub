import * as Yup from 'yup';
import ZubhubAPI from '../../api';
import { FormMediaUpload } from '../../components/upload_file/uploadFileScripts';
const API = new ZubhubAPI();

// ^/file validation functions
const isImage = value => {
  if (value) {
    let not_an_image = false;
    if (value['length']) {
      for (let index = 0; index < value.length; index++) {
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
  let allEmptyValues = false;
  if (arr) {
    console.log('from array all empty', arr);
    if (arr.length === 0) {
      allEmptyValues = true;
    }
    arr.forEach(value => {
      if ((value && value !== '') || (value && Object.keys(value).length > 0)) {
        allEmptyValues = true;
      }
    });
    return allEmptyValues;
  } else {
    return false;
  }
};
const EmptyObject = obj => {
  let allEmptyValues = true;
  if (obj) {
    console.log('from object all empty', obj);
    let myObject = Object.entries(obj);
    console.log('myObject', Object.entries(obj));
    if (myObject.length === 0) {
      console.log('length is zero');
      allEmptyValues = false;
    } else {
      myObject.forEach(([key, value]) => {
        if (!value || value === '' || value === '<p><br></p>') {
          allEmptyValues = false;
        }
      });
    }
    console.log('allempty is for', obj, allEmptyValues);
    return allEmptyValues;
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
      message: 'required',
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
});

export const getErrors = (route, field, index, errors, touched) => {
  return route
    ? index < 0
      ? errors[route] &&
        errors[route][field] &&
        touched[route] &&
        touched[route][field] &&
        errors[route][field]
      : errors[route] &&
        errors[route][index] &&
        errors[route][index][field] &&
        touched[route] &&
        touched[route][index] &&
        touched[route][index][field] &&
        errors[route][index][field]
    : index < 0
    ? errors[field] && touched[field] && errors[field]
    : errors[field] && touched[field] && typeof errors[field] === 'string'
    ? errors[field]
    : errors[field] &&
      errors[field][index] &&
      touched[field] &&
      touched[field][index] &&
      errors[field][index];
};

export const getMakingStepsRequiredError = (route, errors, touched) => {
  return (
    errors[route] &&
    touched[route] &&
    typeof errors[route] === 'string' &&
    errors[route]
  );

  // if (route && errors[route] && errors[route][index] && touched[route]) {
  //   return errors[route][index];
  // }
};

export const getStepError = (route, index, errors, touched) => {
  return (
    errors[route] &&
    touched[route] &&
    typeof errors[route] !== 'string' &&
    errors[route][index] &&
    errors[route][index]
  );
};

export const getValue = (route, field, index, fieldType, values) => {
  return fieldType.simple
    ? fieldType.array
      ? values[field] && values[field][index]
      : values[field]
    : fieldType.array
    ? values[route] &&
      values[route][index] &&
      values[route][index][field] &&
      values[route][index][field]
    : values[route] && values[route][field];
};

///////////////////////////////// deserialize activity object to be displayed for update in form fields //////////////////////

const activityFieldMap = [
  'facilitation_tips',
  'learning_goals',
  'materials_used',
  'motivation',
  'title',
  'video',
];

const objectsArray = ['making_steps', 'inspiring_examples'];

export const deserialize = (activity, setFieldValue) => {
  objectsArray.forEach(field => {
    if (activity[field]) {
      activity[field].forEach((item, index) => {
        if (field === 'making_steps') {
          delete item['step_order'];
        }
        Object.entries(item).forEach(([key, value]) => {
          if (value === null) {
            setFieldValue(`${field}[${index}][${key}]`, undefined);
          } else {
            if (key === 'image') {
              value = { 0: value, length: 1 };
            }
            setFieldValue(`${field}[${index}][${key}]`, value);
          }
        });
      });
    }
  });

  if (activity['materials_used_image']) {
    setFieldValue('materials_used_image', {
      0: activity['materials_used_image'],
      length: 1,
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
        if (key === 'image') {
          value = { 0: value, length: 1 };
        }
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

export const deleteActivity = (token, id) => {
  API.deleteActivity({ token: token, id: id });
};

const isEmptyObject = obj => {
  let isEmpty = true;
  Object.entries(obj).forEach(([key, value]) => {
    if (key !== 'length' && value && value !== '') {
      isEmpty = false;
    }
  });
  return isEmpty;
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
    return { ...state, ['submitting']: true };
  });
  if (!props.auth.token) {
    props.history.push('/login');
  } else {
    let uploadedMediaPromises = await FormMediaUpload(
      state,
      props.auth,
      handleSetState,
      formikProps.formikValues,
    );

    let values = { ...formikProps.formikValues };
    const result = await Promise.all(uploadedMediaPromises);
    result.forEach(each => {
      switch (each.fieldType) {
        case 'simple':
          values[each.field] = { 0: each.url };
          break;
        case 'array':
          let field = values[each.field];
          if (!Array.isArray(field)) {
            field = [];
          }
          field.push(each.url);
          values = { ...values, [each.field]: field };
          break;
        case 'object':
          values = {
            ...values,
            [each.route]: {
              ...values[each.route],
              image: each.url,
            },
          };
          break;
        case 'objectsArray':
          let arrfield = values[each.route];
          arrfield[each.index] = {
            ...arrfield[each.index],
            [each.field]: each.url,
          };
          values = {
            ...values,
            [each.route]: arrfield,
          };
          break;
        default:
          break;
      }
    });
    console.log('values=======================>', values);
    objectsArray.forEach(field => {
      if (values[field]) {
        let fieldValues = [];
        values[field].forEach((value, idx) => {
          if (
            (field === 'inspiring_examples' && value['image']) ||
            (field !== 'inspiring_examples' && !isEmptyObject(value))
          ) {
            if (field === 'making_steps') {
              value['step_order'] = idx + 1;
            }

            if (value['image'] && value['image']['length']) {
              value['image'] = value.image[0];
            }
            fieldValues.push(value);
          }
        });
        fieldValues.length === 0
          ? delete values[field]
          : (values[field] = fieldValues);
      }
    });

    if (
      values['inspiring_artist'] &&
      values['inspiring_artist']['image'] &&
      values['inspiring_artist']['image']['length']
    ) {
      values['inspiring_artist'] = {
        ...values['inspiring_artist'],
        image: values['inspiring_artist']['image'][0],
      };
    }
    if (values['materials_used']) {
      let materials_used = values.materials_used;
      materials_used = materials_used.join(',');
      values['materials_used'] = materials_used;
    }
    let field = [];
    Object.entries(values['activity_images']).forEach(([key, image]) => {
      if (key !== 'length') {
        field.push({ image: image });
      }
    });
    if (field.length > 0) {
      values = {
        ...values,
        ['activity_images']: field,
      };
    }

    if (values['materials_used_image']) {
      values = {
        ...values,
        ['materials_used_image']: values['materials_used_image']['0'],
      };
    }

    if (values['id']) {
      API.updateActivity(props.auth.token, values.id, values).then(res => {
        console.log('apiresponse', res);
        handleSetState(state => {
          return { ...state, submitting: false };
        });
        return props.history.push('/activities/all/');
      });
    } else {
      API.createActivity(props.auth.token, values).then(res => {
        console.log('apiresponse', res);
        handleSetState(state => {
          return { ...state, submitting: false };
        });
        return props.history.push('/activities/all/');
      });
    }
  }
};
