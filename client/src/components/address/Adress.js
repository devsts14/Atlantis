import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import { Popconfirm, message } from 'antd';

import { addAddress, getAddress, deleteAddress } from '../../functions/user';
import { useSelector, useDispatch } from 'react-redux';
import Alert from '../../components/alert/Alert';
import { Radio } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';


const Adress = ({address,setAddress}) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [addresses, setAddresses] = useState([]);
  // const [address, setAddress] = useState({});
  const [values, setValues] = useState({
    name: '',
    phone: '',
    house: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    country: '',
    pin: '',
    _id: '',
  });

  const {
    name,
    phone,
    house,
    street,
    landmark,
    city,
    state,
    country,
    pin,
    _id,
  } = values;

  useEffect(() => {
    if (user && user.token) {
      getAddress(user.token).then((res) => {
        setAddresses(res.data);
      });
    }
  }, []);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setValues({
      name: '',
      phone: '',
      house: '',
      street: '',
      landmark: '',
      city: '',
      state: '',
      country: '',
      pin: '',
      _id: '',
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setValues({
      name: '',
      phone: '',
      house: '',
      street: '',
      landmark: '',
      city: '',
      state: '',
      country: '',
      pin: '',
      _id: '',
    });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    //
    e.preventDefault();
    if (user && user.token) {
      addAddress(values, user.token).then((res) => {
        setAddresses(res.data);
        console.log(res);
        setValues({
          name: '',
          phone: '',
          house: '',
          street: '',
          landmark: '',
          city: '',
          state: '',
          country: '',
          pin: '',
          _id: '',
        });
        dispatch({
          type: 'ALERT',
          payload: {
            visibility: true,
            mess: _id !== '' ? 'Address updated' : 'Address saved',
            time: 4000,
            type: 'success',
          },
        });
      });
    }
  };

  const handleAddChange = (e) => {
    setAddress(e.target.value);
    console.log(e.target.value)
  };
  const editAddress = (a) => {
    setValues({
      name: a.name,
      phone: a.phone,
      house: a.house,
      street: a.street,
      landmark: a.landmark,
      city: a.city,
      state: a.state,
      country: a.country,
      pin: a.pin,
      _id: a._id,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (a) => {
    if (user && user.token) {
      deleteAddress(a, user.token).then((res) => {
        setAddresses(res.data);
        setAddress('');
      });
    }
  };
  function cancel(e) {
    console.log(e);
  }
  return (
    <div>

      <>
        <div className='add-address'>
        <h3 style={{ textAlign: 'center' }}>Select Address</h3>

          {addresses &&
            addresses.length > 0 &&
            addresses.map((a) => (
              <div  className={ address && address === a._id ? 'activeRadio address' : 'address'}>
              <label
                htmlFor={a._id}
              >
              {console.log(a._id)}
                <input
                 style={{display:'none'}}
                  id={a._id}
                  value={a._id}
                  type='radio'
                  name='add'
                  onChange={handleAddChange}
                />
                <div>
                  <span style={{ fontWeight: '800' }}>{a.name}</span>
                  <div>
                    <span>{a.phone}</span>
                  </div>
                  <div>
                    <span>{a.house}</span>
                  </div>
                  <span>{a.street}</span>
                  <div>
                    <span>{a.landmark !== '' && a.landmark}</span>
                  </div>

                  <div>
                    <span>{a.city},</span>
                    <span>{a.state},</span>
                    <span>{a.pin}</span>
                  </div>
                  <span>{a.country}</span>
                </div>
              </label>
              <div className='addressEdit'><Popconfirm
              title="Are you sure to delete this task?"
              onConfirm={()=>handleDelete(a)}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            ><i style={{cursor:'pointer'}} className="far fa-trash-alt"></i></Popconfirm><i style={{cursor:'pointer'}} onClick={()=>editAddress(a)} class="far fa-edit"></i></div>
              </div>
            ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <Button type='primary' onClick={showModal}>
            New Address
          </Button>
        </div>
        <Modal
          title={_id !== '' ? 'Update Address' : 'New Address'}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <form onSubmit={handleSubmit} className='address-form'>
            <label htmlFor='name'>
              Full name <sup>*</sup>
              <input
                className='address-form-item'
                onChange={handleChange}
                value={name}
                required
                name='name'
              />
            </label>
            <label htmlFor='phone'>
              Phone number <sup>*</sup>
              <input
                className='address-form-item'
                onChange={handleChange}
                name='phone'
                required
                value={phone}
                placeholder='10 digit mobile number without prefixes'
                type='number'
                maxLength='10'
              />
            </label>
            <label htmlFor='house'>
              Flat, House no., Building, Company, Apartment <sup>*</sup>
              <textarea
                className='address-form-item'
                onChange={handleChange}
                name='house'
                value={house}
                required
                id=''
                rows='3'
              ></textarea>
            </label>
            <label htmlFor='street'>
              Area, Colony, Street, Sector, Village <sup>*</sup>
              <textarea
                className='address-form-item'
                onChange={handleChange}
                name='street'
                value={street}
                required
                id=''
                rows='3'
              ></textarea>
            </label>
            <label htmlFor='landmark'>
              Landmark
              <input
                className='address-form-item'
                onChange={handleChange}
                name='landmark'
                value={landmark}
                type='text'
              />
            </label>
            <label htmlFor='city'>
              Town/City <sup>*</sup>
              <input
                className='address-form-item'
                onChange={handleChange}
                name='city'
                value={city}
                required
                type='text'
              />
            </label>
            <label htmlFor='pin'>
              Pin Code <sup>*</sup>
              <input
                type='number'
                onChange={handleChange}
                className='address-form-item'
                name='pin'
                value={pin}
                placeholder='6 digits [0-9] pincode'
              />
            </label>
            <label htmlFor='state'>
              State / Province / Region <sup>*</sup>
              <input
                className='address-form-item'
                onChange={handleChange}
                name='state'
                value={state}
                required
                type='text'
                placeholder='
'
              />
            </label>
            <label htmlFor='country'>
              Country <sup>*</sup>
              <input
                className='address-form-item'
                onChange={handleChange}
                name='country'
                value={country}
                required
                type='text'
              />
            </label>
            <Alert />
            <input type='submit' value='Save' />
          </form>
        </Modal>
      </>
    </div>
  );
};

export default Adress;
