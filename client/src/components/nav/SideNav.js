import React from 'react'
import {Link} from 'react-router-dom'

const SideNav = () => {
  const active=(urlPath)=>{
    if(window.location.pathname===urlPath){
      return 'active'
    }
    else {
      return;
    }
  }
  return (
    <nav className="side-nav">
    <Link className={active('/user/dashboard')} to="/user/dashboard"><i class="fas fa-tachometer-alt"></i> Dashboard</Link>
    <Link className={active('/user/password')} to="/user/password"><i class="fas fa-key"></i> Password</Link>
    <Link className={active('/user/whishlist')} to="/user/whishlist"> <i class="fas fa-bookmark"></i> Whishlist</Link>

    </nav>
  )
}

export default SideNav
