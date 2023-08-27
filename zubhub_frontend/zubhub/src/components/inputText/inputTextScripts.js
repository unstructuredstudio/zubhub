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
  setFieldTouched(name, true, true);
};

export const handleInputTextFieldBlur = (
  name,
  formikValues,
  setInputTextFieldFocused,
  validateSteps,
) => {
  setInputTextFieldFocused(false);
  validateSteps();
};
