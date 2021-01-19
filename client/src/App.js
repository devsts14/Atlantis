import { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import CompleteRegistration from './pages/auth/CompleteRegistration';
import Header from './components/nav/Header';
import AdminSideNav from './components/nav/AdminSideNav'
import UserDashboard from './pages/user/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import CategoryCreate from './pages/admin/category/CategoryCreate';
import CategoryUpdate from './pages/admin/category/CategoryUpdate'
import SubUpdate from './pages/admin/sub/SubUpdate'
import SubCreate from './pages/admin/sub/subCreate'
import ProductCreate from './pages/admin/product/ProductCreate'
import ProductUpdate from './pages/admin/product/ProductUpdate'
import UserRoute from './components/routes/UserRoute';
import AdminRoute from './components/routes/AdminRoute';
import Password from './pages/user/Password';
import WhishList from './pages/user/Whishlist';
import Cart from './pages/Cart';
import ProductsList from './pages/admin/product/ProductsList'
import { auth } from './firebase';
import { useDispatch } from 'react-redux';
import { currentUser } from './functions/auth';
import Product from './pages/Product'
import SideNav from './components/home/SideNav'
import ProductsBasedObSubs from './pages/admin/sub/ProductsBasedOnSubs'
import Search from './pages/Search'
import SideDrawer from './components/drawer/SideDrawer'
import Checkout from './pages/Checkout'
import CreateCoupon from './pages/coupon/CreateCoupon'
import Payment from './pages/Payment'
import Order from './pages/user/Order'
import AdminOrder from './pages/admin/AdminOrder'
import ProductsBOC from './pages/user/ProductsBOC'
import Result from './components/result/Result'
 const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idToken = await user.getIdTokenResult();
        currentUser(idToken.token)
          .then((res) =>
            dispatch({
              type: 'LOGGED_IN_USER',
              payload: {
                name: res.data.name,
                email: res.data.email,
                token: idToken.token,
                role: res.data.role,
                picture: res.data.picture,
                _id: res.data._id,
              },
            })
          )
          .catch((err) => console.log(err));
      }
    });
  }, []);
  return (
    <>
      <SideNav>
      <SideDrawer/>
      <ToastContainer />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <Route
          exact
          path='/register/complete'
          component={CompleteRegistration}
        />
        <Route exact path='/forgot/password' component={ForgotPassword} />
        <UserRoute exact path='/user/dashboard' component={UserDashboard} />
        <UserRoute exact path='/user/password' component={Password} />
        <UserRoute exact path='/user/wishlist' component={WhishList} />
        <UserRoute exact path='/user/payment' component={Payment} />

        <AdminRoute exact path='/admin/dashboard' component={AdminDashboard} />
        <AdminRoute exact path='/admin/category' component={CategoryCreate} />
        <AdminRoute exact path='/admin/category/:slug' component={CategoryUpdate} />
        <AdminRoute exact path='/admin/sub' component={SubCreate} />
        <AdminRoute exact path='/admin/sub/:slug' component={SubUpdate} />
       
        <AdminRoute exact path='/admin/product/:slug' component={ProductUpdate} />
        <AdminRoute exact path='/admin/product' component={ProductCreate} />
        <AdminRoute exact path='/admin/products' component={ProductsList} />
        <Route exact path="/product/:slug" component={Product}/>
        <Route exact path="/subs/product/:slug" component={ProductsBasedObSubs}/>
        <Route exact path="/search" component={Search}/>
        <Route exact path="/cart" component={Cart}/>
        <Route exact path="/products/:categoryId" component={ProductsBOC}/>
        <UserRoute exact path='/checkout' component={Checkout} />
        <AdminRoute exact path='/admin/coupon' component={CreateCoupon} />
        <UserRoute exact path='/user/order/:orderId' component={Order} />
        <UserRoute exact path='/user/payment/result' component={Result} />
        <AdminRoute exact path='/admin/order/:orderId' component={AdminOrder} />

      </Switch>
      </SideNav>
    </>
  );
};

export default App;
