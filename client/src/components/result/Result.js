import React,{useEffect} from 'react'
import { Result, Button } from 'antd';
import {Link} from 'react-router-dom'
import {useSelector} from 'react-redux'

const ResultIt = ({history}) => {
  const {checkout}= useSelector((state)=>({...state}))
  useEffect(()=>{
    if(checkout && checkout.orderId===''){
      history.push('/')
    }

  },[])
  return (
    <Result
    status="success"
    title="Successfully Purchased!"
    subTitle={`Order number: ${checkout.orderId}`}
    extra={[
      <Button type="primary" key="console">
      <Link to='/'>Home</Link>
       
      </Button>,
      <Button key="buy">
      <Link to='/user/dashboard'>
      Orders</Link></Button>,
    ]}
  />
  )
}

export default ResultIt
