import { stat } from "fs";

export default function (state = {
  isLogin: false,
  loggingAction: false,
  QRexpires: false,
  vaildPhoneFormat: false,
  vaildEmailFormat: false,
  codeResendin: 0,
  emailResendin: 0,
  user: null,
  channel: null,
  loading: false,
  submitting: false,
  language: 'zh',                // set language
  agent: null,
  unfinishedVideos: []
}, action) { 
  switch (action.type) {
    case 'USER_LOGIN':
      return {
        ...state,
        isLogin: true
      }
    case 'USER_LOGOUT':
      return {
        ...state,
        isLogin: false
      }
    case 'USER_LOGGING_START':
      return {
        ...state,
        loggingAction: true
      }
    case 'USER_LOGGING_END':
      return {
        ...state,
        loggingAction: false
      }
    // LOGIN FORM
    case 'QR_ACTIVITY':
      return {
        ...state,
        QRexpires: action.value
      }
    
    // REGISTER FORM
    case 'PHONE_VERIFY':
      return {
        ...state,
        vaildPhoneFormat: action.value
      }
    case 'CODE_RESEND_IN' :
      return {
        ...state,
        codeResendin: action.value || 0
      }
    case 'EMAIL_VERIFY':
      return {
        ...state,
        vaildEmailFormat: action.value
      }
    // User object
    /* -------------------------------- */
    case 'SET_USER':
      return {
        ...state,
        user: {
          ...state.user,
          ...action.user
        }
      }
    case 'SET_CHANNEL':
      return {
        ...state,
        channel: {
          ...state.channel,
          ...action.channel
        }
      }
    case 'UPDATE_ADDRESS':
      return {
        ...state,
        user: {
          ...state.user,
          address: action.addr
        }
      }
    /* -------------------------------- */
    case 'SET_LOADING_STATE':
      if (typeof action.value !== 'boolean') throw Error('missing {value} in SET_LOADING_STATE');
      return {
        ...state,
        loading: action.value
      }
    case 'SET_SUBMITTING_STATE':
      return {
        ...state,
        submitting: action.value || false
      }

    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.language || 'zh'
      }
    case 'SET_AGENT':
      return {
        ...state,
        agent: action.agent
      }

    case 'SET_UNFINISHED_VIDEOS':
      return {
        ...state,
        unfinishedVideos: action.videos
      }
    case 'DEL_UNFINISHED_VIDEO':
      const videos = state.unfinishedVideos.filter(video => video.hash !== action.hash);
      return {
        ...state,
        unfinishedVideos: videos
      }
    default:
      return state;
  }
  
}