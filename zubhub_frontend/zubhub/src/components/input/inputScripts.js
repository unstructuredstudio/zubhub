export const handleInputBlur = (
  e,
  formikProps,
  validateSteps,
) => {
  formikProps.handleBlur(e);
  validateSteps();
};

export const handleInputChange = (
  name,
  value,
  setFieldValue,
  setFieldTouched,
) => {
  if (value && value !== '') {
    setFieldValue(name, value, true);
  } else {
    setFieldValue(name, undefined, true);
  }
  setFieldTouched(name, true);
};