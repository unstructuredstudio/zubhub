import * as Yup from 'yup';

/**
 * @constant vars
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe constant's function
 */
export const vars = {
  csv_not_added: true,
};

/**
 * @function useStateUpdateCallback
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const submit = (state, handleSetState, props) => {
  let { upload_dialog, csv } = state;
  upload_dialog = true;
  handleSetState({ upload_dialog });
  csv = csv ? csv : new File([''], 'empty');
  let group_members = null;

  if (props.values['group_members']) {
    group_members = JSON.parse(props.values['group_members']).filter(value =>
      value ? true : false,
    );
  } else {
    group_members = [];
  }

  const data = new FormData();
  data.append('csv', csv);
  data.append('group_members', JSON.stringify(group_members));

  props
    .addMembers({
      data,
      token: props.auth.token,
      t: props.t,
      history: props.history,
    })
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
          non_field_errors: props.t('addGroupMembers.errors.unexpected'),
        });
      }
    });

  upload_dialog = !upload_dialog;

  handleSetState({ upload_dialog });
};

/**
 * @function handleSubmit
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleSubmit = (e, state, handleSetState, props) => {
  e.preventDefault();

  if (!props.auth.token) {
    props.history.push('/login');
  } else {
    props.setFieldTouched('group_members');

    props.validateForm().then(errors => {
      if (Object.keys(errors).length > 0) {
        return;
      } else {
        submit(state, handleSetState, props);
      }
    });
  }
};

/**
 * @function handleAddGroupMembersFieldChange
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleAddGroupMembersFieldChange = (e, props, refs) => {
  const children = refs.add_group_members_el.current.children;
  let arr = [];
  for (let index = 0; index < children.length; index++) {
    if (children[index].children[0].value) {
      arr.push(children[index].children[0].value);
    } else {
      if (index >= 1) {
        arr.push('');
      }
    }
  }

  props.setFieldValue('group_members', JSON.stringify(arr), true);
};

/**
 * @function handleBulkAddCheck
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleBulkAddCheck = bulk_add_checked => ({
  bulk_add_checked: !bulk_add_checked,
});

/**
 * @function handleAddCSV
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const handleAddCSV = (e, refs) => {
  e.preventDefault();
  if (e.dataTransfer.items[0].getAsFile() !== null) {
    return { csv: e.dataTransfer.items[0].getAsFile() };
  } else {
    refs.drag_drop_el.current.style.border = '1px dashed rgb(196, 194, 194)';
  }
};

/**
 * @function addGroupMembersNode
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const addGroupMembersNode = (e, props) => {
  e.preventDefault();
  let group_members = props.values['group_members'];
  if (!group_members) {
    props.setFieldValue('group_members', '["","","",""]');
  } else {
    group_members = JSON.parse(group_members);
    group_members.push('');
    props.setFieldValue('group_members', JSON.stringify(group_members));
  }
};

/**
 * @object validationSchema
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe object's function
 */
export const validationSchema = Yup.object().shape({
  group_members: Yup.string().test('empty', 'required', value => {
    let is_empty = true;

    value &&
      JSON.parse(value).forEach(member => {
        if (member) {
          is_empty = false;
        }
      });

    is_empty &= vars.csv_not_added;

    return !is_empty;
  }),
});
