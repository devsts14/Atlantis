import React, { useEffect, useState } from 'react';
import {
  getProducts,
  getProductsCount,
} from '../../functions/product';
import ProductCard from '../cards/ProductCard';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import LoadingCard from '../cards/LoadingCard';
import { Pagination } from 'antd';
const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [productsCount, setProductsCount] = useState(0);
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    loadAllProducts();
  }, [page]);

  useEffect(() => {
    getProductsCount().then((res) => {
      setProductsCount(res.data);
    });
  }, []);

  const loadAllProducts = () => {
    setLoading(true);
    getProducts('createdAt', 'desc', page).then((p) => {
      setProducts(p.data);
      setLoading(false);
    });
  };

  return (
    <div className='home-section'>
      {loading ? (
        <LoadingCard count={4} />
      ) : (
        <div className='product-section'>
          <h2 className='product-section-head'>New Arrivals</h2>
          <div className='product-grid'>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
      <Pagination
        style={{ textAlign: 'center' }}
        current={page}
        total={(productsCount / 4) * 10}
        onChange={(value) => setPage(value)}
      />
    </div>
  );
};

export default NewArrivals;
