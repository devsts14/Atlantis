import React,{useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import CartProduct from '../components/cards/CartProduct';
import { getCartTotal, clearCartAll,realTime,userCart,checkOOS } from '../functions/user';
import { Popconfirm} from 'antd';
import NumberFormat from 'react-number-format';
import {toast} from 'react-toastify'


const Cart = ({ history }) => {
  const { cart, user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  useEffect(() =>{
    if(user && user.token!==''){
realTime(user && user.token && user.token)
.then((res)=>{
  console.log(res.data);
  localStorage.setItem('cart', JSON.stringify(res.data));
  dispatch({
    type: 'ADD_TO_CART',
    payload: res.data,
  });

})
    }
  },[user])
  console.log(cart)
  const saveOrderToDb = () => {
    //
    if (user && user.token) {
      getCartTotal(user.token).then((res) => {
        console.log(res.data);
      });
      checkOOS(user.token)
      .then((res)=>{
        if(res.data.msg==='ok'){
          history.push('/checkout');

        }
        else{
          toast.error(res.data.msg)
        }
      })
    }
  };
  const getTotal = () => {
    return cart.length>0 && cart.reduce((p, n) => {
      return p + n.count * n.price;
    }, 0);
  };

  function cancel(e) {
    console.log(e);
  }

  const clearCart = () => {
    if (user && user.token) {
      clearCartAll(user.token).then((res) => {
        localStorage.setItem('cart', []);
        dispatch({
          type: 'ADD_TO_CART',
          payload: [],
        });
      });
    } else {
      localStorage.setItem('cart', []);
      dispatch({
        type: 'ADD_TO_CART',
        payload: [],
      });
    }
  };
  return (
    <div>
      <p className='cart-head'>
        Cart / {cart.length} Products in cart{' '}
        <span>
          Total:
          <NumberFormat value= {getTotal()} displayType={'text'} thousandSeparator={true} prefix={` \u20B9 `} renderText={value => <span>{value}</span>} />
        </span>
      </p>
      <p className='clearCart-cont'>
        <Popconfirm
          title='Confirm clear cart?'
          onConfirm={clearCart}
          onCancel={cancel}
          okText='Yes'
          cancelText='No'
          disabled={cart.length > 0 ? false : true}
        >
          <button
            disabled={cart.length > 0 ? false : true}
            className='clearCart'
          >
            Clear cart
          </button>
        </Popconfirm>
      </p>
      {cart.length === 0 && (
        <p className='no-items'>
          <span>No items in Cart</span>{' '}
          <Link to='/search'> Continue shopping</Link>
        </p>
      )}
      <div className='responsive-cart'>
        <CartProduct cart={cart} />
        {cart.length > 0 && (
          <div className='cart-summary'>
            <p className='summary-head'>Order summary</p>
            {cart &&
              cart.map((c, i) => (
                <div className='summary-item' key={i}>
                  <p className='summary-item-indi'>
                    <span style={{justifySelf:'flex-start'}}>{c.title}</span>  <span className='count'>x {c.count} =</span> 
                    <NumberFormat value= {c.price * c.count} displayType={'text'} thousandSeparator={true} prefix={` \u20B9 `} renderText={value => <span>{value}</span>} />
                  </p>
                </div>
              ))}
            <hr />
            <div className='total'>
              <span>
                Total:{' '}
                <b>
                <NumberFormat value= {getTotal()} displayType={'text'} thousandSeparator={true} prefix={` \u20B9 `} renderText={value => <span>{value}</span>} />
                </b>
              </span>

              {user ? (
                <span style={{cursor:'pointer'}}  onClick={saveOrderToDb}>
                  Proceed to checkout
                </span>
              ) : (
                <span>
                  <Link to={{ pathname: '/login', state: { from: 'cart' } }}>
                    Login to checkout
                  </Link>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
