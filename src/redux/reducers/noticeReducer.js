export default function (state = [], action) {

  switch (action.type) {
    case 'NOTIFICATION_IN':
      return [
        ...state,
        {
          text: action.text,
          id: action.id,
          pic: action.pic
        }
      ];

    case 'NOTIFICATION_OUT':
      return state.filter(item => item.id !== action.id);

    default:
      return state;
  }
}