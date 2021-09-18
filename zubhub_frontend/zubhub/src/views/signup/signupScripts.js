import * as Yup from 'yup';

export const vars = {
  phone_field_touched: undefined,
  email_field_touched: undefined,
};

export const handleMouseDownPassword = e => {
  e.preventDefault();
};

export const getLocations = props => {
  return props.getLocations({ t: props.t });
};

export const signup = (e, props) => {
  e.preventDefault();
  if (!props.values.user_location || props.values.user_location.length < 1) {
    props.setFieldTouched('username', true);
    props.setFieldTouched('email', true);
    props.setFieldTouched('phone', true);
    props.setFieldTouched('dateOfBirth', true);
    props.setFieldTouched('user_location', true);
    props.setFieldTouched('password1', true);
    props.setFieldTouched('password2', true);
    vars.phone_field_touched = true;
    vars.email_field_touched = true;
  } else {
    return props
      .signup({
        values: { ...props.values, subscribe: !props.values.subscribe },
        history: props.history,
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
          props.setStatus({ ...server_errors });
        } else {
          props.setStatus({
            non_field_errors: props.t('signup.errors.unexpected'),
          });
        }
      });
  }
};

export const handleTooltipToggle = ({ tool_tip_open }) => {
  return { tool_tip_open: !tool_tip_open };
};

export const handleToggleSubscribeBox = (e, props, state) => {
  let subscribe_box_checked = !state.subscribe_box_checked;
  props.setFieldValue('subscribe', subscribe_box_checked);
  return { subscribe_box_checked };
};

export const validationSchema = Yup.object().shape({
  username: Yup.string().required('required'),
  email: Yup.string()
    .email('invalid')
    .test('email_is_empty', 'phoneOrEmail', function (value) {
      return vars.email_field_touched && !value && !this.parent.phone
        ? false
        : true;
    }),
  phone: Yup.string()
    .test('phone_is_invalid', 'invalid', function (value) {
      return /^[+][0-9]{9,15}$/g.test(value) || !value ? true : false;
    })
    .test('phone_is_empty', 'phoneOrEmail', function (value) {
      return vars.phone_field_touched && !value && !this.parent.email
        ? false
        : true;
    }),
  dateOfBirth: Yup.date().max(new Date(), 'max').required('required'),
  user_location: Yup.string().min(1, 'min').required('required'),
  password1: Yup.string().min(8, 'min').required('required'),
  password2: Yup.string()
    .oneOf([Yup.ref('password1'), null], 'noMatch')
    .required('required'),
  bio: Yup.string().max(255, 'tooLong'),
});
