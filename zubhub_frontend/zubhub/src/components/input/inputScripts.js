const refactorVideoUrl = url => {
  if (url.includes('youtube.com')) {
    return url.replace('watch?v=', 'embed/');
  } else {
    if (url.includes('drive.google.com')) {
      return url.split('/view')[0].concat('', '/preview');
    } else {
      if (url.includes('https://vimeo.com')) {
        return url.replace('https://vimeo.com', 'player.vimeo.com/video');
      } else {
        return url;
      }
    }
  }
};

export const handleInputBlur = (e, name, formikProps, validateSteps) => {
  if (name === 'video' && e.target.value !== '') {
    let value = { file_url: refactorVideoUrl(e.target.value), length: 1 };
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
