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
  props.setFieldValue(label, value, true);

};

export const handleTextFieldBlur = (label, props) => {
  let labelRoot = label.split('[')[0]
  console.log('labelRoot', labelRoot)
  props.setStatus({ ...props.status, [labelRoot]: '' });
  props.handleSetState({newActivity: { ...props.newActivity,[labelRoot]: props.values[labelRoot]}})
  props.validateSteps()
};

export const handleInputTextFieldChange = (label,value, props) => {
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
};

