import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import logo from '../../images/seaweed.png';
import firebase from 'firebase';
import { useDispatch, useSelector } from 'react-redux';
import Search from '../forms/Search';
import { Badge } from 'antd';

const Header = () => {
  let dispatch = useDispatch();
  let history = useHistory();
  let { user, cart } = useSelector((state) => ({ ...state }));

  const logout = () => {
    firebase.auth().signOut();
    dispatch({
      type: 'LOGOUT',
      payload: null,
    });
    history.push('/login');
  };
  const redirectFocus = () => {
    history.push('/search');
  };

  const dropDown = ()=>{
    <>
    <input type='checkbox' name='account1' id='account1' hidden />
    <label className='account' for='account1'>
      <i class='far fa-user nav-icon'></i>
      <i class='fas fa-angle-down angle-down'></i>
      <span className="icon-desc">{user ? user.email.split('@')[0] : 'Account'}</span>
      <div className='dropdown'>
        {!user && (
          <div className='authit'>
            <h1 className='welcome'>Welcome</h1>
            <span className='welcome-info'>
              To access account and manage order
            </span>
            <Link className='dropdown-btn' to='/login'>
              Login/Register
            </Link>
          </div>
        )}
        {user && (
          <div className='auth-success'>
            {user.role === 'admin' ? (
              <Link to='/admin/dashboard'>
                <i class='fas fa-tachometer-alt'></i>Dashboard
              </Link>
            ) : (
              <Link to='/user/dashboard'>
                <i class='fas fa-tachometer-alt'></i>Dashboard
              </Link>
            )}

            <Link to='/register'>
              <i class='far fa-bookmark'></i>Whishlist
            </Link>
            <span onClick={logout}>
              <i class='fas fa-sign-out-alt'></i>Logout
            </span>
          </div>
        )}
      </div>
    </label>
    </>
  }
  return (
    <>
      <nav className='navbar'>
        <Link to='/' className='nav-left'>
          <img src={logo} alt='logo' className='logo' />
          <span className='brand'>Atlantis</span>
        </Link>
        <div className='nav-right'>
       

          <div className='cart'>
            <Link to='/cart'>
              <Badge count={cart.length} offset={[-30, 0]}>
                <i className='fas fa-shopping-cart nav-icon'></i>
              </Badge>
            </Link>
            <span className="icon-desc">Cart</span>
          </div>
        </div>
      </nav>
      <Search />
    </>
  );
};

export default Header;
