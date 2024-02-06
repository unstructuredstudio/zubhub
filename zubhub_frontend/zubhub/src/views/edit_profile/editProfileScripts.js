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
 * @function handleClickShowDeleteAccountPassword
 * @author Berra Karaman <esma.berra.karaman@hotmail.com>
 *
 * @todo - describe function's signature
 */
export const handleClickShowDeleteAccountPassword = state => {
  const { show_delete_account_password } = state;
  return { show_delete_account_password: !show_delete_account_password };
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
 * @function handleToggleDeleteAccountModal
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
 export const handleToggleDeleteAccountModal = state => {
  const open_delete_account_modal = !state.open_delete_account_modal;
  return { open_delete_account_modal, more_anchor_el: null, dialog_error: null };
};

/**
 * @function deleteAccount
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const deleteAccount = (username_el, props, toast) => {
  let password_match = true;
  if (username_el.current.firstChild.value !== props.auth.username) {
    return { dialog_error: props.t('profile.delete.errors.incorrectUsername') };
  } else if (!props?.values?.password)  {
    return { dialog_error: props.t('profile.delete.errors.emptyPassword') };
  } else {
    props.login({ values: props.values, navigate: props.navigate }).catch(error => {
      try{
        toast.error(props.t('editProfile.inputs.password.errors.invalid'));
        password_match = false;
        return;
      } catch (err) {
        toast.error(props.t('err.message'));
      }
    }).finally(() => {
      if (password_match === false) {
        return;
      } else {
        return props.deleteAccount({
          token: props.auth.token,
          navigate: props.navigate,
          logout: props.logout,
          t: props.t,
        })
      }
    });
    
  }
};

/**
 * @function editProfile
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const editProfile = (e, props, toast) => {
  e.preventDefault();
  props.setFieldTouched('username', true);
  props.setFieldTouched('email', true);
  props.setFieldTouched('phone', true);
  props.setFieldTouched('password', true);
  props.setFieldTouched('user_location', true);
  let password_match = true;
  if (props.values.user_location.length < 1) {
    props.validateField('user_location');
  } else if (props.values.password.length < 1) {
    props.validateField('password');
  } else {
    props.login({ values: props.values, navigate: props.navigate }).catch(error => {
      try{
        const messages = JSON.parse(error.message);
        toast.error(props.t('editProfile.inputs.password.errors.invalid'));
        password_match = false;
        return;
      } catch (err) {
        toast.error(props.t('err.message'));
      }
    }).finally(() => {
      if (password_match == false) {
        return;
      } else {
        return props
          .editUserProfile({ ...props.values, token: props.auth.token })
          .then(_ => {
            toast.success(props.t('editProfile.toastSuccess'));
            props.navigate('/profile');
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
                  toast.error(server_errors[key]);
                }
              });
            } else {
              props.setStatus({
                non_field_errors: props.t('editProfile.errors.unexpected'),
              });
            }
          });
      }
    });
  }
}

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
  password: Yup.string().required('required'),
  email: Yup.string().email('invalid').when('phone', {
    is: (phone) => !phone || phone.length === 0,
    then: Yup.string().required('phoneOrEmail')
  }),
  phone: Yup.string().when('email', {
    is: (email) => !email || email.length === 0,
    then: Yup.string().required('phoneOrEmail')
  }).test('phone_is_invalid', 'invalid', function (value) {
    return /^[+][0-9]{9,15}$/g.test(value) || !value ? true : false;
  }),
  bio: Yup.string().max(255, 'tooLong'),
}, ['phone', 'email']);