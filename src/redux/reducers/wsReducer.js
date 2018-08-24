export default function (state = {connection: false}, action) {
  switch (action.type) {
    case 'LOAD_WEBSOCKET':
      return {
        connection: action.ws
      }
    default:
      return state;
  }
}