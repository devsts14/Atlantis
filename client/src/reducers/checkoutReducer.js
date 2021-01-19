let coupon ='';
let add=''

if(typeof window !== 'undefined'){
  if(localStorage.getItem('activeaddress')){
    add=JSON.parse(localStorage.getItem('activeaddress'))
  }
  if(localStorage.getItem('appliedCoupon')){
    coupon=JSON.parse(localStorage.getItem('appliedCoupon'))

  }
  else {
    coupon=''
    add=''
  }
}



export const checkoutReducer=(state = {appliedCoupon:coupon,address:add,orderId:''}, action)=> {
  switch (action.type) {
    case 'CHECK_OUT':
      return {...state,...action.payload};
    default:
      return state;
  }
}