const express =require('express');
const router=express.Router()
const {authCheck,adminCheck} =require("../middlewares/auth")

const {userCart,cartBeforeLogin,updateCartQuantity,deleteCartItem,getCartTotal,clearCart,addAddress,getAddress,deleteAddress,applyCouponToUserCart,createOrder,getOrders,getSingleOrder,addToWishlist,getWishlist,removeFromWishlist,addToRecentlyViewed,getRecentlyViewed,realTimeCart,checkOOS}=require('../controllers/user')

// router.get('/user',(req,res)=>{
//   res.json({
//     data:"user endpoint"
//   })
// })
router.post('/user/cart',authCheck,userCart)
router.post('/user/cartBeforeLogin',authCheck,cartBeforeLogin)
router.post('/user/updateCartQuantity',authCheck,updateCartQuantity)
router.post('/user/deleteCartItem',authCheck,deleteCartItem)
router.get('/user/cart/total',authCheck,getCartTotal)
router.post('/user/clearCart',authCheck,clearCart)
router.get('/user/cart/realtime',authCheck,realTimeCart)
router.post('/user/addAddress',authCheck,addAddress)
router.get('/user/getAddress',authCheck,getAddress)
router.get('/user/checkOOS',authCheck,checkOOS)
router.post('/user/deleteAddress',authCheck,deleteAddress)
router.post('/user/cart/coupon',authCheck,applyCouponToUserCart)
router.get('/user/orders',authCheck,getOrders)
router.get('/user/order/:orderId',authCheck,getSingleOrder)
router.post('/user/order',authCheck,createOrder)
router.post('/user/wishlist',authCheck,addToWishlist)
router.get('/user/wishlist',authCheck,getWishlist)
router.put('/user/wishlist/:productId',authCheck,removeFromWishlist)
router.post('/user/products/recentlyViewed',authCheck,addToRecentlyViewed)
router.get('/user/products/recentlyViewed',authCheck,getRecentlyViewed)
module.exports=router;