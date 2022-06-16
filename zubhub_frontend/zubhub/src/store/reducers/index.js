import { combineReducers } from 'redux';

import auth from './authReducer';
import projects from './projectReducer';
import activities from './activityReducer';

export default combineReducers({
  auth,
  projects,
  activities
});
