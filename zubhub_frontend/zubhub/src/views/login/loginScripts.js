import * as Yup from 'yup';

/**
 * @function handleClickShowPassword
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleClickShowPassword = state => {
  const { show_password } = state;
  return { show_password: !show_password };
};

/**
 * @function handleMouseDownPassword
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleMouseDownPassword = e => {
  e.preventDefault();
};

/**
 * @function login
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const login = (e, props) => {
  e.preventDefault();
  return props
    .login({ values: props.values, history: props.history })
    .catch(error => {
      const messages = JSON.parse(error.message);
      if (typeof messages === 'object') {
        const server_errors = {};
        Object.keys(messages).forEach(key => {
          if (key === 'non_field_errors') {
            server_errors['non_field_errors'] = messages[key][0];
          } else {
            server_errors[key] = messages[key][0];
          }
        });
        props.setStatus({ ...server_errors });
      } else {
        props.setStatus({
          non_field_errors: props.t('login.errors.unexpected'),
        });
      }
    });
};

/**
 * @object validationSchema
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe object's function
 */
export const validationSchema = Yup.object().shape({
  username: Yup.string().required('required'),
  password: Yup.string().min(8, 'min').required('required'),
});
