const Category=require('../models/category');
const Sub=require('../models/subCategory');
const slugify = require('slugify')
const Product = require('../models/Product')

exports.create=async (req,res)=>{
  try {
    const {name}=req.body;
    const category = await new Category({name,slug:slugify(name)}).save();
    res.json(category)
  } catch (error) {
    console.log(error)
    res.status(400).send('Create category failed')
  }
}


exports.update=async (req,res)=>{
  const {name}=req.body;
  try {
    const updated= await Category.findOneAndUpdate({slug:req.params.slug},{name,slug:slugify(name)},{new:true})
    res.json(updated)
  } catch (error) {
    res.status(400).send('Create update failed')

  }
}



exports.remove=async (req,res)=>{
try {
  const deleted= await Category.findOneAndDelete({slug:req.params.slug})
  res.json(deleted)
} catch (error) {
  res.status(400).send('Create delete failed')

}}



exports.read=async (req,res)=>{
  console.log(req.params.slug)
let category=await Category.findOne({slug:req.params.slug}).exec()
// res.json(category)
const products=await Product.find({category})
.populate('category')
.exec()

const subs = await Sub.find({parent:category})
.populate('subs')
.exec()
res.json({category,products,subs})
}



exports.list=async (req,res)=>{
  res.json(await Category.find({}).sort({createdAt:-1}).exec())
}


exports.getSubs=async (req,res)=>{
Sub.find({parent:req.params._id}).exec((err,subs)=>{
  if(err){
    console.log(err)
  }
  else{
    res.json(subs)
  }
})
}