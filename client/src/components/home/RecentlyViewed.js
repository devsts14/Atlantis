import React,{useEffect,useState} from 'react'
import {getRecentlyViewed} from '../../functions/user'
import ProductCard from '../cards/ProductCard';
import {useSelector} from 'react-redux'


const RecentlyViewed = () => {
  const [products,setProducts]=useState([])
  const {user}= useSelector((state)=>({...state}))

  useEffect(()=>{
    if(user && user.token){
    getRecentlyViewed(user && user.token && user.token)
    .then((res) =>{
      setProducts(res.data)
    })
  }
  },[user])

  return (
    <div className='product-section'>
          <h2 className='product-section-head'>Recently viewed</h2>
          <div className='product-grid'>
            {products.reverse().map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
  )
}

export default RecentlyViewed
