export const alertReducer=(state = {visibility:false,mess:'',time:0,type:''}, action)=> {
  switch (action.type) {
    case 'ALERT':
      return {...state,...action.payload};
    default:
      return state;
  }
}