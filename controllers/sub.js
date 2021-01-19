const Sub=require('../models/subCategory');
const slugify = require('slugify')
const Product=require('../models/Product')

exports.create=async (req,res)=>{
  try {
    const {name,parent}=req.body;
    const sub = await new Sub({name,parent,slug:slugify(name)}).save();
    res.json(sub)
  } catch (error) {
    console.log(error)
    res.status(400).send('Create sub failed')
  }
}


exports.update=async (req,res)=>{
  const {name,parent}=req.body;
  try {
    const updated= await Sub.findOneAndUpdate({slug:req.params.slug},{name,parent,slug:slugify(name)},{new:true})
    res.json(updated)
  } catch (error) {
    res.status(400).send('Create update failed')

  }
}



exports.remove=async (req,res)=>{
try {
  const deleted= await Sub.findOneAndDelete({slug:req.params.slug})
  res.json(deleted)
} catch (error) {
  res.status(400).send('Create delete failed')

}}



exports.read=async (req,res)=>{
  console.log(req.params.slug)
let sub= await Sub.findOne({slug:req.params.slug})
.populate('parent')
.exec()
console.log(sub)
let products = await Product.find({subs:sub})
res.json({sub,products})
}



exports.list=async (req,res)=>{
  res.json(await Sub.find({}).sort({createdAt:-1}).exec())
}