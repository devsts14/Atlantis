import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSideNav from '../../../components/nav/AdminSideNav';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import {
  createProduct
} from '../../../functions/product';
import {
  getCategories,
  getCategorySubs
} from '../../../functions/category';
import ProductUpdateForm from '../../../components/forms/ProductUpdateForm'
import FileUpload from '../../../components/forms/FileUpload'
import {getProduct,updateProduct} from '../../../functions/product'
const ProductUpdate = ({match,history}) => {
  const [values,setValues]=useState({
    title:'',
    description:"",
    price:"",
    category:"",
    subs:[],
    shipping:"Yes",
    images:[],
    quantity:"",
  }) 
  const [subOptions,setSubOptions]=useState([])
const [categories,setCategories]=useState([])
useEffect(()=>{
loadProduct()
loadCategories()
},[])
const {user}=useSelector((state)=>({...state}))
const [arrayOfSubIds,setArrayOfSubIds]=useState([])
const [selectedCategory,setSelectedCategory]=useState('')

const handleSubmit = (e)=>{
  e.preventDefault();
  values.subs=arrayOfSubIds;
  values.category=selectedCategory?selectedCategory:values.category;
  updateProduct(match.params.slug,values,user.token)
  .then((res)=>{
toast.success('Product updated')
history.push('/admin/products')
  })
  .catch((err)=>{
    console.log(err)
  })
}

const handleCategoryChange=(e)=>{
  e.preventDefault();
  console.log(e.target.value)
  setValues({...values,subs:[]})
  setSelectedCategory(e.target.value)
  getCategorySubs(e.target.value).
  then((res)=>{
    console.log(res.data)
setSubOptions(res.data)
  })
  if(values.category._id === e.target.value)
  {
    loadProduct()
  }
  setArrayOfSubIds([])
  // setValues({...values,[e.target.name]:e.target.value})

}
const handleChange = (e)=>{
  setValues({...values,[e.target.name]:e.target.value})

}

const loadProduct=()=>{
  getProduct(match.params.slug)
  .then((p)=>{
    setValues({...values,...p.data})
    getCategorySubs(p.data.category._id)
    .then((res)=>{
      setSubOptions(res.data)
    })
    let arr=[]
    p.data.subs.map((s)=>(arr.push(s._id)))
    setArrayOfSubIds((prev)=>arr)
    console.log(p)
  })
}

const loadCategories = () =>
getCategories().then((c) => setCategories(c.data))
  return (
    <div className='seperator-2'>
    <AdminSideNav />
    <div className="product-create pd-l-6">
    <div className="product-create-details">
    <h2>Product Update</h2>
    <hr style={{marginBottom:'1rem'}}/>
    <FileUpload values={values} setValues={setValues}/>

<ProductUpdateForm 
handleSubmit={handleSubmit} handleChange={handleChange} values={values} 
setValues={setValues} handleCategoryChange={handleCategoryChange}
categories={categories}
subOptions={subOptions}
arrayOfSubIds={arrayOfSubIds}
setArrayOfSubIds={setArrayOfSubIds}
selectedCategory={selectedCategory}

/>
    </div>
    </div>
  </div>
  )
}

export default ProductUpdate
