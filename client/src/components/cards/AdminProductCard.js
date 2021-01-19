import React from 'react';
import {Image, Video, Transformation, CloudinaryContext,Placeholder} from 'cloudinary-react';
import {EditOutlined,DeleteOutlined} from '@ant-design/icons'
import {Link} from 'react-router-dom'
import { Modal, Button, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

const AdminProductCard = ({ product,handleDelete}) => {
  function showDeleteConfirm(slug,title) {
    confirm({
      title: 'Confirm delete?',
      icon: <ExclamationCircleOutlined />,
      content: `confirm to delete ${title}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
handleDelete(slug)      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  return (
   
      <div className='card'>
        <div className='card-image'>
        <Image cloud_name="devsts14" publicId={`${product.images.length !==0 && product.images[0].public_id}.jpg`} >
  <Transformation height="150" width="200" crop="pad" background="#eeeded"/>
</Image>
        </div>
        <div className='card-description'>
        <h3>{product.title}</h3>
        <div className="action-buttons">
        <Link className="action-icon edit" to={`/admin/product/${product.slug}`}><EditOutlined/></Link>
        <span className="action-icon delete"><DeleteOutlined onClick={()=>showDeleteConfirm(product.slug,product.title)}/></span>
        </div>

        </div>
      </div>
  );
};

export default AdminProductCard;
