import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import AdminSideNav from '../../../components/nav/AdminSideNav'
import { toast, ToastContainer } from 'react-toastify';
import {useSelector} from 'react-redux'
import {
  createCategory,
  getCategories,
  removeCategory,
} from '../../../functions/category';
import { createSub, getSubs, removeSub,getSub ,updateSub} from '../../../functions/sub';
import CategoryForm from '../../../components/forms/CategoryForm'
const SubUpdate = ({history,match }) => {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [parent, setParent] = useState("");
  const { user } = useSelector((state) => ({ ...state }));
  const [keyword, setKeyword] = useState('');
  useEffect(() => {
    loadCategories();
    loadSubs();
  }, []);
  const loadSubs = () =>
  getSub(match.params.slug).then((s) => {setName(s.data.name)
    setParent(s.data.parent)
  });

  const loadCategories = () =>
    getCategories().then((c) => setCategories(c.data));




  const handleSubmit=(e)=>{
    e.preventDefault();
updateSub(match.params.slug,{name,parent},user.token)
.then((res)=>{
  toast.success(`${res.data.name} updated successfully`)
setName('')
history.push('/admin/sub')
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
      <div>
        <select onChange={(e)=>setParent(e.target.value)} name="sub category">
        <option>Select Category</option>
        {categories.length>0 && categories.map((c)=>(<option selected={c._id ===parent} key={c._id} value={c._id}>{c.name}</option>))}
        </select>
        </div>
      </div>
      
      
    </div>
  )
}

export default SubUpdate
