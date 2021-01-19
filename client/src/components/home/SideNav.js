import React, { useEffect, useState, Fragment } from 'react';
import { Layout, Menu } from 'antd';
import Headers from '../nav/Header';
import { getCategories } from '../../functions/category';
import { getCartTotal, clearCartAll,realTime,userCart,checkOOS } from '../../functions/user';

import { getSubs } from '../../functions/sub';
import { Link, useHistory } from 'react-router-dom';
import firebase from 'firebase';
import { useDispatch, useSelector } from 'react-redux';

const { SubMenu } = Menu;
const { Content, Footer, Sider } = Layout;

const SideNav = ({ children}) => {
  // States
  const [categories, setCategories] = useState([]);
  const [subs, setSubs] = useState([]);
  const [collapsed,setCollapsed]=useState(true)

  // redux state
  const { user } = useSelector((state) => ({ ...state }));

  let dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    loadCategories();
    loadSubs();
  }, []);

  useEffect(() =>{
    if(user && user.token!==''){
realTime(user && user.token && user.token)
.then((res)=>{
  console.log(res.data);
  localStorage.setItem('cart', JSON.stringify(res.data));
  dispatch({
    type: 'ADD_TO_CART',
    payload: res.data,
  });

})
    }
  },[user])


  // load sub categories
  const loadSubs = () => getSubs().then((s) => setSubs(s.data));

  // load categories
  const loadCategories = () => {
    getCategories().then((res) => {
      setCategories(res.data);
    });
  };

  // logout
  const logout = () => {
    firebase.auth().signOut();
    dispatch({
      type: 'LOGOUT',
      payload: null,
    });
    localStorage.removeItem('activeaddress');
    localStorage.removeItem('appliedCoupon');
    localStorage.removeItem('cart')
    dispatch({
      type: 'CHECK_OUT',
      payload: {
        appliedCoupon: '',
        address: '',
      },
    });
    dispatch({
      type: 'ADD_TO_CART',
      payload: '',
    });
    dispatch({
      type:''
    })
    history.push('/login');
  };


  const handleLogout = ()=>{
    logout();
    setCollapsed(!collapsed)
  }

  return (
    <Layout>
      <Sider
        style={{ zIndex: '10' }}
        breakpoint='xxl'
        collapsedWidth='0'
        collapsed={collapsed}
        width='250'
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          setCollapsed(collapsed)
          console.log(collapsed, type);
        }}
      >
        <Menu theme='dark' mode='inline' defaultSelectedKeys={['4']}>
          <div className='logo'>Account </div>
          {!user && (
            <Fragment>
              <Menu.Item className={history.location.pathname === '/login'?"ant-menu-item ant-menu-item-only-child ant-menu-item-selected":"ant-menu-item ant-menu-item-only-child"} onClick={()=>setCollapsed(!collapsed)}  key={'login'}>
                <Link  to={`/login`}>Login</Link>
              </Menu.Item>
              <Menu.Item className={history.location.pathname === '/register'?"ant-menu-item ant-menu-item-only-child ant-menu-item-selected":"ant-menu-item ant-menu-item-only-child"} onClick={()=>setCollapsed(!collapsed)}  key={'register'}>
                <Link to={`/register`}>Register</Link>
              </Menu.Item>
            </Fragment>
          )}

          {user && user.role === 'admin' && (
            <Fragment>
              <SubMenu key={'admin'} title={'Admin'}>
                <Menu.Item className={history.location.pathname === '/admin/dashboard'?"ant-menu-item ant-menu-item-only-child ant-menu-item-selected":"ant-menu-item ant-menu-item-only-child"} onClick={()=>setCollapsed(!collapsed)} key={'dashboard'}>
                  <Link to={`/admin/dashboard`}>Dashboard</Link>
                </Menu.Item>
              </SubMenu>
            </Fragment>
          )}
          {user && (
            <SubMenu key={'user'} title={user.name}>
              <Menu.Item className={history.location.pathname === '/user/dashboard'?"ant-menu-item ant-menu-item-only-child ant-menu-item-selected":"ant-menu-item ant-menu-item-only-child"} onClick={()=>setCollapsed(!collapsed)} key={'orders'}>
                <Link to={`/user/dashboard`}>Orders</Link>
              </Menu.Item>
              <Menu.Item className={history.location.pathname === '/user/wishlist'?"ant-menu-item ant-menu-item-only-child ant-menu-item-selected":"ant-menu-item ant-menu-item-only-child"}  onClick={()=>setCollapsed(!collapsed)} key={'wishlist'}>
                <Link to={`/user/wishlist`}>Wishlist</Link>
              </Menu.Item>
              <Menu.Item className={history.location.pathname === '/user/password'?"ant-menu-item ant-menu-item-only-child ant-menu-item-selected":"ant-menu-item ant-menu-item-only-child"}  onClick={()=>setCollapsed(!collapsed)} key={'password'}>
              <Link to={`/user/password`}>Reset password</Link>
            </Menu.Item>
             
            </SubMenu>
          )}

       { user && user.token &&  <Menu.Item  onClick={handleLogout} key={'logout'}>
          <i className='fas fa-sign-out-alt'></i>
          Logout
        </Menu.Item>}

          <div className='logo'>Categories </div>

          {categories &&
            categories.length > 0 &&
            categories.map((cat) =>
              subs && subs.filter((s) => s.parent === cat._id).length > 0 ? (
                <SubMenu key={cat._id} title={cat.name}>
                  {subs &&
                    subs
                      .filter((s) => s.parent === cat._id)
                      .map((p) => (
                        <Menu.Item onClick={()=>setCollapsed(!collapsed)}  className={history.location.pathname === `/subs/product/${p.slug}`?"ant-menu-item ant-menu-item-only-child ant-menu-item-selected":"ant-menu-item ant-menu-item-only-child"} key={p._id}>
                          <Link to={`/subs/product/${p.slug}`}>{p.name}</Link>
                        </Menu.Item>
                      ))}
                </SubMenu>
              ) : (
                <Menu.Item key={cat._id}>{cat.name}</Menu.Item>
              )
            )}
        </Menu>
      </Sider>
      <Layout>
        <Headers />
        <Content
          id='scroll'
          style={{
            margin: '0',
            overflow: 'scroll',
            height: 'calc(100vh - 130px)',
            backgroundColor: 'white',
          }}
        >
          <div className='site-layout-background' style={{ padding: 0 }}>
          <div style={{height:'max-content'}}>
            {children}
            </div>
            <Footer style={{ textAlign: 'center' }}>
          Atlantis ©2020 Created by devsts14
            </Footer>
          </div>
          
        </Content>
   
      </Layout>
    </Layout>
  );
};

export default SideNav;
