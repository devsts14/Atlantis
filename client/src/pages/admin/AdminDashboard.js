import React, { useState, useEffect } from 'react';
import AdminSideNav from '../../components/nav/AdminSideNav';
import { Route, Switch } from 'react-router-dom';
import ProductList from './product/ProductsList';
import ProductCreate from './product/ProductCreate';
import {getOrders,changeStatus} from '../../functions/admin'
import {useSelector,useDispatch} from 'react-redux'
import {toast} from 'react-toastify'
import AdminOrders from '../../components/order/AdminOrders'
const AdminDashboard = () => {
  const [orders,setOrders]=useState([])
  const {user}=useSelector((state)=>({...state}))
  useEffect(() => {
loadOrders()
  },[])

  const loadOrders=()=>{
    getOrders(user.token)
    .then((res)=>{
      setOrders(res.data)
      console.log(res.data)
    })
  }

  const handleChangeStatus=(orderId,orderStatus)=>{
    console.log(orderId,orderStatus)
    changeStatus(orderId,orderStatus,user.token)
.then((res)=>{
  toast.success("Status updated")
  loadOrders();
})
  }
  return (
    <div className='seperator-2'>
      <AdminSideNav />
      <div className=' pd-l-6'>
     
        <AdminOrders orders={orders} handleChangeStatus={handleChangeStatus}/>
      </div>
    </div>
  );
};

export default AdminDashboard;
