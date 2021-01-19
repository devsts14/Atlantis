import React, { useEffect,useState } from 'react';
import { showAverage } from '../../functions/rating';

import {
  Image,
  Video,
  Transformation,
  CloudinaryContext,
  Placeholder,
} from 'cloudinary-react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Modal, Button, Space ,Tooltip} from 'antd';
import {
  ExclamationCircleOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import _ from 'lodash'
import {useSelector,useDispatch} from 'react-redux'
import {userCart} from '../../functions/user'
import {toast} from 'react-toastify'

const { confirm } = Modal;


const WishlistProductCard = ({ product,handleRemove }) => {
  const [tooltip,setTooltip]=useState(product.quantity<1?'Out of stock':'Click to add')
  useEffect(() => {
    console.log('re rend');
  }, []);
  const dispatch=useDispatch()
  const {user,cart}=useSelector((state)=>({...state}))
  const handleAddCart=()=>{

    if(product.quantity<1){
      toast.error('Out of stock')
      return;
    }
    if(user && user.token){
      // send to cart
      let cart={}
      cart={
            ...product,
            count:1
          }
      userCart(cart,user.token)
      .then((res)=>{
        console.log(res.data)
        localStorage.setItem('cart',JSON.stringify(res.data))
  dispatch({
        type:'ADD_TO_CART',
        payload:res.data
      })


      dispatch({
        type:'SET_VISIBLE',
        payload:true
      })
      
      dispatch({
        type:'ALERT',
        payload:{
          visibility:true,
          mess:'Product added to cart',
          time:4000,
          type:'success'
        }
      })
      handleRemove(product._id)
     

      })
      // save responsse in local storage and redux state
    }
    else{
      let cart=[]
      if(typeof window !== 'undefined'){
        if (localStorage.getItem('cart')){
          cart=JSON.parse(localStorage.getItem('cart'))
        }
       const present= cart && cart.length>0 && cart.find((p)=>{
         return p._id === product._id
       })
       if(present){
         const ind=cart.indexOf(present)
         console.log(present,'present')
         cart[ind].count+=1
       }
       else{
        cart.push({
          ...product,
          count:1
        })
      }
        let unique =_.uniqWith(cart,_.isEqual)
        localStorage.setItem('cart',JSON.stringify(unique))
        setTooltip('added')
        dispatch({
          type:'ADD_TO_CART',
          payload:unique
        })
  
        dispatch({
          type:'SET_VISIBLE',
          payload:true
        })
        
        dispatch({
          type:'ALERT',
          payload:{
            visibility:true,
            mess:present?'quantity updated':'Product added to cart',
            time:4000,
            type:present?'warning':'success'
          }
        })
       
  
        
      }

    }
   
  }
  return (
    <div className='card'>
      <div className='card-image'>
        <div style={{ position:'relative'}}>
        <i class="fas fa-times remove" onClick={()=>handleRemove(product._id)}></i>          <Image
            cloud_name='devsts14'
            publicId={`${
              product.images.length !== 0 && product.images[0].public_id
            }.jpg`}
          >
            <Transformation
              height='150'
              width='150'
              crop='pad'
              background='#eeeded'
            />
          </Image>
        </div>
      </div>
      <div className='card-description'>
        <p>&#8377; {product.price}</p>
        <h3>
          <Link to={`/product/${product.slug}`}>{product.title}</Link>
        </h3>

        <div className='action-buttons'>
          {product && product.ratings && product.ratings.length > 0 ? (
            showAverage(product)
          ) : (
            <span className='no-ratings-yet'>No rating yet</span>
          )}
          <Tooltip title={tooltip}>
          <button disabled={product.quantity < 1} onClick={handleAddCart} className='add-to-cart'>
          {product.quantity <1 ? 'Out of stock' :'Move to cart'}
           <ShoppingCartOutlined />
          </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default WishlistProductCard;
