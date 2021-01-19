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
import ProductCreateForm from '../../../components/forms/ProductCreateForm'
import FileUpload from '../../../components/forms/FileUpload'
const ProductCreate = () => {
  const [values,setValues]=useState({
    title:'',
    description:"",
    price:"",
    category:"",
    subs:[],
    shipping:"Yes",
    images:[],
    quantity:"",
    categories:[]
  })
  const [subOptions,setSubOptions]=useState([])
  const [showSub,setShowSub]=useState(false)
  const {title,description,price,category,subs,shipping,images,quantity,categories}=values;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () =>
    getCategories().then((c) => setValues({...values,categories:c.data}));

  const {user}=useSelector((state)=>({...state}))
  const handleSubmit=(e)=>{
e.preventDefault();
createProduct(values,user.token)
.then(res=>{
  console.log(res)
  toast.success("Product created")
  setValues({ title:'',
  description:"",
  price:"",
  category:"",
  subs:[],
  shipping:"Yes",
  images:[],
  quantity:"",
  categories:[]})
})
.catch((err)=>{
  if (err.response.status === 400) {
    toast.error(err.response.data);
  }
})
  }

  const handleChange=(e)=>{
setValues({...values,[e.target.name]:e.target.value})
  }

  const handleCategoryChange=(e)=>{
    e.preventDefault();
    console.log(e.target.value)
    setValues({...values,subs:[],category:e.target.value})
    getCategorySubs(e.target.value).
    then((res)=>{
      console.log(res.data)
setSubOptions(res.data)
setShowSub(true)
    })
    // setValues({...values,[e.target.name]:e.target.value})

  }
  return (
    <div className='seperator-2'>
    <AdminSideNav />

    <div className="product-create pd-l-6">
    <div className="product-create-details">
    <h2>Product create</h2>
    <hr style={{marginBottom:'1rem'}}/>
    <FileUpload values={values} setValues={setValues}/>

<ProductCreateForm handleSubmit={handleSubmit} handleChange={handleChange} values={values} handleCategoryChange={handleCategoryChange}
subOptions={subOptions}
showSub={showSub}
setValues={setValues}
/>
    </div>
    </div>
  </div>
  )
}

export default ProductCreate
