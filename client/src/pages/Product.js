import React, { useState, useEffect } from 'react';
import { getProduct, productStar } from '../functions/product';
import SingleProduct from '../components/cards/SingleProduct';
import { Tabs } from 'antd';
import { useSelector } from 'react-redux';
import { getRelated } from '../functions/product';
import ProductCard from '../components/cards/ProductCard';
import {addToRecentlyViewed} from '../functions/user'
const { TabPane } = Tabs;
const Product = ({ match, history }) => {
  const [product, setProduct] = useState({});
  const [star, setStar] = useState(0);
  const [related, setRelated] = useState([]);
  const { slug } = match.params;
  const { user } = useSelector((state) => ({ ...state }));
  useEffect(() => {
    loadSingleProduct();
    var body = document.body;
    var scroll = document.getElementById('scroll');
    scroll.scrollTo(0, 0);
    body.scrollTo(0, 0);
    // window.scrollTo(0, 0)
  }, [slug]);

  useEffect(() => {
    if (product.ratings && user) {
      let existingRatingObject = product.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
      );
      existingRatingObject ? setStar(existingRatingObject.star) : setStar(0);
    }
  });

  useEffect(() =>{
    if(product._id && user && user.token){
     addToRecentlyViewed(product._id,user.token)
     .then((res)=>{
       console.log(res.data)
     })
    }
  })

  const loadSingleProduct = () => {
    getProduct(slug).then((res) => {
      setProduct(res.data);
      console.log(res);
      getRelated(res.data._id).then((response) => {
        console.log(response);
        setRelated(response.data);
      });
    });
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const onStarClick = (newRating, name) => {
    console.log(newRating, name);
    setStar(newRating);
    productStar(name, newRating, user.token).then((res) => {
      console.log(res.data);
      loadSingleProduct();
    });
  };
  return (
    <div>
      <SingleProduct product={product} onStarClick={onStarClick} star={star} />
      <div className='card-container'>
        <Tabs type='card'>
          <TabPane tab='Description' key='1'>
            {product.description}
          </TabPane>
          <TabPane tab='Comments' key='2'>
            <p>For product info contact 9916506682</p>
          </TabPane>
          <TabPane tab='Contact' key='3'>
            <p>For product info contact 9916506682</p>
          </TabPane>
        </Tabs>
      </div>
      <h2 className='product-section-head bestseller-head'>Related Products</h2>
      <div className='product-grid'>
        {related && related.length > 0
          ? related.map((product) => <ProductCard key={product._id} product={product} />)
          : 'no related Products'}
      </div>
    </div>
  );
};

export default Product;
