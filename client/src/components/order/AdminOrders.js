import React,{useState} from 'react'
import {Link} from 'react-router-dom'
import moment from 'moment'

const AdminOrders = ({orders,handleChangeStatus}) => {
  const [orderStatus,setOrderStatus]=useState('')

  const handleChange = (e,id)=>{
     console.log(e.target.value)
    setOrderStatus(e.target.value)
    console.log(orderStatus)
    handleChangeStatus(id,e.target.value)
  }
  return (
    <>
    <p style={{textAlign:'center'}}>    {orders.length >0 ?'User purchase orders':'no purchase orders'}
    </p>
    <div className="center-grid">
    {orders.map((o)=>(
      <div className="orders-grid">
      <Link to={`/admin/order/${o._id}`} >Order id:{o._id}</Link>
      <div className="status">
      <span>Ordered on : {moment(o.createdAt).format("MMM Do YY")}</span>
      <select value={o.orderStatus} onChange={(e)=>handleChange(e,o._id)}>
      <option value="Not Processed">Not Processed</option>
      <option value="processing">Processing</option>
      <option value="Shipped">Shipped</option>
      <option value="Out for delivery">Out for delivery</option>
      <option value="Delivered">Delivered</option>
      <option value="Cancelled">Cancelled</option>
      </select>

      </div>
      </div>
    ))}
    </div>
    </>
  )
}

export default AdminOrders
