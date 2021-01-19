const Product = require('../models/Product');
const slugify = require('slugify');
const User = require('../models/User');
const Order = require('../models/Order');


exports.orders= async (req, res)=>{
let allOrders = await Order.find({})
.sort("-createdAt")
.exec()
res.json(allOrders)
}


exports.orderStatus =async (req, res)=>{
const {orderId,orderStatus}=req.body;

let updated =  await Order.findByIdAndUpdate(orderId,{orderStatus},{new:true}).exec()

res.json(updated)
}


exports.getSingleAdminOrder =async (req,res)=>{
  const orderId=req.params.orderId
  const user=await User.findOne({email:req.user.email}).exec()
  let userOrder = await Order.findById(orderId).exec()

  // const addressIt = user.address.find((a)=>a._id === userOrder.address )
  // console.log(addressIt);
  // userOrder.address=JSON.stringify(addressIt)
  console.log(userOrder.address)
res.json(userOrder)
}



