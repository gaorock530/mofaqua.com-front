export default function (state = {
  sidebar: false,             // ture if Main Side Bar menu shows
  smallWindow: false,         // true if Main search bar shows in small-window
  expendActive: false,        // track Main Nav Tabs: Tools/Notification/Icon
  searchText: '',             // store main Search text
  showTop: false,             // when Scrolling, shows Top button
  sidebarEle: null,
  registerForm: true,
  loginMethod: true,          
  setupPage: null,            // set Setup page nav tabs
  changeSetup: null,          // change method: pass/phone/email
  error: null,                // store any Error, process differently
  temp: null,                 // store a Temp value
  pageLoading: false,         // indicate is the page is loading essential data
  city: [],
  area: [],
  channelSearch: false,       // track Chennel Search action, search/input
  channelTab: 'home',         // set Channel page Nav tabs
  mininav: false,             // detect Channel page Mini Nav open/close
  uploadFiles: {},            // tracking all uploading files
  redirect: null,             // set redirect path '/tankview/123'
  lazyLoad: {},               // store lazyloading data
  edit: null,                 // record edit channel page id
  note: null,                 // record note string to render component
}, action) {
  switch (action.type){
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebar: !state.sidebar
      };
    case 'TOOGLE_SMALL_WINDOW':
      return {
        ...state,
        smallWindow: !state.smallWindow
      }

    case 'SET_EXPEND_ACTIVE':
      return {
        ...state,
        expendActive: (action.value === state.expendActive) ? false : typeof action.value === 'string'? action.value: false
      }

    case 'SEARCH_TEXT_CHANGE':
      return {
        ...state,
        searchText: action.value
      }

    case 'TOGGLE_TOP':
      return {
        ...state,
        showTop: action.value
      }

    case 'SET_SIDEBAR':
      return {
        ...state,
        sidebarEle: action.element
      }

    case 'SET_REGISTER_FORM':
      return {
        ...state,
        registerForm: action.value
      }

    case 'SET_LOGIN_METHOD':
      return {
        ...state,
        loginMethod: action.value
      }

    case 'SET_SETUP_PAGE':
      return {
        ...state,
        setupPage: action.value || null
      }
    case 'SET_CHANGE_SETUP':
      return {
        ...state,
        changeSetup: action.value
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.error || null
      }
    case 'SET_TEMP':
      return {
        ...state,
        temp: action.value || null
      }
    case 'SET_PAGELOAD':
      return {
        ...state,
        pageLoading: action.value
      }
    case 'SET_CITY':
      return {
        ...state,
        city: action.value
      }
    case 'SET_AREA':
      return {
        ...state,
        area: action.value
      }
    case 'TOGGLE_CHANNEL_SEARCH':
      return {
        ...state,
        channelSearch: !state.channelSearch
      }
    case 'SET_CHANNEL_TAB':
      return {
        ...state,
        channelTab: action.value
      }

    case 'TOGGLE_MINI_NAV':
      return {
        ...state,
        mininav: !state.mininav
      }
    case 'ADD_UPLOAD_FILE':
      if (state.uploadFiles[action.id]) {
        state.uploadFiles[action.id].url = action.url;
      } else {
        state.uploadFiles[action.id] = {};
        state.uploadFiles[action.id].url = action.url;
        state.uploadFiles[action.id].percentage = 0;
        // state.uploadFiles[action.id].file.push(action.file);
      }
      state.uploadFiles[action.id].isUploading = true;
      return {
        ...state,
        uploadFiles: state.uploadFiles
      }
    case 'FILE_UPLOADING':
      state.uploadFiles[action.id].percentage = action.percent;
      return {
        ...state,
        uploadFiles: state.uploadFiles
      }

    case 'FILE_UPLOADED':
      state.uploadFiles[action.id].isUploading = false;
      return {
        ...state,
        uploadFiles: state.uploadFiles
      }
    case 'FILE_DESTROY':
      delete state.uploadFiles[action.id];
      return {
        ...state,
        uploadFiles: state.uploadFiles
      }
    case 'SET_REDIRECT_PATH':
      return {
        ...state,
        redirect: action.path
      }
    case 'SET_LAZYLOAD_DATA':
      /**
       * @param {String} tab tab name for store data
       * @param {Array} data data of the tab
       */
      if (action.data && !action.data instanceof Array) throw Error('data has to be Array');
      const update = state.lazyLoad;
      if (action.tab) {
        if (!update[action.tab].data) {
          update[action.tab].data = action.data;
        }
        else update[action.tab].data = [...update[action.tab].data, ...action.data];
      }
      return {
        ...state,
        lazyLoad: action.tab?update:{}
      }
    case 'UPDATE_LAZYLOAD_DATA':
      /**
       * @param {String} tab tab name for store data
       * @param {ID} id data id
       * @param {Object} update the object contains updates
       */
      if (!action.tab || !action.id || !action.update) throw Error('arguments not correct!');
      const newItems = state.lazyLoad[action.tab].data.map(old => { // items.data -> array of object
        if (old.id === action.id) {
          return {...old, ...action.update}
        }
        return old;
      });
      const newData = state.lazyLoad;
      newData[action.tab].data = newItems;

      return {
        ...state,
        lazyLoad: newData
      }
    case 'SET_LAZYLOAD_STATE':
      /**
       * @param {String} tab tab name for store data
       * @param {Boolean} state loading state {true-loading, false-finish, null-done}
       */
      const updateState = state.lazyLoad;
      if (action.tab) {
        if (!updateState[action.tab]) updateState[action.tab] = {};
        updateState[action.tab].state = action.state;
      } else throw Error('miss tab name OR state');
      return {
        ...state,
        lazyLoad: updateState
      }
    case 'SET_EDIT_PAGE':
      const edit = action.edit || null;
      return {
        ...state,
        edit
      }
    case 'SET_NOTE':
      return {
        ...state,
        note: action.note || null
      }
    default:
      return state;
  }
}
