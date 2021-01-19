const express =require('express');
const router=express.Router()

const {authCheck,adminCheck} =require("../middlewares/auth")
const {upload,remove} = require("../controllers/cloudinary")
// routes
router.post('/uploadimages',authCheck,adminCheck,upload)
router.post('/removeimage',remove)


module.exports=router;