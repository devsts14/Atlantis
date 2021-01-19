const Product = require('../models/Product');
const slugify = require('slugify');
const User = require('../models/User');

exports.create = async (req, res) => {
  try {
    console.log(req.body);
    req.body.slug = slugify(req.body.title);
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(400).send('Create product failed');
  }
};

exports.listAll = async (req, res) => {
  let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate('category')
    .populate('subs')
    .sort([['createdAt', 'desc']])
    .exec();

  res.json(products);
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    res.json(deleted);
  } catch (error) {
    console.log(error);
    return res.status(400).send('Product delete failed');
  }
};

exports.read = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate('category')
    .populate('subs')
    .exec();
  res.json(product);
};

exports.update = async (req, res) => {
  try {
    // if(req.body.title){
    //   req.body.slug=slugify(req.body.title)
    // }

    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    ).exec();
    res.json(updated);
  } catch (error) {
    console.log(error);
  }
};

// exports.list=async(req,res)=>{
//   try {
//     const {sort,order,limit} =req.body;
//     const products=await Product.find({})
//     .populate('category')
//     .populate('subs')
//     .sort([[sort,order]])
//     .limit(limit)
//     .exec();
//     res.json(products)
//   } catch (error) {
//     console.log(error);
//   }
// }

exports.list = async (req, res) => {
  try {
    const { sort, order, page } = req.body;
    const currentPage = page || 1;
    const perPage = 4;
    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate('category')
      .populate('subs')
      .sort([[sort, order]])
      .limit(perPage)
      .exec();
    res.json(products);
  } catch (error) {
    console.log(error);
  }
};

exports.productsCount = async (req, res) => {
  let total = await Product.find({}).estimatedDocumentCount().exec();
  console.log(total);

  res.json(total);
};

exports.productStar = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  const user = await User.findOne({ email: req.user.email }).exec();
  const { star } = req.body;
  let existingRatingObject = product.ratings.find(
    (ele) => ele.postedBy.toString() === user._id.toString()
  );

  if (existingRatingObject === undefined) {
    let ratingAdded = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: { ratings: { star: star, postedBy: user._id } },
      },
      { new: true }
    ).exec();
    const sum = ratingAdded.ratings.reduce((p,n)=>{return p+n.star},0)
    const avgRatings= (sum * 5) / (ratingAdded.ratings.length * 5);
  let resultRating=await Product.findByIdAndUpdate(product._id,{avgRatings},{new:true}).exec()
  console.log("result rating",resultRating);
    res.json(resultRating);
  } else {
    const ratingUpdated = await Product.updateOne(
      { ratings: { $elemMatch: existingRatingObject } },
      { $set: { 'ratings.$.star': star } },
      { new: true }
    ).exec();
    console.log("rating updated",ratingUpdated);
    const updatingProduct =await Product.findById(product._id).exec()
    const sum = updatingProduct.ratings.reduce((p,n)=>{return (p+n.star)},0)
    const avgRatings=(sum * 5) / (updatingProduct.ratings.length * 5);
  console.log(avgRatings);
  let resultRatingUpdated=await Product.findByIdAndUpdate(product._id,{avgRatings},{new:true}).exec()
  console.log(resultRatingUpdated,"updated rating");
    res.json(ratingUpdated);
  }
};

exports.listRelated = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate('category')
    .populate('subs')
    .populate('postedBy')
    .exec();
  console.log(related);
  res.json(related);
};

const handleQuery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec();
  res.json(products);
};

const handlePrice = async (req, res, price) => {
  try {
    let products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate('category', '_id name')
      .populate('subs', '_id name')
      .populate('postedBy', '_id name')
      .exec();

    res.json(products);
  } catch (error) {
    console.log(error);
  }
};

exports.searchFilters = async (req, res) => {
  const { price} = req.body;
  const rating = parseInt(req.body.rating);
  console.log(req.body);
  console.log(price,rating);
  const category = req.body.category || '';
  const sub = req.body.sub || '';
  const sort = req.body.sort || '';

  const min =
    price && price[0] && Number(price[0]) !== 0 ? Number(price[0]) : 0;
  const max =
    price && price[1] && Number(price[1]) !== 0 ? Number(price[1]) : 0;
  const priceFilter =
    min >= 0 && max ? { price: { $gte: min, $lte: max } } : {};
  console.log(category);
  const categoryFilter = category ? { category } : {};
  const subFilter = sub ? { subs:sub } : {};
  const ratingFilter = rating ? { avgRatings:{ $gte: rating }} : {};

  const sortOrder =
  sort === 'lowest'
    ? { price: 1 }
    : sort === 'highest'
    ? { price: -1 }
    : sort === 'toprated'
    ? { avgRatings: -1 }
    : { _id:-1};

  const products = await Product.find({ ...priceFilter, ...categoryFilter,...ratingFilter,...subFilter })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .sort(sortOrder)
    .exec();
  res.json(products);
};

exports.getAllProducts = async (req, res) => {
  const products = await Product.find({})
    .populate('category')
    .populate('subs')
    .exec();
  res.json(products);
};


exports.getProductsBasedOnCategory = async (req, res)=>{
  const {categoryId}=req.params
  const products = await Product.find({category:categoryId})
  .populate('category')
  .populate('subs')
  .exec();
res.json(products);
}