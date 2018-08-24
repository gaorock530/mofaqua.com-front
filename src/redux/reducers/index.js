import { combineReducers } from 'redux';

import wsReducer from './wsReducer';
import pageReducer from './pageReducer';
import userReducer from './userReducer';
import noticeReducer from './noticeReducer';
import formReducer from './formReducer';


export default combineReducers({
  page: pageReducer,
  ws: wsReducer,
  user: userReducer,
  notification: noticeReducer,
  form: formReducer
});