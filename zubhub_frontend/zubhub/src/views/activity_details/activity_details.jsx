import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { deleteActivity } from './activityDetailsScripts';
import CustomButton from '../../components/button/Button';
import styles from '../../assets/js/styles/views/activity_details/activityDetailsStyles';
import commonStyles from '../../assets/js/styles';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function ActivityDetails(props) {
  const classes = useStyles();
  const history = useHistory();
  const common_classes = useCommonStyles();
  const { t } = props;
  const { id } = props.match.params;
  const { activities, auth } = useSelector(state => state);

  const activity = activities.all_activities.filter(item => item.id === id)[0];
  console.log('activity_details', activities, activity);
  const handleDelete = () => {
    console.log('delete clicked')
    deleteActivity({ token: auth.token, id: id, history: history });
  };
  return (
    <div>
      Activity_details
      <p>{activity.title}</p>
      <Link to={`/activities/${id}/edit`}>
        <CustomButton
          className={common_classes.marginLeft1em}
          variant="contained"
          primaryButtonStyle
        >
          {t('activityDetails.activity.edit')}
        </CustomButton>
      </Link>
      <CustomButton
        className={common_classes.marginLeft1em}
        variant="contained"
        primaryButtonStyle
        onClick={() => handleDelete()}
      >
        {t('activityDetails.activity.delete.label')}
      </CustomButton>
    </div>
  );
}

export default ActivityDetails;
