export const handleInputBlur = (e, name, formikProps, validateSteps) => {
  if (name === 'video') {
    let value = { file_url: e.target.value, length: 1 };
    formikProps.setFieldValue(name, value, true).then(errors => {
      errors[name] && formikProps.setFieldValue(name, undefined, true);
    });
  } else {
    formikProps.handleBlur(e);
  }
  validateSteps();
};

export const handleInputChange = (
  name,
  value,
  setFieldValue,
  setFieldTouched,
) => {
  if (name !== 'video') {
    if (value && value !== '') {
      setFieldValue(name, value, true);
    } else {
      setFieldValue(name, undefined, true);
    }
  }
  setFieldTouched(name, true, false);
};
