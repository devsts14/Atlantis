import React,{useEffect,useState,Fragment} from 'react'
import {getSub} from '../../../functions/sub'
import ProductCard from '../../../components/cards/ProductCard'
import { Breadcrumb } from 'antd';
import { HomeOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom'

const ProductsBasedOnSubs = ({match}) => {
  const [products,setProducts]=useState([])
  const [sub,setSub]=useState({})
  useEffect(()=>{
loadSubs()
  },[match.params.slug])

  const loadSubs=()=>{
    getSub(match.params.slug)
    .then((res)=>{
      console.log(res.data.sub)
      setProducts(res.data.products)
      setSub(res.data.sub)
    })
  }
  return (
<Fragment>
    <Breadcrumb style={{textAlign:'center'}}>
    <Breadcrumb.Item>
    <Link to='/'>

      <HomeOutlined />
      </Link>
    </Breadcrumb.Item>
    
    <Breadcrumb.Item >
    <Link to={`/products/${sub.parent && sub.parent._id}`}>
      <span>{sub.parent && sub.parent.name}</span>
      </Link>
    </Breadcrumb.Item>
   
    <Breadcrumb.Item> <Link to={`/subs/product/${match.params.slug}`}>{match.params.slug}    </Link></Breadcrumb.Item>

  </Breadcrumb>
    <div className='product-section'>
          <h2 className='product-section-head bestseller-head'>{sub.name} </h2>
          <div className='product-grid'>
            {products && products.length>0 ? products.map((product) => (
              <ProductCard product={product} />
            )):<p style={{color:'gray'}}>No products</p>}
          </div>
        </div>
        </Fragment>
  )
}

export default ProductsBasedOnSubs
