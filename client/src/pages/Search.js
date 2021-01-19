import React, { useState, useEffect } from 'react';
import {
  getProductsByCount,
  fetchProductsByFilter,
  getAllProds,
} from '../functions/product';
import StarRating from 'react-star-ratings';
import { getSubs } from '../functions/sub';
import { getCategories } from '../functions/category';
import { useSelector, useDispatch } from 'react-redux';
import ProductCard from '../components/cards/ProductCard';
import { Slider } from 'antd';
import { Select } from 'antd';
const { Option } = Select;

const Search = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [subs, setSubs] = useState([]);
  const [sub, setSub] = useState('');
  const [rating, setRating] = useState(0);
  let dispatch = useDispatch();
  const { search } = useSelector((state) => ({ ...state }));
  const { text } = search;
  const [price, setPrice] = useState([0, 0]);
  const [ok, setOk] = useState(false);
  const [sort, setSort] = useState('');

  useEffect(() => {
    loadAllProducts();
    loadAllCategories();
    loadAllSubs();
  }, []);

  const loadAllCategories = () => {
    getCategories().then((res) => {
      setCategories(res.data);
    });
  };

  const loadAllSubs = () => {
    getSubs().then((res) => {
      setSubs(res.data);
    });
  };

  useEffect(() => {
    setPrice([0, 0]);
    setCategory('');
    setSub('');
    setRating('');
    setPrice([0, 0]);
    setSort('');
    getAll();
  }, [text]);

  const loadAllProducts = () => {
    getProductsByCount(12).then((p) => {
      setProducts(p.data);
    });
  };

  const fetchProducts = (arg) => {
    fetchProductsByFilter(arg).then((res) => {
      setProducts(res.data);
    });
  };

  const getAll = () => {
    getAllProds().then((res) => {
      setProducts(res.data);
    });
  };
  useEffect(() => {
    fetchProducts({ price: price, category, sort, rating,sub });
  }, [ok]);

  useEffect(() => {
    fetchProducts({ price: price, category, rating, sort, sub });
  }, [category, rating, sort, sub]);

  const handleSlider = (value) => {
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    });
    setPrice(value);
    setTimeout(() => {
      setOk(!ok);
    }, 300);
  };
  const handleCategoryChange = (value) => {
    setSub('');
    setCategory(value);
  };
  const handleSubChange = (value) => {
    setSub(value);
  };
  const handleRatingsChange = (value) => {
    setRating(value);
  };
  const handleSortChange = (value) => {
    setSort(value);
  };

  const searched = (text) => (c) => c.title.toLowerCase().includes(text);

  return (
    <>
      <div className='filter'>
        <Select
          className='filter-item'
          value={category}
          defaultValue=''
          style={{
            width: 200,
            border: category && '1px solid red',
          }}
          onChange={handleCategoryChange}
        >
          <Option value=''>Select category</Option>
          {categories &&
            categories.length > 0 &&
            categories.map((cat) => (
              <Option key={cat._id} value={cat._id}>{cat.name}</Option>
            ))}
        </Select>
        {category && (
          <Select
            className='filter-item'
            defaultValue=''
            value={sub}
            style={{
              width: 200,
              border: category && '1px solid red',
              marginLeft: '2rem',
            }}
            onChange={handleSubChange}
          >
            <Option value=''>Select subcategory</Option>
            {subs &&
              subs.length > 0 &&
              subs
                .filter((s) => s.parent === category)
                .map((cat) => <Option key={cat._id} value={cat._id}>{cat.name}</Option>)}
          </Select>
        )}
        <Select
          value={rating}
          className='filter-item'
          style={{
            width: 250,
            border: rating && '1px solid red',
            marginLeft: '2rem',
          }}
          defaultValue=''
          onChange={handleRatingsChange}
        >
          <Option value=''>Average rating</Option>
          <Option value={1}>
            {' '}
            <StarRating
              isSelectable={false}
              starSpacing='2px'
              starRatedColor='red'
              editing={false}
              starDimension='10px'
              rating={1}
            />{' '}
            & up
          </Option>
          <Option value={2}>
            <StarRating
              isSelectable={false}
              starSpacing='2px'
              starRatedColor='red'
              editing={false}
              starDimension='10px'
              rating={2}
            />{' '}
            & up
          </Option>
          <Option value={3}>
            <StarRating
              isSelectable={false}
              starSpacing='2px'
              starRatedColor='red'
              editing={false}
              starDimension='10px'
              rating={3}
            />{' '}
            & up
          </Option>
          <Option value={4}>
            <StarRating
              isSelectable={false}
              starSpacing='2px'
              starRatedColor='red'
              editing={false}
              starDimension='10px'
              rating={4}
            />{' '}
            & up
          </Option>
        </Select>
        <span className='filter-item'>
          <span> Price range</span>
          <Slider
            style={{ width: 200, marginLeft: '1.5rem' }}
            tipFormatter={(v) => ` \u20B9 ${v}`}
            range
            value={price}
            max='4999'
            onChange={handleSlider}
          />
        </span>
      </div>
      <div className='sort'>
        <Select
          style={{
            width: 200,
            border: rating && '1px solid red',
          }}
          defaultValue=''
          onChange={handleSortChange}
        >
          <Option value=''>Sort by</Option>
          <Option value='lowest'>Price:low to high</Option>
          <Option value='highest'>Price:High to low</Option>
          <Option value='toprated'>Avg customer review</Option>
          <Option value='newset'>Newest arrivals</Option>
        </Select>
      </div>
      <div className='product-grid'>
      {products.length === 0 && <p>No matching products</p>}
        {products.filter(searched(text)).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </>
  );
};

export default Search;
