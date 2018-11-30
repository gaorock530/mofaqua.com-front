
export default function (state = {
  permit: null,
  percentage: 0,              
  process: 0,                 // 0 - no work, 1 - uploading, 2 - converting, 3 - making manifest
  inProcess: false,
  allDone: false,
  url: null
}, action) {
  switch (action.type) {
    case 'READY_FOR_UPLOAD':
      return {
        ...state,
        permit: action.p || null,
        url: action.url || null,
      }

    case 'FILE_UPLOADING':
      return {
        ...state,
        process: 1,
        inProcess: true,
        percentage: action.percent || 0
      }

    case 'FILE_CONVERTING':
      return {
        ...state,
        process: 2,
        percentage: action.percent || 0
      }
    case 'FILE_MAKING_MANIFEST':
      return {
        ...state,
        process: 3,
        percentage: action.percent || 0
      }
    case 'FILE_UPLOADED':
      return {
        ...state,
        process: 0,
        inProcess: false,
        allDone: true
      }
    case 'FILE_DESTROY':
      return {
        permit: null,
        percentage: 0,              
        process: 0,                 // 0 - no work, 1 - uploading, 2 - converting, 3 - making manifest
        inProcess: false,
        allDone: false,
        url: null
      }
    default: 
      return state;
  }
}
