export const refactorVideoUrl = url => {
  if (url.includes('youtube.com')) {
    url = url.split('&')[0];
    return url.replace('watch?v=', 'embed/');
  } else {
    if (url.includes('youtu.be')) {
      return 'https://www.youtube-nocookie.com/embed/'.concat(url.split('/')[3]);
    }
    if (url.includes('drive.google.com')) {
      if (url.includes('/view')) {
        return url.split('/view')[0].concat('', '/preview');
      } else return url;
    } else {
      if (url.includes('https://vimeo.com')) {
        return url.replace('https://vimeo.com', 'player.vimeo.com/video');
      }
    }
  }
  return url;
};

export const handleInputBlur = (e, name, formikProps, validateSteps) => {
  if (name === 'video' && e.target.value !== '') {
    let value = { file_url: refactorVideoUrl(e.target.value), length: 1 };
    formikProps.setFieldValue(name, value, true).then(errors => {
      errors[name] && formikProps.setFieldValue(name, undefined, false);
    });
  } else {
    formikProps.handleBlur(e);
  }
  //validateSteps();
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
  // if (name === 'video' && value !== '') {
  //   let value1 = { file_url: refactorVideoUrl(value), length: 1 };
  //   setFieldValue(name, value1, true).then(errors => {
  //     errors[name] && setFieldValue(name, undefined, false);
  //   });
  // } else {
  //   if (value && value !== '') {
  //     setFieldValue(name, value, true);
  //   } else {
  //     setFieldValue(name, undefined, true);
  //   }
  // }
  setFieldTouched(name, true, false);
};
