import * as Yup from 'yup';
import API from '../../api';
import { toast } from 'react-toastify';

export const validationSchema = Yup.object().shape({
    groupname: Yup.string().required('Please add a Team name'),
    description: Yup.string().required('A description is required'),
    projects: Yup.array(Yup.object()).required('Please choose a project'),
    admins: Yup.array(Yup.object().shape({
      title: Yup.string(),
      image: Yup.string(),
      link: Yup.string(),
      id: Yup.string(),
    })).required('Choose atleast one admin for your Team'),
    members: Yup.array(Yup.object().shape({
      title: Yup.string(),
      image: Yup.string(),
      link: Yup.string(),
      id: Yup.string()
    })).required('Add atleast one member'),
});

export const formikSchema = {
    initialValues: {
        groupname: '',
        description: '',
        projects: [],
        admins: [],
        members: [],
    },
    validationSchema: validationSchema
}

export const submitData = async (values, props) => {
    const groupMembers = [
        ...values.admins.map(admin => ({ member: admin.title, role: 'admin' })),
        ...values.members.map(member => ({ member: member.title, role: 'member' }))
      ];
      
      const data = {
        groupname: values.groupname,
        description: values.description,
        group_members: groupMembers,
        projects: values.projects
      };

      const api = new API();
      const token= props.auth.token;
      try {
        await api.createTeam({ data, token });
        toast.success(`Successfully created new Team: ${values.groupname}`)
        return props.history.push(`/teams/${values.groupname}`);

      } catch (error) {
        console.error(error);
        return toast.error('Oops! That failed. Recheck the fields and try again')
      }
};
