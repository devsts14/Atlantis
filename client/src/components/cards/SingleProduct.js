import React, { useState,useEffect } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import {
  ShoppingCartOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import StarRating from 'react-star-ratings';
import RatingModal from '../modal/RatingModal';
import { showAverage } from '../../functions/rating';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { userCart, addToWishlist,addToRecentlyViewed } from '../../functions/user';

const SingleProduct = ({ product, onStarClick, star }) => {
  const {
    title,
    images,
    description,
    slug,
    price,
    category,
    subs,
    shipping,
    quantity,
    sold,
    _id,
  } = product;
  const [recentlyViewed,setRecentlyViewed]=useState([])
  const [tooltip, setTooltip] = useState('Click to add');
  const dispatch = useDispatch();
  const { user} = useSelector((state) => ({ ...state }));

  

 
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
    });
  };
  return (
    <div className='single-product-view-grid'>
      <div className='product-corousel'>
        <h4>{title}</h4>

        <Carousel
          showStatus={false}
          stopOnHover={true}
          showArrows={true}
          autoPlay
          infiniteLoop
          thumbWidth={50}
        >
          {images && images.map((i) => <img src={i.url} key={i.public_id} />)}
        </Carousel>
      </div>
      <div>
        <div className='product-item-info'>
          <h2>
            {title}
            {product && product.ratings && product.ratings.length > 0
              ? showAverage(product)
              : <p style={{textAlign:'center'}}>No rating yet</p>}
          </h2>

          <div className='grid-2'>
            <span>Price</span>
            <span>&#8377; {price}</span>
          </div>
          <div className='grid-2'>
            <span>Category</span>
            <span>{category && category.name}</span>
          </div>
          <div className='grid-2'>
            <span>Sub categories</span>
            <span className='sub-cat'>
              {subs && subs.map((p) => <span key={p._id}>{p.name}</span>)}
            </span>
          </div>
          <div className='grid-2'>
            <span>Shipping</span>
            <span>{shipping && shipping}</span>
          </div>
          <div className='grid-2'>
            <span>Quantity</span>
            <span>{quantity && quantity}</span>
          </div>
          <div className='grid-2'>
            <span>Sold</span>
            <span>{sold && sold}</span>
          </div>
          <div className='action-buttons'>
            <div
              onClick={
                product.quantity > 0
                  ? handleAddCart
                  : console.log('out of stock')
              }
              className='action-buttons-single cart'
            >
              <ShoppingCartOutlined className='cart-icon icon' />
              <span>
                {' '}
                {product.quantity < 1 ? 'Out of stock' : 'Add to cart'}
              </span>
            </div>
            <div className='action-buttons-grid'>
              <div className='action-buttons-single'>
                <HeartOutlined className='wishlist-icon icon' />
                <span onClick={() => handleAddWishlist(product._id)}>
                  Add to Wishlist
                </span>
              </div>

              <RatingModal>
                <StarRating
                  rating={star}
                  starRatedColor='red'
                  changeRating={onStarClick}
                  isSelectable={true}
                  numberOfStars={5}
                  name={_id}
                  starDimension='40px'
                />
              </RatingModal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
