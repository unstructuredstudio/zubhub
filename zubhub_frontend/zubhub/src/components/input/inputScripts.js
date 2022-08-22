export const handleInputBlur = (
  e,
  formikProps,
  field,
  setNewActivityObject,
  validateSteps,
) => {
 // formikProps.setFieldValue(field, e.target.value, true);
  formikProps.handleBlur(e);
  setNewActivityObject(newActivity => ({
    ...newActivity,
    [field]: formikProps.formikValues[field],
  }));
  validateSteps();
};

export const handleInputChange = (
  e,
  formikProps,
  field,
  setNewActivityObject,
) => {
  formikProps.handleChange(e);
  // setNewActivityObject(newActivity => ({
  //   ...newActivity,
  //   [field]: e.target.value,
  // }));
};
