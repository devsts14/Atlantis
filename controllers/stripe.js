const User=require('../models/User')
const Cart=require('../models/Cart')
const Product=require('../models/Product')
const Coupon=require('../models/Coupon')
const stripe = require('stripe')(process.env.STRIPE_SECRET)


exports.createPaymentIntent=async(req,res)=>{
  // apply coupon
  // calculate price
  const {appliedCoupon}=req.body
  const validCoupon= await Coupon.findOne({name:appliedCoupon}).exec()
let finalTotal=0;
const user=await User.findOne({email:req.user.email}).exec()
const total=user.cart.reduce((p,n)=>{return p+(n.price * n.count)},0)
console.log(total)
if(total>0){
let totalDiscount=0
  if(validCoupon !== null){
    totalDiscount = (total-(total * parseInt(validCoupon.discount)) / 100).toFixed(2)
   finalTotal=totalDiscount
  }
  else{
finalTotal=total;
  }


  const paymentIntent=await stripe.paymentIntents.create({
    amount:parseInt(finalTotal * 100),
    currency:"inr",
    description: 'Software development services'
  })

  res.send({
    clientSecret:paymentIntent.client_secret,
    totalDiscount,
    total,
    appliedCoupon
  })
}
}