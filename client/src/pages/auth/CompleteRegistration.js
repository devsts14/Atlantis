import React, { useState, useEffect } from 'react';
import logo from '../../images/seaweed.png';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { createOrUpdateUser } from '../../functions/auth';
import { userLoginCart } from '../../functions/user';

const CompleteRegistration = ({ history }) => {
  // states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // redux
  let dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));

  // mounts
  useEffect(() => {
    if (user && user.token) {
      history.push('/');
    }
  }, [user]);

  useEffect(() => {
    setEmail(window.localStorage.getItem('emailForRegistration'));
  }, []);

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email and password required');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be atleast 6 characters in length');
      return;
    }

    try {
      const result = await auth.signInWithEmailLink(
        email,
        window.location.href
      );
      console.log(result);
      if (result.user.emailVerified) {
        window.localStorage.removeItem('emailForRegistration');
        let user = auth.currentUser;
        await user.updatePassword(password);
        const idToken = await user.getIdTokenResult();
        createOrUpdateUser(idToken.token)
          .then((res) => {
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
            });

            if (localStorage.getItem('cart')) {
              const cart = JSON.parse(localStorage.getItem('cart'));
              userLoginCart(cart, idToken.token).then((res) => {
                localStorage.setItem('cart', JSON.stringify(res.data));
                dispatch({
                  type: 'ADD_TO_CART',
                  payload: res.data,
                });
              });
            }
          })
          .catch((err) => console.log(err));

        history.push('/');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // change
  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className='section'>
      <div className='auth-center'>
        <div className='branding'>
          <img src={logo} alt='logo' className='logo' />
          <span className='branding'>Atlantis</span>
        </div>
        <div className='register-form'>
          <h1>Complete Registration</h1>
          <form onSubmit={handleSubmit}>
            <div className='email-input'>
              <i className='far fa-envelope'></i>
              <input
                type='email'
                placeholder='email'
                autoFocus
                required
                value={email}
                disabled
              />
            </div>
            <div className='email-input'>
              <i className='fas fa-key'></i>
              <input
                value={password}
                type='password'
                placeholder='password'
                onChange={(e) => handleChange(e)}
              />
            </div>

            <button type='submit' className='submit-btn'>
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteRegistration;
