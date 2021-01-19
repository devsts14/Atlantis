const User = require('../models/User');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Order = require('../models/Order');

const { v4: uuidv4 } = require('uuid');

exports.userCart = async (req, res) => {
  const { cart } = req.body;
  const user = await User.findOne({ email: req.user.email }).exec();
  const userCart = user.cart;

  const present =
    userCart && userCart.length > 0 && userCart.find((p) => p._id === cart._id);
  if (present) {
    const ind = userCart.indexOf(present);
    console.log(present, 'present');
    if(userCart[ind].count+1 <= userCart[ind].quantity){
    userCart[ind].count += 1;
    }
    const resCart = await User.findOneAndUpdate(
      { email: req.user.email },
      { cart: userCart },
      { new: true }
    );
    res.json(resCart.cart);
  } else {
    userCart.push(cart);
    const resCart = await User.findOneAndUpdate(
      { email: req.user.email },
      { cart: userCart },
      { new: true }
    );
    res.json(resCart.cart);
  }
};

exports.cartBeforeLogin = async (req, res) => {
  const cart = [...req.body.cart];
  const user = await User.findOne({ email: req.user.email }).exec();
  const userCart = user.cart;
  for (const [i, elem] of cart.entries()) {
    const present = userCart.find((p) => {
      return p._id === elem._id;
    });
    if (present) {
      console.log('yes');
      const ind = userCart.indexOf(present);
      console.log('index', ind);
      userCart[ind].count += cart[i].count;
    } else {
      console.log('no');
      userCart.push(elem);
    }
  }
  const resCart = await User.findOneAndUpdate(
    { email: req.user.email },
    { cart: userCart },
    { new: true }
  );
  res.json(resCart.cart);
};

exports.updateCartQuantity = async (req, res) => {
  //
  const { productId, quantity } = req.body;
  const user = await User.findOne({ email: req.user.email }).exec();
  const userCart = user.cart;
  const updatingProduct = userCart.find((p) => {
    return p._id === productId;
  });
  const ind = userCart.indexOf(updatingProduct);
  userCart[ind].count = quantity;
  const resCart = await User.findOneAndUpdate(
    { email: req.user.email },
    { cart: userCart },
    { new: true }
  ).exec();
  console.log(resCart);
  res.json(resCart.cart);
};

exports.deleteCartItem = async (req, res) => {
  const { productId } = req.body;
  const user = await User.findOne({ email: req.user.email }).exec();
  const userCart = user.cart;

  userCart.map((product, i) => {
    if (product._id === productId) {
      userCart.splice(i, 1);
    }
  });
  const resCart = await User.findOneAndUpdate(
    { email: req.user.email },
    { cart: userCart },
    { new: true }
  ).exec();
  console.log(resCart);
  res.json(resCart.cart);
};

exports.getCartTotal = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  const total = user.cart.reduce((p, n) => {
    return p + n.price * n.count;
  }, 0);
  console.log(total);
  const userCart = user.cart;
  res.json({ total, userCart });
};

exports.clearCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  const userCart = [];
  const resCart = await User.findOneAndUpdate(
    { email: req.user.email },
    { cart: userCart },
    { new: true }
  ).exec();
  res.json(resCart.cart);
};

exports.addAddress = async (req, res) => {
  const { address } = req.body;
  console.log(address);
  if (address) {
    const user = await User.findOne({ email: req.user.email }).exec();
    const addressArray = user.address;
    const present =
      addressArray.length > 0 &&
      address._id &&
      addressArray.find((a) => {
        return a._id === address._id;
      });

    if (present) {
      //
      const ind = addressArray.indexOf(present);
      addressArray[ind] = address;
      const resAddress = await User.findOneAndUpdate(
        { email: req.user.email },
        { address: addressArray },
        { new: true }
      ).exec();
      res.json(resAddress.address);
    } else {
      address._id = uuidv4();
      addressArray.push(address);
      const resAddress = await User.findOneAndUpdate(
        { email: req.user.email },
        { address: addressArray },
        { new: true }
      ).exec();
      res.json(resAddress.address);
    }
  }
};

exports.getAddress = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  res.json(user.address);
};

exports.deleteAddress = async (req, res) => {
  const { address } = req.body;
  if (address) {
    const user = await User.findOne({ email: req.user.email }).exec();
    const addressArray = user.address;
    const present =
      addressArray.length > 0 &&
      address._id &&
      addressArray.find((a) => {
        return a._id === address._id;
      });

    if (present) {
      //
      const ind = addressArray.indexOf(present);
      addressArray.splice(ind, 1);
      const resAddress = await User.findOneAndUpdate(
        { email: req.user.email },
        { address: addressArray },
        { new: true }
      ).exec();
      res.json(resAddress.address);
    }
  }
};

exports.applyCouponToUserCart = async (req, res) => {
  const { coupon } = req.body;
  console.log(coupon);
  const validCoupon = await Coupon.findOne({ name: coupon }).exec();
  if (validCoupon === null) {
    return res.json({
      err: 'Invalid coupon',
    });
  }
  const user = await User.findOne({ email: req.user.email }).exec();
  const total = user.cart.reduce((p, n) => {
    return p + n.price * n.count;
  }, 0);
  console.log(total);
  let totalDiscount = (
    total -
    (total * parseInt(validCoupon.discount)) / 100
  ).toFixed(2);
  res.json({ totalDiscount, coupon });
};

