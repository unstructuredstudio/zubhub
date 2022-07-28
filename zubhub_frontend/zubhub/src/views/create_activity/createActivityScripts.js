import * as Yup from 'yup';

const vars ={
  image_field_touched: false,
}

export const validationSchema =  Yup.object().shape({
  title: Yup.string().max(100, 'max').required('required'),
  motivation: Yup.string().max(10000, 'max').required('required'),
  learningGoals: Yup.string().max(10000, 'max').required('required'),
  facilitationTips: Yup.string().max(10000, 'max').required('required'),
  materialsUsed: Yup.array().min(1,'required1'),
  activityImages: Yup.mixed()
    .test('image_is_empty', function (value) {
      return vars.image_field_touched && !value 
        ? false
        : true;
    })
    .test('not_an_image', 'onlyImages', value => {
      if (value) {
        let not_an_image = false;
        for (let index = 0; index < value.length; index++) {
          if (value[index].type.split('/')[0] !== 'image') {
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
        return value.length > 10 ? false : true;
      } else {
        return true;
      }
    })
    .test('image_size_too_large', 'imageSizeTooLarge', value => {
      if (value) {
        let image_size_too_large = false;
        for (let index = 0; index < value.length; index++) {
          if (value[index].size / 1000 > 10240) {
            image_size_too_large = true;
          }
        }
        return image_size_too_large ? false : true;
      } else {
        return true;
      }
    })
}) 




export const handleTextFieldChange = (label, e, props) => {
  props.handleChange(e)
  // e.preventDefault();
  // props.setStatus({ ...props.status, [label]: '' });
  // props.setFieldTouched(label, true);
  // props.setFieldValue(label, e.target.value, false);
};

export const handleTextFieldBlur = (e, props) => {
  props.handleBlur(e)
  props.validateSteps()
};

export const handleInputTextFieldChange = (label,value, props) => {
  props.setInputTextFieldFocused(true)
  if (value && value !== '<p><br></p>') {
    props.setStatus({ ...props.status, [label]: '' });
    props.setFieldValue(label, value, true);
  } else {
    props.setFieldValue(label, undefined, true);
  }
  props.setFieldTouched(label, true);
};

export const handleInputTextFieldBlur = (label,props ) => {
  props.validateSteps()
  props.handleSetState({newActivity: { ...props.newActivity,[label]: props.values[label]}})
  props.setInputTextFieldFocused(false)
};

