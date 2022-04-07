import * as Yup from 'yup';

/**
 * @function getLocations
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getLocations = props => {
  return props.getLocations({ t: props.t });
};

/**
 * @function getProfile
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getProfile = (refs, props) => {
  return props.getAuthUser(props).then(obj => {
    if (!obj.id) {
      return;
    } else {
      let init_email_and_phone = {};
      if (refs.username_el.current && obj.username) {
        props.setFieldValue('username', obj.username);
      }

      if (refs.email_el.current && obj.email) {
        props.setFieldValue('email', obj.email);
        init_email_and_phone['init_email'] = obj.email; //this is a hack: we need to find a better way of knowing when phone and email exists. state doesn't seem to work
      }

      if (refs.phone_el.current && obj.phone) {
        props.setFieldValue('phone', obj.phone);
        init_email_and_phone['init_phone'] = obj.phone; //this is a hack: we need to find a better way of knowing when phone and email exists. state doesn't seem to work
      }

      if (obj.location) {
        props.setFieldValue('user_location', obj.location);
      }

      if (refs.bio_el.current && obj.bio) {
        props.setFieldValue('bio', obj.bio);
      }

      props.setStatus(init_email_and_phone); //the hack continues
    }
  });
};

/**
 * @function editProfile
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const editProfile = (e, props, toast) => {
  e.preventDefault();
  if (props.values.user_location.length < 1) {
    props.validateField('user_location');
  } else {
    return props
      .editUserProfile({ ...props.values, token: props.auth.token })
      .then(_ => {
        toast.success(props.t('editProfile.toastSuccess'));
        props.history.push('/profile');
      })
      .catch(error => {
        const messages = JSON.parse(error.message);
        if (typeof messages === 'object') {
          const server_errors = {};
          Object.keys(messages).forEach(key => {
            if (key === 'non_field_errors') {
              server_errors['non_field_errors'] = messages[key][0];
            } else if (key === 'location') {
              server_errors['user_location'] = messages[key][0];
            } else {
              server_errors[key] = messages[key][0];
            }
          });
          props.setStatus({
            //this is a hack. we need to find a more react way of maintaining initial state for email and phone.
            init_email: props.status && props.status.init_email,
            init_phone: props.status && props.status.init_phone,
            ...server_errors,
          });
        } else {
          props.setStatus({
            non_field_errors: props.t('editProfile.errors.unexpected'),
          });
        }
      });
  }
};

/**
 * @function handleTooltipOpen
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleTooltipOpen = () => {
  return { tool_tip_open: true };
};

/**
 * @function handleTooltipClose
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleTooltipClose = () => {
  return { tool_tip_open: false };
};

/**
 * @object validationSchema
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe object's function
 */
export const validationSchema = Yup.object().shape({
  username: Yup.string().required('required'),
  user_location: Yup.string().min(1, 'min').required('required'),
  email: Yup.string().email('invalid'),
  phone: Yup.string().test('phone_is_invalid', 'invalid', function (value) {
    return /^[+][0-9]{9,15}$/g.test(value) || !value ? true : false;
  }),
  bio: Yup.string().max(255, 'tooLong'),
});