exports.createOrder = async (req, res) => {
  console.log(req.body);
  const { address, cartTotal, totalAfterDiscount } = req.body;
  const paymentIntent = req.body.stripeResponse;
  const user = await User.findOne({ email: req.user.email }).exec();
  const addressIt = user.address.find((a) => a._id === address);
console.log(addressIt);
  let newOrder = await new Order({
    products: user.cart,
    paymentIntent,
    address:JSON.stringify(addressIt),
    totalAmount: cartTotal,
    amountAfterDiscount: totalAfterDiscount,
    orderedBy: user._id,
  }).save();
  let bulkOption = user.cart.map((item) => {
    return {
      updateOne: {
        filter: { _id: item._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });
  let updated = await Product.bulkWrite(bulkOption, {});
  console.log('updated', updated);
  console.log(newOrder);
  res.json({ ok: true,newOrder });
};

exports.getOrders = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  let userOrders = await Order.find({ orderedBy: user._id }).exec();
  res.json(userOrders);
};
exports.getSingleOrder = async (req, res) => {
  const orderId = req.params.orderId;
  const user = await User.findOne({ email: req.user.email }).exec();
  let userOrder = await Order.findById(orderId).exec();

  // const addressIt = user.address.find((a) => a._id === userOrder.address);
  // console.log(addressIt);
  // userOrder.address = JSON.stringify(addressIt);
  // console.log(userOrder.address);
  res.json(userOrder);
};

exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $addToSet: { wishlist: productId } },
    { new: true }
  ).exec();
  res.json({ ok: true });
};
exports.getWishlist = async (req, res) => {
  const list = await User.findOne({ email: req.user.email })
    .select('wishlist')
    .populate('wishlist')
    .exec();
  res.json(list);
};
exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  console.log(productId);
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishlist: productId } }
  ).exec();
  res.json({ ok: true });
};

exports.addToRecentlyViewed = async (req, res) => {
  const { productId } = req.body;
  console.log("productId",productId)

  if (productId !== null && productId !== '') {
    const user = await User.findOne({ email: req.user.email }).exec();
    const recentlyViewed = user.recentlyViewed;
    if (user && user.recentlyViewed.length <= 10) {
      console.log("productId",productId)
      const present =
        recentlyViewed.length > 0 &&
        recentlyViewed.find((p) => {
          return  p.toString() === productId.toString();
        });
      console.log('present', present);
      if (present) {
        console.log('yes');
        const ind = recentlyViewed.indexOf(present);
        console.log('index', ind);
        recentlyViewed.splice(ind, 1);
        recentlyViewed.push(productId);
        const resAddress = await User.findOneAndUpdate(
          { email: req.user.email },
          { recentlyViewed: recentlyViewed },
          { new: true }
        ).exec();
      } else {
        const user1 = await User.findOneAndUpdate(
          { email: req.user.email },
          { $addToSet: { recentlyViewed: productId } },
          { new: true }
        ).exec();
      }
      res.json({ ok: true });
    } else {
      const present =
        recentlyViewed.length > 0 &&
        recentlyViewed.find((p) => {
          return p === productId;
        });
      console.log('present', present);

      if (present) {
        console.log('yes');
        const ind = recentlyViewed.indexOf(present);
        console.log('index', ind);
        recentlyViewed.splice(ind, 1);
        recentlyViewed.push(productId);
        const resAddress = await User.findOneAndUpdate(
          { email: req.user.email },
          { recentlyViewed: recentlyViewed },
          { new: true }
        ).exec();
      } else {
        const user3 = await User.findOneAndUpdate(
          { email: req.user.email },
          { $addToSet: { recentlyViewed: productId } },
          { new: true }
        ).exec();
      }
      const user2 = await User.findOneAndUpdate(
        { email: req.user.email },
        { $pop: { recentlyViewed: -1 } },
        { new: true }
      ).exec();

      res.json({ ok: true });
    }
  }
};

exports.getRecentlyViewed = async (req, res) => {
  const user = await User.findOne({ email: req.user.email })
    .populate('recentlyViewed')
    .limit(10)
    .exec();
  res.json(user.recentlyViewed);
};


exports.realTimeCart=async (req, res)=>{
  const user = await User.findOne({ email: req.user.email }).exec();
  let userCart= user.cart
  const products = await Product.find({}).exec();
  console.log(userCart);
  if(userCart.length>0){
 let finalCart=userCart.map((p)=>{
   return products.filter((up)=>{
   return up._id.toString() === p._id.toString()

    }).map((f)=>{
      if(f._id.toString() === p._id.toString()){
        let item = JSON.parse(JSON.stringify(f))
        item.count=p.count
        console.log(item)
        return item
      }
    })
  })
  console.log(finalCart.flat())
  const finalUpdatedCart = await User.findOneAndUpdate({ email: req.user.email },{cart:finalCart.flat()},{new:true}).exec();
  res.json(finalUpdatedCart.cart);
}
else {
  return;
}
}


exports.checkOOS=async(req,res)=>{
  const user = await User.findOne({ email: req.user.email }).exec();
  const userCart=user.cart
  const outOfStock=userCart.filter((p)=>{
    return p.quantity <1
  })
  if(outOfStock.length>0){
    res.json({msg:'Some items in cart are out of stock'})
  }
  else{
    res.json({msg:'ok'})
  }

}