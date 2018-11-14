export default function (state = [], action) {
  
  switch (action.type) {
    case 'GET_MESSAGE':
      return [
        ...action.data
      ]
    case 'UPDATE_MESSAGE':
      const upd = [];
      for (let i of state) {
        if (i.id === action.id) i.read = true;
        upd.push(i);
      }
      return [...upd];
    
    case 'ADD_MESSAGE':
      const a = state.slice();
      a.unshift(action.data);
      return a;
    
    case 'DEL_MESSAGE':
      return state.filter(i => !~action.ids.indexOf(i.id));
    
    case 'GET_MORE_MESSAGE':
      const w = [];
      for (let i of state) {
        if (action.id === i.id) i.msg = action.msg;
        w.push(i);
      }
      return w;

    default:
      return state;
  }
}