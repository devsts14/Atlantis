import React,{useEffect} from 'react'
import {useSelector,useDispatch} from 'react-redux'

const Alert = () => {
  const dispatch=useDispatch();
  const {alert}=useSelector((state)=>({...state}))
  useEffect(()=>{
    const time=setTimeout(()=>{
dispatch({
  type:'ALERT',
  payload:{
    visibility:false,
    mess:'',
    time:0,
    type:''
  }
})
return () => {
  clearTimeout(time)
}
    },alert.time)
  },[alert.visibility])
  return (
    <p className={alert.type?alert.type:''} style={{display:alert.visibility?'block':'none'}}>{alert.mess}</p>
  )
}

export default Alert
