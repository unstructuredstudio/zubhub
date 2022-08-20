import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CustomButton from '../../components/button/Button';
import styles from '../../assets/js/styles/views/activity_details/activityDetailsStyles';
import commonStyles from '../../assets/js/styles';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

function ActivityDetails(props) {
  const classes = useStyles();
  const common_classes = useCommonStyles();
  const { t } = props;
  const { id } = props.match.params;
  const { activities, setActivities } = useSelector(state => state);

  const activity = activities.all_activities.filter(item => item.id === id)[0];
  console.log('activity_details', activities, activity);
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
    </div>
  );
}

export default ActivityDetails;
