const express =require('express');
const router=express.Router()

const {create,listAll,remove,read,update,list,productsCount,productStar,listRelated,searchFilters,getAllProducts,getProductsBasedOnCategory}=require('../controllers/product')
const {authCheck,adminCheck} =require("../middlewares/auth")

// routes
router.post('/product',authCheck,adminCheck,create)
router.get('/products/total',productsCount)
router.get('/products/:count',listAll)
router.delete('/product/:slug',authCheck,adminCheck,remove)
router.get('/product/:slug',read)
router.put('/product/:slug',authCheck,adminCheck,update)
router.post('/products',list)
router.put('/product/star/:productId',authCheck,productStar)
router.get('/product/related/:productId',listRelated)
router.post('/search/filters',searchFilters)
router.get('/products/all',getAllProducts)
router.get('/products/category/:categoryId',getProductsBasedOnCategory)
module.exports=router;