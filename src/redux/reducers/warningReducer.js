export default function (state = {
  text: '',
  fn: null
}, action) {
  switch (action.type) {
    case 'INIT_WARNING':
      return {
        text: action.text,
        fn: action.fn
      }
    case 'RESET_WARNING':
      return {
        text: '',
        fn: null
      }
    default:
      return state
  }
}