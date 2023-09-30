import API from '../../api/api'

export const addMember = async(props) =>{
  if(!props.auth.token) return props.history.push('/login')

  const groupMembers = [
    ...props.values.admins.map(admin => ({member:admin.title, role:'admin'})),
    ...props.values.members.map(member => ({member:member.title, role:'member'}))
  ]


  // this is a json object with key group_members that is an array of objects of type member/role
  const data = {
    group_members:groupMembers,
  }

  const api = new API()
  const token = props.auth.token;
  const groupname = props.match.params.groupname

  try{

    const response = await api.addTeamMembers({groupname,data,token})
    if(response.detail === 'User added'){
      return 'success'
    }else{
      return response;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}