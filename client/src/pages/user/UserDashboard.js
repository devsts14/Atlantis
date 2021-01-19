import React ,{useEffect,useState}from 'react';
import SideNav from '../../components/nav/SideNav'
import {getOrders} from '../../functions/user'
import {useSelector,useDispatch} from 'react-redux'
import {toast} from 'react-toastify'
import moment from 'moment'
import {Link} from 'react-router-dom'
const UserDashboard = () => {

  const [orders,setOrders]=useState([])
  const {user}=useSelector((state)=>({...state}))


  useEffect(()=>{
loadUserOrders()
  },[])


  const loadUserOrders=()=>{
    getOrders(user.token)
    .then((res)=>{
      console.log(JSON.stringify(res.data,null,4))
      setOrders(res.data)
    })
  }
  return (
   
    <div >
    <p style={{textAlign:'center'}}>    {orders.length >0 ?'User purchase orders':'no purchase orders'}
    </p>
    <div className="center-grid">
    {orders.map((o)=>(
      <Link to={`/user/order/${o._id}`} className="orders-grid">
      <span>Order id:{o._id}</span>
      <div className="status">
      <span>Ordered on : {moment(o.createdAt).format("MMM Do YY")}</span>
      <span className="order-status">{o.orderStatus}</span>
      </div>
      </Link>
    ))}
    </div>
    </div>
 
  )
}

export default UserDashboard
