import React, { useEffect, useState } from 'react';
import Address from '../components/address/Adress';
import { getCartTotal, clearCartAll, applyCoupon } from '../functions/user';
import { useSelector, useDispatch } from 'react-redux';
import Alert from '../components/alert/Alert';
import NumberFormat from 'react-number-format';

const Checkout = ({ history }) => {
  const dispatch = useDispatch();
  const { cart, user, checkout } = useSelector((state) => ({ ...state }));
  const [total, setTotal] = useState('');
  const [userCart, setUserCart] = useState([]);
  const [address, setAddress] = useState(checkout.address);
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(checkout.appliedCoupon);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);

  useEffect(() => {
    if (user && user.token) {
      getCartTotal(user.token).then((res) => {
        console.log(res.data);
        setTotal(res.data.total);
        setUserCart(res.data.userCart);
      });
    }
  }, []);
useEffect(()=>{
  if(cart && cart.length===0){
    history.push('/cart')
  }

},[])
  useEffect(() => {
    if (appliedCoupon !== '') {
      applyCoupon(user.token, appliedCoupon).then((res) => {
        if (res.data.totalDiscount) {
          setAppliedCoupon(res.data.coupon);
          setTotalAfterDiscount(res.data.totalDiscount);
          dispatch({
            type: 'ALERT',
            payload: {
              visibility: true,
              mess: `Coupon ${appliedCoupon} applied`,
              time: 20000,
              type: 'success',
            },
          });
        }
        if (res.data.err) {
          dispatch({
            type: 'ALERT',
            payload: {
              visibility: true,
              mess: `Invalid coupon`,
              time: 4000,
              type: 'warning',
            },
          });
        }
      });
    }
  }, []);

  const removeCoupon=()=>{
    setAppliedCoupon('')
    setTotalAfterDiscount('')
  }

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    applyCoupon(user.token, coupon).then((res) => {
      if (res.data.totalDiscount) {
        setAppliedCoupon(res.data.coupon);
        setTotalAfterDiscount(res.data.totalDiscount);
        dispatch({
          type: 'ALERT',
          payload: {
            visibility: true,
            mess: `Coupon ${appliedCoupon} applied`,
            time: 20000,
            type: 'success',
          },
        });
      }
      if (res.data.err) {
        dispatch({
          type: 'ALERT',
          payload: {
            visibility: true,
            mess: `Invalid coupon`,
            time: 4000,
            type: 'warning',
          },
        });
      }
    });
  };

  const handleCheckout = () => {
    if (address === '') {
      dispatch({
        type: 'ALERT',
        payload: {
          visibility: true,
          mess: `Please select address`,
          time: 4000,
          type: 'warning',
        },
      });
      return;
    }
    localStorage.setItem('activeaddress', JSON.stringify(address));
    localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
    dispatch({
      type: 'CHECK_OUT',
      payload: {
        appliedCoupon: appliedCoupon,
        address: address,
      },
    });
    history.push('/user/payment');
  };
  return (
    <div style={{ margin: '1rem 0' }} className='checkout'>
      <div className='checkout-address'>
        <Address address={address} setAddress={setAddress} />
      </div>
      <div className='summ'>
        <h3 className='order-summary-head'>Order summary</h3>
        <div className='order-summary summary'>
          {userCart &&
            userCart.length > 0 &&
            userCart.map((c) => (
              <div className='order-summary-item '>
                <span style={{justifySelf:'flex-start'}}>{c.title}</span><span> x {c.count} =</span> <NumberFormat value= {c.price * c.count} displayType={'text'} thousandSeparator={true} prefix={` \u20B9 `} renderText={value => <span>{value}</span>} />
              </div>
            ))}
          <div className='order-summary-total'>
            <span>Total:</span>
            <strong><NumberFormat value= {total} displayType={'text'} thousandSeparator={true} prefix={` \u20B9 `} renderText={value => <span>{value}</span>} /></strong>
            <div>
              {totalAfterDiscount > 0 && `${appliedCoupon} coupon applied`}
            </div>
            <div style={{color:'red'}}>
              {totalAfterDiscount > 0 &&<>
                Total after discount:
                <NumberFormat value= {totalAfterDiscount} displayType={'text'} thousandSeparator={true} prefix={` \u20B9 `} renderText={value => <>{value}</>} /></>
               }
            </div>
          </div>
        </div>
        <div>
          <form className='applyCoupon' style={{marginTop:'1rem',marginBottom:'1rem'}} onSubmit={handleCouponSubmit}>
            <Alert />
            <label>
              Apply Coupon
              {appliedCoupon && <span className='appliedCoupon'>{appliedCoupon}<span onClick={removeCoupon} className='removeCoupon'>x</span></span>}
              <input placeholder='coupon code'  onChange={(e) => setCoupon(e.target.value)} type='text' />
            </label>
            <input style={{cursor:'pointer'}} type='submit' value='Apply' />
          </form>
          <button
            onClick={handleCheckout}
            // disabled={address === '' ? true : false}
            className="submit-btn"
            style={{width:'100%'}}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
