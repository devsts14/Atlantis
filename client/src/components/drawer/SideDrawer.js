import React from 'react';
import { Drawer } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Alert from '../alert/Alert';

const SideDrawer = () => {
  const dispatch = useDispatch();
  const { drawer, cart } = useSelector((state) => ({ ...state }));
  return (
    <Drawer
      title={`Cart / ${cart.length} Products`}
      onClose={() => {
        dispatch({
          type: 'SET_VISIBLE',
          payload: false,
        });
      }}
      visible={drawer}
    >
      <div className='drawer'>
        <Alert msg={'Alert'} interval={1000} />
        <Link
          onClick={() => {
            dispatch({
              type: 'SET_VISIBLE',
              payload: false,
            });
          }}
          to='/cart'
          className='go-to-cart'
        >
          Go to Cart
        </Link>

        {cart &&
          cart.length > 0 &&
          cart.map((p) => (
            <div key={p._id} className='drawer'>
              <div className='sideDrawer-item'>
                <div className='image'>
                  <img
                    style={{ width: '150px', height: '150px' }}
                    src={ p.images[0].url}
                    alt=''
                  />
                </div>
                <div className='info'>
                  <span>{`${p.title.substr(0, 30)}${
                    p.title.length > 30 ? '...' : ''
                  }`}</span>
                  <span style={{ alignSelf: 'center' }}>
                    Quantity:{p.count}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </Drawer>
  );
};

export default SideDrawer;
