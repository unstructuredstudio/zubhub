import * as Yup from 'yup';

export const validateStep = (step, props, newActivity) =>{
   props.handleSetState({step: step, newActivity: newActivity})
   props.handleSetState({newActivity: newActivity})      
   }

export const handleImageFieldChange = (refs, props, state, handleSetState) => {
  refs.image_count_el.current.innerText = `${
    refs.imageInput.current.files.length
  } ${props.t(
    `createProject.inputs.${
      refs.imageInput.current.files.length < 2 ? 'image' : 'images'
    }`,
  )}`;
};   

export const validationSchema =  Yup.object().shape({
  title: Yup.string().max(100, 'max').required('required'),
  motivation: Yup.string().max(10000, 'max').required('required'),
  learningGoals: Yup.string().max(10000, 'max').required('required'),
  facilitationTips: Yup.string().max(10000, 'max').required('required'),
  materialsUsed: Yup.array().of(Yup.string().max(100, 'max')),
  //'materialsUsed[0]': Yup.string().max(100, 'max').required('required1'),

}) 

export const handleTextFieldChange = (label, value, props) => {
  props.setStatus({ ...props.status, [label]: '' });
  props.setFieldTouched(label, true);
  //props.setFieldValue(label, value, true);
  props.setFieldValue(label, value, true);

};

export const handleTextFieldBlur = (label, props) => {
  props.setStatus({ ...props.status, [label]: '' });
  props.validateSteps(props.verifiedStep)
 // props.handleBlur(e);
};

export const handleInputTextFieldChange = (label,value, props) => {
  if (value && value !== '<p><br></p>') {
    // second conditional is a guide for when quill is cleared.
    props.setStatus({ ...props.status, [label]: '' });
    props.setFieldValue(label, value, true);
  } else {
    props.setFieldValue(label, undefined, true);
  }
  props.setFieldTouched(label, true);
};

export const handleInputTextFieldBlur = ( props ) => {
  props.validateSteps(props.verifiedStep)
};


// export const handleDescFieldFocusChange = (value, props, handleSetState) => {
//   props.setFieldTouched('description');
//   if (!value) {
//     handleSetState({ desc_input_is_focused: true });
//   }
// };