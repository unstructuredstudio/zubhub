import * as Yup from 'yup';

export const sendPasswordResetLink = (e, props) => {
  e.preventDefault();
  return props
    .sendPasswordResetLink({
      email: props.values.email,
      t: props.t,
      history: props.history,
    })
    .catch(error => {
      const messages = JSON.parse(error.message);
      if (typeof messages === 'object') {
        const server_errors = {};
        Object.keys(messages).forEach(key => {
          if (key !== 'email') {
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

export const validationSchema = Yup.object().shape({
  email: Yup.string().email('invalid').required('required'),
});
