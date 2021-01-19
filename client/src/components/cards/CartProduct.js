import React from 'react';
import ModalImage from "react-modal-image";
import {Link}  from 'react-router-dom'
import {useSelector,useDispatch} from 'react-redux'
import {toast} from 'react-toastify'
import {DeleteOutlined} from '@ant-design/icons'
import {updateCartQuantity,deleteCartItem} from '../../functions/user'
import { Popconfirm} from 'antd';
import NumberFormat from 'react-number-format';


const CartProduct = ({cart}) => {
  console.log(cart)
const {user}=useSelector((state)=>({...state}))
  const dispatch=useDispatch()
  const handleQuantityChange=(c,quant,e)=>{
    if(e.target.value == 0){
      handleRemove(c)
      return;
    }
    let count=e.target.value <1 ? 1:e.target.value;
    if(count > quant){
      toast.error(`Max available quantity: ${quant}`)
      return; 
    }
   
    if(user && user.token){
      console.log("its here")
updateCartQuantity(c,parseInt(count),user.token)
.then((res)=>{
  localStorage.setItem('cart',JSON.stringify(res.data))
      dispatch({
        type:'ADD_TO_CART',
        payload:res.data
      })
})

    }
    else{
    let cart=[]
    if(typeof window !== 'undefined'){
      if(localStorage.getItem('cart')){
        cart=JSON.parse(localStorage.getItem('cart'))
      }
      cart.map((product,i)=>{
        if(product._id==c){
        cart[i].count=parseInt(count)}
      })
      localStorage.setItem('cart',JSON.stringify(cart))
      dispatch({
        type:'ADD_TO_CART',
        payload:cart
      })
    }
    }

  }

  
  function cancel(e) {
    console.log(e);
  }

  const handleRemove=(c)=>{

    if(user && user.token){
deleteCartItem(c,user.token)
.then((res)=>{
  localStorage.setItem('cart',JSON.stringify(res.data))
  dispatch({
    type:'ADD_TO_CART',
    payload:res.data
  })
})
    }
    else{
    let cart=[]
    if(typeof window !== 'undefined'){
      if(localStorage.getItem('cart')){
        cart=JSON.parse(localStorage.getItem('cart'))
      }
      cart.map((product,i)=>{
        if(product._id===c){
        cart.splice(i,1)}
      })
      localStorage.setItem('cart',JSON.stringify(cart))
      dispatch({
        type:'ADD_TO_CART',
        payload:cart
      })
    }
  }
  }
  
  return (
    <div>
    {cart.length>0 && cart.map((c)=>(
      <div className="cart-item">
      <div style={{width:'10rem',height:'10rem'}}  className="cart-item--image">
      <ModalImage small={c.images[0].url} large={c.images[0].url}/>
      
      </div>
      <div className="cart-item--info">
        <div className="cart-item--info--main">
          <div className='title'><Link to={`/product/${c.slug}`}>{c.title}</Link>
          {c.quantity<1&& <span style={{color:'red'}}>Out of stock</span>}
          </div>
          <div className="price"> <NumberFormat value= {c.price} displayType={'text'} thousandSeparator={true} prefix={` \u20B9 `} renderText={value => <span>{value}</span>} />
           </div>
        </div>
        <div className="cart-item--info--sub">
          <div>
          <select style={{cursor:'pointer'}} className='quantity' value={c.count} onChange={(e)=>handleQuantityChange(c._id,c.quantity,e)}>
          {[...Array(c.quantity+1)].map((e,i)=>(
            <option key={i} value={i}>{i}{i==0&&'(delete)'}</option>
          ))}

          </select>
          </div>
          <div> <Popconfirm
          title="Are you sure to remove item from cart?"
          onConfirm={()=>handleRemove(c._id)}
          onCancel={cancel}
          okText="Yes"
          cancelText="No"
        ><DeleteOutlined style={{cursor:'pointer'}}/> </Popconfirm></div>
          <div className='move-to-wishlist' style={{cursor:'pointer'}}>Move to wishlist</div>
        </div>
      </div>
    </div>
    ))}
     
    </div>
  );
};

export default CartProduct;
