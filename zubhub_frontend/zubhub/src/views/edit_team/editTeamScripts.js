import * as Yup from 'yup';

/**
 * @function getUserProfile
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */ export const getTeamProfile = (groupname, refs, props) => {
  return props.getTeamProfile({
    groupname,
    token: props.auth.token
  }).then(obj => {
    if (refs.groupname_el.current && obj.groupname) {
      props.setFieldValue('groupname', obj.groupname);
    }
    if (refs.description_el.current && obj.description) {
      props.setFieldValue('description', obj.description);
    }
  })
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
 export const deleteAccount = (groupname, props, state) => {
    return props.deleteTeam({
      token: props.auth.token,
      history: props.history,
      logout: props.logout,
      t: props.t,
      groupname: groupname,
    });
  }



/**
 * @function editProfile
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const editProfile = (e, groupname, props) => {
  e.preventDefault();
  props.setFieldTouched('groupname', true)
  if (props.values.groupname.length < 1) {
    props.validateField('groupname');
  } else {
    const data = {
      groupname: props.values.groupname,
      description: props.values.description,
    };
    return props
      .editTeam({ groupname, data, token: props.auth.token })
      .then(_ => {
        props.history.push(`/teams/${props.values.groupname}`)
      })
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
  groupname: Yup.string().required('required'),
  description: Yup.string().max(255, 'tooLong'),
});
