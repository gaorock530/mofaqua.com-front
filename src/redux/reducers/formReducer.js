export default function (state = {
  repeat: 0,
  round: 0,
  freq: 0,
  week: 0,
  day: 0,
  array: null
}, action) {

  switch (action.type) {
    case 'FORM_UPDATE_REPEAT':
      return {
        ...state,
        repeat: action.value
      }
    case 'FORM_UPDATE_ROUND':
      return {
        ...state,
        round: action.value
      }
    case 'FORM_UPDATE_FREQ':
      return {
        ...state,
        freq: action.value
      };
    case 'FORM_UPDATE_WEEK':
      return {
        ...state,
        week: action.value
      };
    case 'FORM_UPDATE_DAY':
      return {
        ...state,
        day: action.value
      };
    case 'FORM_UPDATE_ARRAY':
      return {
        ...state,
        array: action.value
      }
    default:
      return state;
  }
}