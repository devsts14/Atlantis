import React from 'react';
import { Link } from 'react-router-dom';

const AdminSideNav = () => {
  const active = (urlPath) => {
    if (window.location.pathname === urlPath) {
      return 'active';
    } else {
      return;
    }
  };
  return (
    <nav className='side-nav'>
      <Link className={active('/admin/dashboard')} to='/admin/dashboard'>
        <i class='fas fa-tachometer-alt'></i> Dashboard
      </Link>
      <Link className={active('/admin/product')} to='/admin/product'>
        <i class='fas fa-key'></i> Product
      </Link>
      <Link className={active('/admin/products')} to='/admin/products'>
        {' '}
        <i class='fas fa-list'></i> Products
      </Link>
      <Link className={active('/admin/category')} to='/admin/category'>
        {' '}
        <i class='fas fa-clipboard-list'></i> Category
      </Link>

      <Link className={active('/admin/sub')} to='/admin/sub'>
        <i class='fas fa-bezier-curve'></i> Sub Category
      </Link>
      <Link className={active('/admin/coupon')} to='/admin/coupon'>
        {' '}
        <i class='fas fa-bookmark'></i> Coupons
      </Link>
    </nav>
  );
};

export default AdminSideNav;
