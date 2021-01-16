import { combineReducers } from 'redux';

import auth from './authReducer';
import projects from './projectReducer';

export default combineReducers({
  auth,
  projects,
});
