import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useSelector, useDispatch } from 'react-redux';
import { createPaymentIntent } from '../../functions/stripe';
import { Divider } from 'antd';
import NumberFormat from 'react-number-format';
import {createOrder,clearCartAll} from  '../../functions/user'
import {toast} from 'react-toastify'
import {useHistory} from 'react-router-dom'

const StripeCheckout = () => {
  const dispatch = useDispatch();
  const history=useHistory()
  const { user, checkout } = useSelector((state) => ({ ...state }));
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState('');
  const [disable, setDisable] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [cartTotal, setCartTotal] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const stripe = useStripe();
  const elements = useElements();
  useEffect(() => {
    createPaymentIntent(user.token, checkout.appliedCoupon).then((res) => {
      console.log(res.data);
      setClientSecret(res.data.clientSecret);
      setCartTotal(res.data.total);
      setTotalAfterDiscount(res.data.totalDiscount);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: e.target.name.value,
        },
      },
    });
    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      createOrder(payload,checkout.address,cartTotal,totalAfterDiscount,user.token)
      .then((res) =>{
        if(res.data.ok){
          if(typeof window !== 'undefined'){
             localStorage.removeItem('cart') 
             localStorage.removeItem('activeAddress')
             localStorage.removeItem('appliedCoupon')
        }
          dispatch({
            type:'ADD_TO_CART',
            payload:[]
          })

          dispatch({
            type:'CHECK_OUT',
            payload:{
              appliedCoupon:'',
              orderId:res.data.newOrder._id
              // address:address
            }
          })
          toast.success('Order placed successfully')
        
          clearCartAll(user.token)
          history.push('/user/payment/result')
        }
      })
      console.log(JSON.stringify(payload, null, 4));
      setProcessing(false);
      setSucceeded(true);

    }
  };

  const handleChange = async (e) => {
    setDisable(e.empty);
    setError(e.error ? e.error.message : '');
  };

  const cartStyle = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#32325d',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };
  return (
    <>
     
      <div className='payment-info'>
       
        <div className='flexit'>
          <div className='payment-info-item'>
            <span>Cart total</span>
            <NumberFormat value= {cartTotal} displayType={'text'} thousandSeparator={true} prefix={` \u20B9 `} renderText={value => <div>{value}</div>} />
          </div>

          <div className='payment-info-item'>
            <span>Discount</span>
            
            <NumberFormat value= {totalAfterDiscount > 0
              ? (cartTotal - totalAfterDiscount).toFixed(2)
              : 0} displayType={'text'} thousandSeparator={true} prefix={` \u20B9 -`} renderText={value => <div>{value}</div>} />
          </div>
        </div>
        <div className='payment-info-item'>
          <span>Payable amount</span>
          <NumberFormat value={totalAfterDiscount > 0
            ? cartTotal - (cartTotal - totalAfterDiscount).toFixed(2)
            : cartTotal} displayType={'text'} thousandSeparator={true} prefix={` \u20B9 `} renderText={value => <div>{value}</div>} />

         
        </div>
      </div>
      <div className='stripe-page'>
      <p className={ succeeded  ? 'result-message' : 'result-message hidden'}>
           Payment successfull 
      </p>
        <form onSubmit={handleSubmit} id='payment-form' className='stripe-form'>
          <CardElement
            id='card-element'
            options={cartStyle}
            onChange={handleChange}
          />
          <button
            className='stripe-button'
            disabled={processing || disable || succeeded}
          >
            <span id='button-text'>
              {processing ? (
                <div className='spinner' id='spinner'></div>
              ) : (
                'Pay'
              )}
            </span>
          </button>
          {error && (
            <div className='card-error' role={alert}>
              {error}
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default StripeCheckout;
