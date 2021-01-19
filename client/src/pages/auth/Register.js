import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../images/seaweed.png';
import { auth, googleAuthProvider } from '../../firebase';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { userLoginCart } from '../../functions/user';

const Register = ({ history }) => {
  // States
  const [email, setEmail] = useState('');

  // redux
  const { user } = useSelector((state) => ({ ...state }));
  let dispatch = useDispatch();

  // mounts
  useEffect(() => {
    if (user && user.token) {
      history.push('/');
    }
  }, [user]);

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
      handleCodeInApp: true,
    };
    await auth.sendSignInLinkToEmail(email, config);
    toast.success(
      `Email sent to ${email}.Click on link to complete registration`
    );
    window.localStorage.setItem('emailForRegistration', email);
    setEmail('');
  };

  // handle change
  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  // google login
  const googleLogin = async () => {
    auth
      .signInWithPopup(googleAuthProvider)
      .then(async (result) => {
        const { user } = result;
        const idToken = await user.getIdTokenResult();

        dispatch({
          type: 'LOGGED_IN_USER',
          payload: {
            email: user.email,
            token: idToken.token,
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
        history.push('/');
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <div className='section'>
      <div className='auth-center'>
        <div className='branding'>
          <img src={logo} alt='logo' className='logo' />
          <span className='branding'>Atlantis</span>
        </div>
        <div className='register-form'>
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <div className='email-input'>
              <i className='far fa-envelope'></i>
              <input
                type='email'
                placeholder='email'
                autoFocus
                required
                value={email}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <button type='submit' className='submit-btn'>
              Send{' '}
            </button>
          </form>
        </div>
        <div className='form-or'>
          <span>
            Already have an account?<Link to='/login'>Login</Link>
          </span>
          <span>Or</span>
          <button onClick={googleLogin} className='google-login-btn'>
            <i className='fab fa-google'></i>oogle Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
