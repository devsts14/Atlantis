const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    products:{
      type:Array,
      default:[]
    },
    paymentIntent:{},
    orderStatus:{
      type:String,
      default:'Not Processed',
      enum:[
        "Not Processed",
        "processing",
        "Shipped",
        "Out for delivery",
        "Delivered",
        "Cancelled",
      ]
    },
    address:{
      type:String,
      default:''
    },
    totalAmount:{
      type:Number,
      default:0
    },
    amountAfterDiscount:{
      type:Number,
      default:0
    },
    orderedBy:{type:ObjectId,ref:'User'}
  

  },{timestamps:true})

  module.exports =mongoose.model('Order',orderSchema)