import axios from 'axios'

export const createOrUpdateUser=async (authtoken)=>{
  return await axios.post(`${process.env.REACT_APP_API}/create-or-update-user`,{},{
    headers:{
      authtoken
    }
  })
}

export const currentUser=async (authtoken)=>{
  return await axios.post(`${process.env.REACT_APP_API}/current-user`,{},{
    headers:{
      authtoken
    }
  })
}


export const roleBasedRedirect=(history,res)=>{
  let intended = history.location.state;
  if(intended){
    history.push(intended.from)
  }
  else{
    if(res.data.role==='admin'){
      history.push('/admin/dashboard')
    }
    else {
      history.push('/user/dashboard')
    }
  }

}


export const currentAdmin=async (authtoken)=>{
  return await axios.post(`${process.env.REACT_APP_API}/current-admin`,{},{
    headers:{
      authtoken
    }
  })
}
