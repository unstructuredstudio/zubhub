import * as Yup from 'yup';

export const getUidAndToken = queryString => {
  let uid = queryString.split('&&');
  const token = uid[1].split('=')[1];
  uid = uid[0].split('=')[1];
  return { uid, token };
};

export const resetPassword = (e, props) => {
  e.preventDefault();
  const { uid, token } = getUidAndToken(props.location.search);
  return props
    .passwordResetConfirm({
      ...props.values,
      uid,
      token,
      t: props.t,
      history: props.history,
    })
    .catch(error => {
      const messages = JSON.parse(error.message);
      if (typeof messages === 'object') {
        const server_errors = {};
        Object.keys(messages).forEach(key => {
          if (key !== 'new_password1' && key !== 'new_password2') {
            server_errors['non_field_errors'] = messages[key][0];
          } else {
            server_errors[key] = messages[key][0];
          }
        });

        props.setStatus({ ...server_errors });
      } else {
        props.setStatus({
          non_field_errors: props.t('passwordResetConfirm.errors.unexpected'),
        });
      }
    });
};

export const handleClickShowPassword = (field, state) => {
  if (field === 1) {
    const { show_password1 } = state;
    return { show_password1: !show_password1 };
  } else if (field === 2) {
    const { show_password2 } = state;
    return { show_password2: !show_password2 };
  }
};

export const handleMouseDownPassword = e => {
  e.preventDefault();
};

export const validationSchema = Yup.object().shape({
  new_password1: Yup.string().min(8, 'min').required('required'),
  new_password2: Yup.string()
    .oneOf([Yup.ref('new_password1'), null], 'noMatch')
    .required('required'),
});
