import React,{useState} from 'react'
import {Modal,Button} from 'antd'
import {toast} from 'react-toastify'
import {useSelector} from 'react-redux'
import {
  ShoppingCartOutlined,
  HeartOutlined,

  StarOutlined,
  StarTwoTone
} from '@ant-design/icons';
import {useHistory,useParams} from 'react-router-dom'
const RatingModal = ({children}) => {
  const {user} =useSelector((state=>({...state})))
  const [modalVisible,setModalVisible]=useState(false)
  let history=useHistory()
  let params=useParams()
  const handleModal=()=>{
    if(user && user.token){
      setModalVisible(true)
    }
    else{
      history.push({
        pathname:'/login',
        state: {from:`/product/${params.slug}`}
      })
    }
  }
  return (
    <>
    <div onClick={handleModal} className="action-buttons-single">
    <StarOutlined  className="review-icon icon"/>
    <span>{user ?'Leave rating':'Login to leave rating'}</span>{' '}
  </div> 
  <Modal title="Leave your rating" centered visible={modalVisible}
  onOk={()=>{
    setModalVisible(false)
    toast.success('Thanks for your review')
  }}
  onCancel={()=>setModalVisible(false)}
  >
  {children}
  </Modal>
  </>
  )
}

export default RatingModal
