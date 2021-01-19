import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import AdminSideNav from '../../../components/nav/AdminSideNav'
import { toast, ToastContainer } from 'react-toastify';
import {useSelector} from 'react-redux'
import {updateCategory,getCategory} from '../../../functions/category'
import CategoryForm from '../../../components/forms/CategoryForm'
const CategoryUpdate = ({history,match }) => {
  const [name,setName]=useState('')
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(()=>{
    loadCategory()
  },[])

  const loadCategory = () =>getCategory(match.params.slug).then((c) => {
    console.log(c)
    setName(c.data.category.name)})





  const handleSubmit=(e)=>{
    e.preventDefault();
updateCategory(match.params.slug,{name},user.token)
.then((res)=>{
  toast.success(`${res.data.name} updated successfully`)
setName('')
history.push('/admin/category')
})
.catch((err)=>{
  if(err.response.status===400){
    toast.error(err.response.data)
  }
})
  }
  return (
    <div className='seperator-2'>
      <AdminSideNav />
      <div className="pd-l-6">
      <h2>Update Category</h2>
      <CategoryForm handleSubmit={handleSubmit} name={name} setName={setName}/>
      
      </div>
      
    </div>
  )
}

export default CategoryUpdate
