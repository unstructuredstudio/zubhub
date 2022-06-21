import React,{useEffect} from 'react'
import {connect} from 'react-redux'
import {getActivities} from '../../store/actions/activityActions'


function Activities(props) {
   const activities = props.activities.all_activities
   useEffect(() => {
     props.getActivities()
   }, [])
   
  return (<div>
             <h1>activities</h1>
             {activities? 
               activities.map(activity => (
                <h2>{activity.title}</h2>
               ))
              :'No activities created yet!!'}
           </div>
  )
}

const mapStateToProps = state => {
  return {
    activities: state.activities,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getActivities: () => {
      return dispatch(getActivities());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Activities);