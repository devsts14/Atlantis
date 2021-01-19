import React, { useEffect, useState } from 'react';
import { showAverage } from '../../functions/rating';
import {
  Image,
  Transformation,
} from 'cloudinary-react';
import { Link } from 'react-router-dom';
import { Modal, Tooltip } from 'antd';
import {
  ShoppingCartOutlined,
} from '@ant-design/icons';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { userCart, addToWishlist } from '../../functions/user';
import { toast } from 'react-toastify';
import { getWishlist, removeWishlist } from '../../functions/user';



const ProductCard = ({ product }) => {
  const [tooltip, setTooltip] = useState(
    product.quantity < 1 ? 'Out of stock' : 'Click to add'
  );
  const [wishlist, setWishlist] = useState([]);

  const dispatch = useDispatch();
  const { user} = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if(user && user.token){
    loadWishlist();
    }
  }, [user]);
  const loadWishlist = () => {
    if(user && user.token){
    getWishlist(user.token).then((res) => {
      setWishlist(res.data.wishlist);
    });
  }}


  const handleAddCart = () => {
    if (product.quantity < 1) {
      toast.error('Out of stock');
      return;
    }
    if (user && user.token) {
      // send to cart
      let cart = {};
      cart = {
        ...product,
        count: 1,
      };
      userCart(cart, user.token).then((res) => {
        localStorage.setItem('cart', JSON.stringify(res.data));
        dispatch({
          type: 'ADD_TO_CART',
          payload: res.data,
        });

        dispatch({
          type: 'SET_VISIBLE',
          payload: true,
        });

        dispatch({
          type: 'ALERT',
          payload: {
            visibility: true,
            mess: 'Product added to cart',
            time: 4000,
            type: 'success',
          },
        });
      });
      // save responsse in local storage and redux state
    } else {
      let cart = [];
      if (typeof window !== 'undefined') {
        if (localStorage.getItem('cart')) {
          cart = JSON.parse(localStorage.getItem('cart'));
        }
        const present =
          cart &&
          cart.length > 0 &&
          cart.find((p) => {
            return p._id === product._id;
          });
        if (present) {
          const ind = cart.indexOf(present);
          cart[ind].count += 1;
        } else {
          cart.push({
            ...product,
            count: 1,
          });
        }
        let unique = _.uniqWith(cart, _.isEqual);
        localStorage.setItem('cart', JSON.stringify(unique));
        setTooltip('added');
        dispatch({
          type: 'ADD_TO_CART',
          payload: unique,
        });

        dispatch({
          type: 'SET_VISIBLE',
          payload: true,
        });

        dispatch({
          type: 'ALERT',
          payload: {
            visibility: true,
            mess: present ? 'quantity updated' : 'Product added to cart',
            time: 4000,
            type: present ? 'warning' : 'success',
          },
        });
      }
    }
  };
  const handleAddWishlist = (productId) => {
    console.log(productId);
    addToWishlist(productId, user.token).then((res) => {
      toast.success('Added to wishlist');
      loadWishlist()
    });
  };

  const handleRemove = (productId) => {
    removeWishlist(productId, user.token).then((res) => {
      loadWishlist();
    });
  };
  return (
    <div className='card'>
      <div className='card-image'>
        <div style={{position:'relative'}}>
       { user && user.token &&
        
       (wishlist.length>0 && wishlist.filter((p)=>{ return p._id === product._id}).length>0?   <Tooltip title='Remove from wishlist'>   <i className="fas fa-heart remove heart" style={{color:'red'}} onClick={() => handleRemove(product._id)}></i></Tooltip>  :
       <Tooltip title='Add to wishlist'>
        <i  className="far fa-heart remove heart" onClick={() => handleAddWishlist(product._id)}></i>
        </Tooltip>

        )}
          <Image
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
            <button
              disabled={product.quantity < 1}
              onClick={handleAddCart}
              className='add-to-cart'
            >
              {product.quantity < 1 ? 'Out of stock' : 'Add to cart'}
              <ShoppingCartOutlined />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
