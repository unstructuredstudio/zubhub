import * as Yup from 'yup';

/**
 * @function getUserProfile
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */ export const getTeamProfile = (groupname, props) => {
  // let username = props.match.params.username;

  // if (!username) {
  //   username = props.auth.username;
  // } else if (props.auth.username === username) props.history.replace('/profile');
  return props.getTeamProfile({
    groupname,
    token: props.auth.token
  });
};

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
  return { open_delete_account_modal, more_anchor_el: null };
};

/**
 * @function deleteAccount
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
 export const deleteAccount = (username_el, props) => {
  if (username_el.current.firstChild.value !== props.auth.username) {
    return { dialogError: props.t('profile.delete.errors.incorrectUsernme') };
  } else {
    return props.deleteAccount({
      token: props.auth.token,
      history: props.history,
      logout: props.logout,
      t: props.t,
    });
  }
};

/**
 * @function editProfile
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const editProfile = (groupname, bio, props) => {
  let token=props.auth.token;
  const body = {
    groupname: groupname,
    bio: bio
  };
  return props.editTeam({ groupname, body, token });
  
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
  password: Yup.string().required('required'),
  email: Yup.string().email('invalid'),
  phone: Yup.string().test('phone_is_invalid', 'invalid', function (value) {
    return /^[+][0-9]{9,15}$/g.test(value) || !value ? true : false;
  }),
  bio: Yup.string().max(255, 'tooLong'),
});
