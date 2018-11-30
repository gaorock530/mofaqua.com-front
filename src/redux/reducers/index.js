import { combineReducers } from 'redux';

import wsReducer from './wsReducer';
import pageReducer from './pageReducer';
import userReducer from './userReducer';
import noticeReducer from './noticeReducer';
import formReducer from './formReducer';
import msgReducer from './msgReducer';
import uploadReducer from './uploadReducer';


export default combineReducers({
  page: pageReducer,
  ws: wsReducer,
  user: userReducer,
  notification: noticeReducer,
  form: formReducer,
  message: msgReducer,
  fileUpload: uploadReducer
});