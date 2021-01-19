import React,{useState} from 'react'
import {auth} from '../../firebase'
import {toast} from 'react-toastify'
import SideNav from '../../components/nav/SideNav'

const Password = () => {
  const [password,setPassword]=useState('')
  const handleSubmit=async (e)=>{
e.preventDefault();
await auth.currentUser.updatePassword(password)
.then(()=>{
toast.success("Password updated sucessfully")
setPassword("")
})
.catch(err=>{
  toast.error(err.message)

})
  }
  return (
    <div className="seperator-2">
<SideNav/>
      <form className="center-form" onSubmit={handleSubmit}>
      <div className="form-details">
      <h1>Change password</h1>
      <div className="password-input">
      <i class="fas fa-key key"></i>
      <input autoFocus placeholder="new password" 
      value={password} type="password" onChange={(e)=>setPassword(e.target.value)}/>
      </div>
      <button className="submit-btn" disabled={!password || password.length<6} type="submit">Submit</button>
      </div>
      </form>
     
    </div>
  )
}

export default Password
