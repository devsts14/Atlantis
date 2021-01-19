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
import CategoryForm from '../../../components/forms/CategoryForm';
import LocalSearch from '../../../components/forms/LocalSearch';
import { Modal, Button, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

const CategoryCreate = () => {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));
  const [keyword, setKeyword] = useState('');
  useEffect(() => {
    loadCategories();
  }, []);

  function showDeleteConfirm(slug) {
    confirm({
      title: 'Are you sure delete this task?',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        console.log('OK');
        handleRemove(slug)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  
  

  const loadCategories = () =>
    getCategories().then((c) => setCategories(c.data));
  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

  const handleRemove = async (slug) => {
    removeCategory(slug, user.token)
      .then((res) => {
        loadCategories();
        toast.error(`${res.data.name} deleted succesfully`);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast.error(err.response.data);
        }
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createCategory({ name }, user.token)
      .then((res) => {
        loadCategories();
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
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
            placeholder={'Category name'}
          />
        </div>
          
      <hr/>
        <div className="category-filter">
          <LocalSearch keyword={keyword} setKeyword={setKeyword} />
          {categories.length ===0 && <p className="no-content">No categories</p>}
          <div className="grid-2">
            {categories.filter(searched(keyword)).map((c) => (
              <div className="category-filter--divide" key={c._id}> 
              {c.name}
                <div className="update-delete">
                <span onClick={() => showDeleteConfirm(c.slug)}><i class="far fa-trash-alt"></i></span>
                <Link to={`/admin/category/${c.slug}`}><i class="fas fa-edit"></i></Link>
                </div>
              </div>
            ))}

            {categories.length>0 && categories.filter(searched(keyword)).length===0&&<p className="no-content">No matching categories</p>}
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCreate;
