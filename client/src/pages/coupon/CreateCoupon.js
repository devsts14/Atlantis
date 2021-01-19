import React, { useState, useEffect } from 'react';
import AdminSideNav from '../../components/nav/AdminSideNav';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import DatePicker from 'react-date-picker';
import { getCoupons, removeCoupon, createCoupon } from '../../functions/coupon';
import 'react-date-picker/dist/DatePicker.css';
import { DeleteOutlined } from '@ant-design/icons';
import { Table, Tag, Space } from 'antd';
import { Popconfirm, message } from 'antd';


const CreateCoupon = () => {
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [discount, setDiscount] = useState('');
  const [coupons,setCoupons]=useState([]);
  const {user}=useSelector((state)=>({...state}))

  useEffect(()=>{
getCoupons()
.then((res)=>{
  setCoupons(res.data)

})
  },[])
  const handleSubmit = (e) => {
    e.preventDefault();
    if(name.length < 3 || name.length >8){
      toast.error('Name should me min 3 and max 6')
      return;
    }
    else{
    createCoupon({name,expiry,discount},user.token)
    .then((res) => {
setDiscount('')
setExpiry('')
setName('')
toast.success(`${res.data.name} is created`)
getCoupons()
.then((res)=>{
  setCoupons(res.data)

})
    })

    .catch((err)=>{
      console.log(err)
    } )
  }
  };

  const handleDelete = (id)=>{
    console.log(id)

    removeCoupon(id,user.token)
    .then((res)=>{
      getCoupons()
.then((res)=>{
  setCoupons(res.data)

})

})
  
  }

  function cancel(e) {
    console.log(e);
  }
  



  return (
    <div className='seperator-2'>
      <AdminSideNav />
      <div className='category pd-l-6'>

        <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor=''>
            Name
            <br/>

            <input
              type='text'
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
              autoFocus
              minLength='3'
              maxLength='8'
            />
          </label>
        </div>

        <div>
          <label htmlFor=''>
            Discount %
            <br/>
            <input
              type='text'
              onChange={(e) => setDiscount(e.target.value)}
              value={discount}
              required
            />
          </label>
        </div>

        <div>
          <label htmlFor=''>
            Expiry
            <br/>
            <DatePicker selected={new Date()} value={expiry}
            onChange={(date)=>setExpiry(date) }
            required
         />
            
          </label>
        </div>
        <button type="submit"> Save</button>
        </form>
        <table>
        <tr>
          <th>Name</th>
          <th>Discount</th>
          <th>Expiry</th>
          <th>Action</th>
        </tr>
        {coupons.map((c)=>(
          <tr>
    <td>{c.name}</td>
    <td>{c.discount} %</td>
    <td>{new Date(c.expiry).toLocaleDateString()}</td>
    <Popconfirm
    title="Are you sure to delete this task?"
    onConfirm={()=>handleDelete(c._id)}
    onCancel={cancel}
    okText="Yes"
    cancelText="No"
  ><td style={{cursor:'pointer'}}> <DeleteOutlined /> </td></Popconfirm>

  </tr>
        ))}
       
      </table>
      
      </div>
    </div>
  );
};

export default CreateCoupon;
