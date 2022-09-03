export const handleInputBlur = (
  e,
  formikProps,
  field,
  setNewActivityObject,
  validateSteps,
) => {
  formikProps.handleBlur(e);
  // setNewActivityObject(newActivity => ({
  //   ...newActivity,
  //   [field]: formikProps.formikValues[field],
  // }));
  validateSteps();
};