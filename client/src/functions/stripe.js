import axios from 'axios'

export const createPaymentIntent =(authtoken,appliedCoupon)=>{
  return axios.post(`${process.env.REACT_APP_API}/create-payment-intent`,{appliedCoupon},
  {
    headers:{
      authtoken
    }
  })
}