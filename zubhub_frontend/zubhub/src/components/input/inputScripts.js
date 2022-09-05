export const handleInputBlur = (
  e,
  formikProps,
  validateSteps,
) => {
  formikProps.handleBlur(e);
  validateSteps();
};