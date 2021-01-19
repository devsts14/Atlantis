import React,{useEffect,useState,Fragment} from 'react'
import {getProductsBasedOnCategory} from '../../functions/product'
import ProductCard from '../../components/cards/ProductCard'
import { Breadcrumb } from 'antd';
import { HomeOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom'

const ProductsBOC = ({match}) => {
  const [products,setProducts]=useState([])
  useEffect(()=>{
    getProductsBasedOnCategory(match.params.categoryId)
    .then((res)=>{
      console.log(res.data);
setProducts(res.data)
    })

  },[])
  
  return (
    <Fragment>
    <Breadcrumb style={{textAlign:'center'}}>
    <Breadcrumb.Item>
    <Link to='/'><HomeOutlined /></Link>
      
    </Breadcrumb.Item>
    <Breadcrumb.Item >
    <Link to={`/products/${match.params.categoryId}`}> <span>{products.length>0  && products[0].category.name}</span></Link> 
    </Breadcrumb.Item>
  </Breadcrumb>

    <div className='product-section'>
    { <h2 className='product-section-head bestseller-head'>{products.length>0  && products[0].category.name} </h2>}
          <div className='product-grid'>
            {products && products.length>0 ? products.map((product) => (
              <ProductCard product={product} />
            )):<p style={{color:'gray'}}>No products</p>}
          </div>
        </div>
        </Fragment>
  )
}

export default ProductsBOC
