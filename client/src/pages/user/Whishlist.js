import React, { useState, useEffect } from 'react';
import { getWishlist, removeWishlist } from '../../functions/user';
import { useSelector} from 'react-redux';
import WishlistProductCard from '../../components/cards/WishlistProductCard';
import { Breadcrumb } from 'antd';
import { HomeOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom'

const Whishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));
  useEffect(() => {
    loadWishlist();
  }, []);
  const loadWishlist = () => {
    getWishlist(user.token).then((res) => {
      setWishlist(res.data.wishlist);
    });
  };

  const handleRemove = (productId) => {
    removeWishlist(productId, user.token).then((res) => {
      loadWishlist();
    });
  };
  return (
    <div className='seperator-2'>
      <div>
      <Breadcrumb style={{textAlign:'center'}}>
      <Breadcrumb.Item>
      <Link to='/'><HomeOutlined /></Link>
      
      </Breadcrumb.Item>
      <Breadcrumb.Item>
      <Link to='/user/wishlist'>Wishlist</Link>
      
      </Breadcrumb.Item>
      
    </Breadcrumb>
        <h2 className='product-section-head bestseller-head'>Wishlist</h2>

        <div className='product-grid'>
        {wishlist.length ===0 && <p>No products in wishlist </p>}
          {wishlist &&
            wishlist.map((product) => (
              <WishlistProductCard
                product={product}
                handleRemove={handleRemove}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Whishlist;
