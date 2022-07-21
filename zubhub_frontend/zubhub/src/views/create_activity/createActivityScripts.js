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
}) 

export const handleTextFieldChange = (e, props) => {
  props.setStatus({ ...props.status, [e.target.id]: '' });
  props.handleChange(e);
};

export const handleTextFieldBlur = (e, props) => {
  props.setStatus({ ...props.status, [e.target.id]: '' });
  props.handleBlur(e);
};