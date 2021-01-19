import React,{useState,useEffect} from 'react';
import AdminSideNav from '../../../components/nav/AdminSideNav';
import {getProductsByCount} from '../../../functions/product'
import AdminProductCard from '../../../components/cards/AdminProductCard'
import LocalSearch from '../../../components/forms/LocalSearch'
import {deleteProduct} from '../../../functions/product'
import {toast} from 'react-toastify'
import {useSelector} from 'react-redux'

const ProductsList = () => {
const [products,setProducts]=useState([])
const [keyword, setKeyword] = useState('');
const searched = (keyword) => (c) => c.title.toLowerCase().includes(keyword);
const {user}=useSelector((state)=>({...state}))
useEffect(() => {
  loadAllProducts()
},[])

const loadAllProducts=()=>{
  getProductsByCount(100)
  .then((res)=>{
    setProducts(res.data)
  })
  .catch((err) => {
    console.log(err)
  })
}

const handleDelete = (slug)=>{
  deleteProduct(slug,user.token).
  then((res) =>{
    loadAllProducts()
toast.error(`${res.data.title} is deleted`)
  } )
  .catch((err)=>{
    console.log(err) 
  })

}
  return (
    <div className='seperator-2'>
    <AdminSideNav />
      <div className="pd-l-6">
      <LocalSearch keyword={keyword} setKeyword={setKeyword} />
      {products.length ===0 && <p className="no-content">No products</p>}

      <div className="product-list">
      {products.filter(searched(keyword)).map((product)=>(
        <AdminProductCard handleDelete={handleDelete} key={product._id} product={product}/>
      ))}
      {products.length>0 && products.filter(searched(keyword)).length===0&&<p className="no-content">No matching products</p>}
      </div>
      </div>
    </div>
  );
};

export default ProductsList;
