import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSideNav from '../../../components/nav/AdminSideNav';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import {
  createCategory,
  getCategories,
  removeCategory,
} from '../../../functions/category';
import { createSub, getSubs, removeSub } from '../../../functions/sub';
import CategoryForm from '../../../components/forms/CategoryForm';
import LocalSearch from '../../../components/forms/LocalSearch';
import CategoryDropdown from '../../../components/dropdownCat/CategoryDropdown'
const SubCreate = () => {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [subs, setSubs] = useState([]);
  const [category, setCategory] = useState("");
  const { user } = useSelector((state) => ({ ...state }));
  const [keyword, setKeyword] = useState('');
  const [collapse,setCollapse]=useState(false)
  useEffect(() => {
    loadCategories();
    loadSubs();
  }, []);
  const loadSubs = () =>
  getSubs().then((s) => setSubs(s.data));

  const loadCategories = () =>
    getCategories().then((c) => setCategories(c.data));
  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

  const handleRemove = async (slug) => {
    removeSub(slug, user.token)
      .then((res) => {
        loadSubs()
        toast.error(`${res.data.name} deleted succesfully`);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast.error(err.response.data);
        }
      });
  };
const toggleCollapse=()=>{
  setCollapse(!collapse)

}
  const handleSubmit = (e) => {
    e.preventDefault();
    createSub({ name,parent:category }, user.token)
      .then((res) => {
        loadSubs()
        toast.success(`Category "${name}" created successfully`);
        setName('');
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast.error(err.response.data);
        }
      });
  };
  return (
    <div className='seperator-2'>
      <AdminSideNav />
      <div className='category pd-l-6'>
      <div className="category-save">

        <h2>Create Category</h2>
        <div className="center-select">
        <select onChange={(e)=>setCategory(e.target.value)} name="sub category">
        <option>Select Category</option>
        {categories.length>0 && categories.map((c)=>(<option key={c._id} value={c._id}>{c.name}</option>))}
        </select>
        </div>
        <CategoryForm
          handleSubmit={handleSubmit}
          name={name}
          setName={setName}
          placeholder={'Sub Category name'}
        />
        </div>

        <hr/>
        <div className="category-filter">

        <LocalSearch keyword={keyword} setKeyword={setKeyword}/>
        {categories.length ===0 && <p className="no-content">No categories</p>}

      <div>
       {
         categories.filter(searched(keyword)).map((c)=>(
          <CategoryDropdown c={c} subs={subs} handleRemove={handleRemove}/>

         
         ))
       }
       {categories.length>0 && categories.filter(searched(keyword)).length===0&&<p className="no-content">No matching categories</p>}



      </div>
      </div>
      </div>
    </div>
  );
};

export default SubCreate;
