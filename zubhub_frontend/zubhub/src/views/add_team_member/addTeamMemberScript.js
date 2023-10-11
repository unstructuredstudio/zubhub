import API from '../../api/api';

export const addMember = async (props, selectedAdmins, selectedMembers) => {
  if (!props.auth.token) return props.history.push('/login');
  console.log(`value of the props ${JSON.stringify(selectedMembers)}`);

let groupMembers = []
  if(selectedAdmins.length > 0){
    groupMembers = [
      ...selectedAdmins.map(admin => ({ member: admin.title, role: 'admin' }))
    ]
  }
 else if(selectedMembers.length > 0){
    groupMembers = [
      ...selectedMembers.map(member => ({ member:member.title, role: 'member' }))
    ]
  }

  else if(selectedAdmins.length > 0 && selectedMembers.length > 0){
     groupMembers = [
      ...selectedAdmins.map(admin => ({ member: admin.title, role: 'admin' })),
      ...selectedMembers.map(member => ({ member: member.title, role: 'member' })),
    ];
  }

  const data = {
    group_members: groupMembers,
  };

  console.log(`ggggggggggggggg ${JSON.stringify(groupMembers)} and data ${JSON.stringify(data)}`);

  const api = new API();
  const token = props.auth.token;
  const groupname = props.match.params.groupname;

  try {
    const response = await api.addTeamMembers({ groupname, data, token });
    if (response.detail === 'User added') {
      return 'success';
    } else {
      return response;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updatedMemberRole = async (props, member) => {
  if (!props.auth.token) return props.history.push('/login');
  const data = {
    group_members: [member],
  };

  console.log(`the data in updated ${JSON.stringify(data)}`);

  const api = new API();
  const token = props.auth.token;
  const groupname = props.match.params.groupname;

  try {
    const response = await api.addTeamMembers({ groupname, data, token });

    console.log(`Response ${JSON.stringify(response)}`);

    if (response.detail === 'User added') {
      return 'User Updated';
    } else {
      return response;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const removeMember = async (groupname, username, token, props) => {
  console.log(`loggin the value of token ${JSON.stringify(props.values)}`);
  if (!token) {
    return props.history.push('/login');
  } else if (token) {
    const api = new API();
    try {
      console.log(`the value of the group is ${groupname} and the user is ${username} with token $`);
      const response = await api.removeTeamMember({ groupname, username, token });
      console.log(response.status);
      if (response.detail === 'User deleted') {
        return 'success';
      } else {
        return response;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }
};
