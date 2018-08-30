export default function (state = {
  isLogin: false,
  loggingAction: false,
  QRexpires: false,
  vaildPhoneFormat: false,
  vaildEmailFormat: false,
  phoneResendin: 0,
  emailResendin: 0,
  user: null,
  channel: null,
  loading: false,
  submitting: false,
  language: 'zh'                // set language
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
    case 'PHONE_RESEND_IN' :
      return {
        ...state,
        phoneResendin: action.value
      }
    case 'EMAIL_VERIFY':
      return {
        ...state,
        vaildEmailFormat: action.value
      }
    case 'EMAIL_RESEND_IN' :
      return {
        ...state,
        emailResendin: action.value
      }
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
    default:
      return state;
  }
  
}