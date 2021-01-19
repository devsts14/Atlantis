import axios from 'axios'

export const userCart=async (cart,authtoken)=>{
  return await axios.post(`${process.env.REACT_APP_API}/user/cart`,{cart},{
    headers: {
      authtoken
    }
  })}


  export const userLoginCart =async(cart,authtoken)=>{
    return await axios.post(`${process.env.REACT_APP_API}/user/cartBeforeLogin`,{cart},{
      headers: {
        authtoken
      }
    })
  }


  export const updateCartQuantity =async(productId,quantity,authtoken)=>{
    return await axios.post(`${process.env.REACT_APP_API}/user/updateCartQuantity`,{productId,quantity},{
      headers: {
        authtoken
      }
    })
  }

  export const deleteCartItem =async(productId,authtoken)=>{
    return await axios.post(`${process.env.REACT_APP_API}/user/deleteCartItem`,{productId},{
      headers: {
        authtoken
      }
    })
  }


  export const getCartTotal=async(authtoken)=>{
    return await axios.get(`${process.env.REACT_APP_API}/user/cart/total`,{
      headers: {
        authtoken
      }
    })
  }


  export const clearCartAll= async(authtoken)=>{
    return await axios.post(`${process.env.REACT_APP_API}/user/clearCart`,{},{
      headers: {
        authtoken
      }
    })
  }

  export const addAddress=async(address,authtoken)=>{
    return await axios.post(`${process.env.REACT_APP_API}/user/addAddress`,{address},{
      headers: {
        authtoken
      }
    })
  }



  export const getAddress=async(authtoken)=>{
    return await axios.get(`${process.env.REACT_APP_API}/user/getAddress`,{
      headers: {
        authtoken
      }
    })
  }


  export const deleteAddress=async(address,authtoken)=>{
    return await axios.post(`${process.env.REACT_APP_API}/user/deleteAddress`,{address},{
      headers: {
        authtoken
      }
    })
  }


  export const applyCoupon=async(authtoken,coupon)=>{
    return await axios.post(`${process.env.REACT_APP_API}/user/cart/coupon`,{coupon},{
      headers: {
        authtoken
      }
    })
  }


  export const createOrder=async(stripeResponse,address,cartTotal,totalAfterDiscount,authtoken)=>{
    return await axios.post(`${process.env.REACT_APP_API}/user/order`,{stripeResponse,address,cartTotal,totalAfterDiscount},{
      headers: {
        authtoken
      }
    })
  }


  
  export const getOrders=async(authtoken)=>{
    return await axios.get(`${process.env.REACT_APP_API}/user/orders`,{
      headers: {
        authtoken
      }
    })
  }
  export const getSingleOrder=async(orderId,authtoken)=>{
    return await axios.get(`${process.env.REACT_APP_API}/user/order/${orderId}`,{
      headers: {
        authtoken
      }
    })
  }


  export const getWishlist=async(authtoken)=>{
    return await axios.get(`${process.env.REACT_APP_API}/user/wishlist`,{
      headers: {
        authtoken
      }
    })
  }
  export const removeWishlist=async(productId,authtoken)=>{
    return await axios.put(`${process.env.REACT_APP_API}/user/wishlist/${productId}`,{},{
      headers: {
        authtoken
      }
    })
  }

  export const addToWishlist=async(productId,authtoken)=>{
    return await axios.post(`${process.env.REACT_APP_API}/user/wishlist`,{productId},{
      headers: {
        authtoken
      }
    })
  }

  export const addToRecentlyViewed=async(productId,authtoken)=>{
    return await axios.post(`${process.env.REACT_APP_API}/user/products/recentlyViewed`,{productId},{
      headers: {
        authtoken
      }
    })
  }

  export const getRecentlyViewed=async(authtoken)=>{
    return await axios.get(`${process.env.REACT_APP_API}/user/products/recentlyViewed`,{
      headers: {
        authtoken
      }
    })
  }


  export const realTime=async(authtoken)=>{
    return await axios.get(`${process.env.REACT_APP_API}/user/cart/realtime`,{
      headers: {
        authtoken
      }
    })
  }

  export const checkOOS=async(authtoken)=>{
    return await axios.get(`${process.env.REACT_APP_API}/user/checkOOS`,{
      headers: {
        authtoken
      }
    })
  }