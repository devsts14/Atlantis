import React,{useEffect} from 'react'
import {loadStripe} from '@stripe/stripe-js'
import {Elements} from '@stripe/react-stripe-js'
import StripeCheckout from '../components/stripe/StripeCheckout'
import {useSelector} from 'react-redux'


const promise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const Payment = ({history}) => {
  const {cart,checkout}=useSelector((state)=>({...state}))
  useEffect(()=>{
    if( cart && cart.length === 0 || checkout && checkout.address===''){
      history.push('/checkout')
    }
  },[])

  return (
    <div >
    <Elements stripe={promise}>
      
     <StripeCheckout/>
    </Elements>
    </div>
  )
}

export default Payment
