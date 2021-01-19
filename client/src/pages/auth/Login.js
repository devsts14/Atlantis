import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../images/seaweed.png';
import { auth, googleAuthProvider } from '../../firebase';
import { toast} from 'react-toastify';
import { createOrUpdateUser, roleBasedRedirect } from '../../functions/auth';
import {userLoginCart} from '../../functions/user'
import {useSelector,useDispatch} from 'react-redux'

const Login = ({ history }) => {
// states
  const [email, setEmail] = useState('shaunvividsz@gmail.com');
  const [password, setPassword] = useState('shaun123');

  // redux
  const { user} = useSelector((state) => ({ ...state }));
  let dispatch = useDispatch();

  let intended=history.location.state

  // mounts
  useEffect(() => {
    if (intended) {
      return;
    } 
    else {
      if (user && user.token) {
        history.push('/');
      }
    }
  }, [user,history,intended]);
  

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      const { user } = result;
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
          
          if(localStorage.getItem('cart')){
          const cart = JSON.parse(localStorage.getItem('cart'))
          userLoginCart(cart,idToken.token)
          .then((res)=>{
            localStorage.setItem('cart',JSON.stringify(res.data))
            dispatch({
                  type:'ADD_TO_CART',
                  payload:res.data
                })
          })
          }
          roleBasedRedirect(history, res);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      toast.error(error.message);
    }
  };


// google login
  const googleLogin = async () => {
    auth
      .signInWithPopup(googleAuthProvider)
      .then(async (result) => {
        const { user } = result;
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
             
          if(localStorage.getItem('cart')){
            const cart = JSON.parse(localStorage.getItem('cart'))
            userLoginCart(cart,idToken.token)
            .then((res)=>{
              localStorage.setItem('cart',JSON.stringify(res.data))
              dispatch({
                    type:'ADD_TO_CART',
                    payload:res.data
                  })
            })
            }
            roleBasedRedirect(history, res);
          })
          .catch((err) => console.log(err));
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
          <h1>Login</h1>

          <form onSubmit={handleSubmit}>
            <div className='email-input'>
              <i className='far fa-envelope'></i>
              <input
                type='email'
                placeholder='email'
                autoFocus
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='email-input'>
              <i className='fas fa-key'></i>
              <input
                type='password'
                placeholder='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type='submit' className='submit-btn'>
              Login
            </button>
          </form>
        </div>
        <div className='form-or'>
          <span id='or'>Or</span>
          <button onClick={googleLogin} className='google-login-btn'>
            <i className='fab fa-google'></i>oogle Login
          </button>
          <span>
            No account?<Link to='/register'>Register</Link>
          </span>
          <Link
            style={{
              color: '#f05454',
              margin: '0.5rem 0',
              alignSelf: 'center',
            }}
            to='/forgot/password'
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
